/**
 * 剧本场景API
 * 处理场景获取、用户进度管理和无限流功能
 */

const EnhancedScriptManager = require('../utils/enhanced-script-manager');

// 创建全局脚本管理器实例
let scriptManager = null;

// 初始化脚本管理器（异步）
async function initializeScriptManager() {
  if (!scriptManager) {
    scriptManager = new EnhancedScriptManager();
    await scriptManager.initializeScripts();
  }
  return scriptManager;
}

/**
 * 获取当前场景
 * GET /api/script-scene/current
 */
exports.getCurrentScene = async (req, res) => {
  try {
    const { userId, scriptId } = req.query;
    
    if (!userId || !scriptId) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数：userId 和 scriptId'
      });
    }
    
    await initializeScriptManager();
    
    // 检查是否需要提示用户继续对话
    const continueDialog = scriptManager.shouldContinueDialog(userId, scriptId);
    
    // 获取当前场景
    const currentScene = scriptManager.getCurrentScene(userId, scriptId);
    
    if (!currentScene) {
      return res.status(404).json({
        success: false,
        message: '场景不存在'
      });
    }
    
    res.json({
      success: true,
      data: {
        scene: currentScene,
        continueDialog,
        promptMessage: continueDialog.shouldPrompt ? 
          '距离上次对话已过去一段时间，是否继续探索这个故事？' : null
      }
    });
    
  } catch (error) {
    console.error('获取场景失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

/**
 * 开始新的对话会话
 * POST /api/script-scene/new-session
 */
exports.startNewSession = async (req, res) => {
  try {
    const { userId, scriptId } = req.body;
    
    if (!userId || !scriptId) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数：userId 和 scriptId'
      });
    }
    
    await initializeScriptManager();
    
    // 开始新会话
    const progress = scriptManager.startNewSession(userId, scriptId);
    
    // 获取新场景
    const newScene = scriptManager.getCurrentScene(userId, scriptId);
    
    res.json({
      success: true,
      data: {
        progress,
        scene: newScene,
        message: '新的探索之旅开始了！'
      }
    });
    
  } catch (error) {
    console.error('开始新会话失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

/**
 * 继续当前会话
 * POST /api/script-scene/continue
 */
exports.continueSession = async (req, res) => {
  try {
    const { userId, scriptId } = req.body;
    
    if (!userId || !scriptId) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数：userId 和 scriptId'
      });
    }
    
    await initializeScriptManager();
    
    // 获取当前进度
    const progress = scriptManager.getUserProgress(userId, scriptId);
    
    // 获取当前场景
    const currentScene = scriptManager.getCurrentScene(userId, scriptId);
    
    res.json({
      success: true,
      data: {
        progress,
        scene: currentScene,
        message: '欢迎回来，让我们继续探索！'
      }
    });
    
  } catch (error) {
    console.error('继续会话失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

/**
 * 更新用户进度
 * POST /api/script-scene/progress
 */
exports.updateProgress = async (req, res) => {
  try {
    const { userId, scriptId, updates } = req.body;
    
    if (!userId || !scriptId || !updates) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数：userId、scriptId 和 updates'
      });
    }
    
    await initializeScriptManager();
    
    // 更新进度
    const updatedProgress = scriptManager.updateUserProgress(userId, scriptId, updates);
    
    res.json({
      success: true,
      data: {
        progress: updatedProgress
      }
    });
    
  } catch (error) {
    console.error('更新进度失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

/**
 * 获取下一个场景
 * POST /api/script-scene/next
 */
exports.getNextScene = async (req, res) => {
  try {
    const { userId, scriptId, userResponse } = req.body;
    
    if (!userId || !scriptId) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数：userId 和 scriptId'
      });
    }
    
    await initializeScriptManager();
    
    // 记录用户回应
    if (userResponse) {
      const progress = scriptManager.getUserProgress(userId, scriptId);
      progress.userResponses.push({
        message: userResponse,
        timestamp: new Date(),
        sceneIndex: progress.currentSceneIndex
      });
    }
    
    // 更新进度到下一个场景
    const updatedProgress = scriptManager.updateUserProgress(userId, scriptId, {
      currentSceneIndex: (scriptManager.getUserProgress(userId, scriptId).currentSceneIndex || 0) + 1
    });
    
    // 获取下一个场景
    const nextScene = scriptManager.getCurrentScene(userId, scriptId);
    
    res.json({
      success: true,
      data: {
        scene: nextScene,
        progress: updatedProgress
      }
    });
    
  } catch (error) {
    console.error('获取下一场景失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

/**
 * 获取剧本的所有场景概览
 * GET /api/script-scene/overview
 */
exports.getSceneOverview = async (req, res) => {
  try {
    const { scriptId } = req.query;
    
    if (!scriptId) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数：scriptId'
      });
    }
    
    await initializeScriptManager();
    
    const script = scriptManager.getScript(scriptId);
    
    if (!script) {
      return res.status(404).json({
        success: false,
        message: '剧本不存在'
      });
    }
    
    res.json({
      success: true,
      data: {
        scriptInfo: {
          id: script.id,
          title: script.title,
          description: script.description,
          totalScenes: script.totalScenes,
          infiniteMode: script.infiniteMode
        },
        scenes: script.sceneList.map(scene => ({
          index: scene.index,
          name: scene.name,
          description: scene.description,
          phase: scene.phase
        }))
      }
    });
    
  } catch (error) {
    console.error('获取场景概览失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

/**
 * 获取用户的探索历史
 * GET /api/script-scene/history
 */
exports.getUserHistory = async (req, res) => {
  try {
    const { userId, scriptId } = req.query;
    
    if (!userId || !scriptId) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数：userId 和 scriptId'
      });
    }
    
    await initializeScriptManager();
    
    const progress = scriptManager.getUserProgress(userId, scriptId);
    
    res.json({
      success: true,
      data: {
        progress,
        sessionHistory: {
          totalSessions: progress.sessionCount,
          totalTimeSpent: progress.totalTimeSpent,
          lastAccess: progress.lastAccess,
          completedScenes: progress.completedScenes.length,
          responses: progress.userResponses.length
        }
      }
    });
    
  } catch (error) {
    console.error('获取用户历史失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

/**
 * 生成个性化场景推荐
 * POST /api/script-scene/recommend
 */
exports.getSceneRecommendation = async (req, res) => {
  try {
    const { userId, scriptId, currentMood, preferences } = req.body;
    
    if (!userId || !scriptId) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数：userId 和 scriptId'
      });
    }
    
    await initializeScriptManager();
    
    const progress = scriptManager.getUserProgress(userId, scriptId);
    const script = scriptManager.getScript(scriptId);
    
    // 基于用户心情和偏好生成推荐
    const recommendation = {
      suggestedPhase: this.determineSuggestedPhase(currentMood, preferences),
      personalizedPrompt: this.generatePersonalizedPrompt(progress, currentMood),
      adaptedScenes: this.getAdaptedScenes(script, progress, currentMood)
    };
    
    res.json({
      success: true,
      data: {
        recommendation,
        message: '为你量身定制的探索建议已准备好！'
      }
    });
    
  } catch (error) {
    console.error('生成场景推荐失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
};

// 辅助方法
function determineSuggestedPhase(mood, preferences) {
  if (mood === 'confused' || mood === 'seeking') return 'exploration';
  if (mood === 'sad' || mood === 'healing') return 'resolution';
  if (mood === 'excited' || mood === 'curious') return 'opening';
  return 'development';
}

function generatePersonalizedPrompt(progress, mood) {
  const promptTemplates = {
    confused: '让我们一起理清这些复杂的感受',
    sad: '在这个安全的空间里，你可以自由表达内心的痛苦',
    excited: '我能感受到你的热情，让我们深入探索',
    healing: '现在是时候关注内心的治愈和成长了'
  };
  
  return promptTemplates[mood] || '让我们继续这段心灵之旅';
}

function getAdaptedScenes(script, progress, mood) {
  // 根据心情调整场景顺序和重点
  return script.sceneList.slice(0, 5).map(scene => ({
    ...scene,
    adaptedDescription: this.adaptSceneToMood(scene.description, mood),
    recommendationReason: this.getRecommendationReason(scene, mood)
  }));
}

function adaptSceneToMood(description, mood) {
  const adaptations = {
    confused: '通过这个场景，我们可以一起梳理复杂的情感',
    sad: '这个温柔的场景可以给你需要的安慰和理解',
    excited: '这个充满可能性的场景会激发更多思考',
    healing: '这个成长导向的场景有助于内心的修复'
  };
  
  return adaptations[mood] || description;
}

function getRecommendationReason(scene, mood) {
  return `基于你当前的${mood}状态，这个场景特别适合现在的你`;
} 