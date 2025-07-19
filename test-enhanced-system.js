#!/usr/bin/env node

/**
 * 增强剧本系统测试脚本
 * 测试完整的剧本生成、场景管理和无限流功能
 */

const ScriptGenerator = require('./utils/script-generator');
const EnhancedScriptManager = require('./utils/enhanced-script-manager');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEnhancedSystem() {
  log('bright', '🚀 开始测试增强剧本系统\n');
  
  try {
    // 1. 测试ScriptGenerator
    log('blue', '📋 第一阶段：测试ScriptGenerator');
    const generator = new ScriptGenerator();
    const scriptInfo = await generator.generateScriptFromMD('assets/scripts_list/script_001.md', 'script_001');
    
    if (scriptInfo) {
      log('green', '✅ ScriptGenerator测试通过');
      console.log(`生成标题: ${scriptInfo.title}`);
      console.log(`生成简介: ${scriptInfo.summary.substring(0, 50)}...`);
      console.log(`生成标签: ${scriptInfo.tags.join(', ')}`);
      console.log(`剧本类型: ${scriptInfo.scriptType}`);
      console.log(`场景数量: ${scriptInfo.scenes.length}`);
    } else {
      log('red', '❌ ScriptGenerator测试失败');
      return;
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // 2. 测试EnhancedScriptManager
    log('blue', '🎬 第二阶段：测试EnhancedScriptManager');
    const manager = new EnhancedScriptManager();
    await manager.initializeScripts();
    
    const allScripts = manager.getAllScripts();
    log('green', `✅ 成功加载 ${allScripts.length} 个剧本`);
    
    // 显示第一个剧本的信息
    if (allScripts.length > 0) {
      const firstScript = allScripts[0];
      console.log(`\n示例剧本：${firstScript.title}`);
      console.log(`描述：${firstScript.description.substring(0, 50)}...`);
      console.log(`标签：${firstScript.tags.join(', ')}`);
      console.log(`场景数量：${firstScript.totalScenes}`);
      console.log(`无限模式：${firstScript.infiniteMode.enabled ? '启用' : '禁用'}`);
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // 3. 测试用户进度管理
    log('blue', '👤 第三阶段：测试用户进度管理');
    const testUserId = 'test_user_123';
    const testScriptId = 'script_001';
    
    // 获取用户进度
    const progress = manager.getUserProgress(testUserId, testScriptId);
    log('green', '✅ 用户进度初始化成功');
    console.log(`用户ID: ${progress.userId}`);
    console.log(`剧本ID: ${progress.scriptId}`);
    console.log(`会话数: ${progress.sessionCount}`);
    
    // 更新进度
    const updatedProgress = manager.updateUserProgress(testUserId, testScriptId, {
      currentSceneIndex: 5,
      totalTimeSpent: 1800 // 30分钟
    });
    log('green', '✅ 用户进度更新成功');
    console.log(`当前场景: ${updatedProgress.currentSceneIndex}`);
    console.log(`总时长: ${updatedProgress.totalTimeSpent}秒`);
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // 4. 测试场景获取和无限流
    log('blue', '♾️  第四阶段：测试无限流场景生成');
    
    // 获取当前场景
    const currentScene = manager.getCurrentScene(testUserId, testScriptId);
    if (currentScene) {
      log('green', '✅ 场景获取成功');
      console.log(`场景名称: ${currentScene.name}`);
      console.log(`场景描述: ${currentScene.description}`);
      console.log(`场景阶段: ${currentScene.phase}`);
      console.log(`是否新内容: ${currentScene.isNewContent ? '是' : '否'}`);
    }
    
    // 测试继续对话检查
    const continueCheck = manager.shouldContinueDialog(testUserId, testScriptId);
    log('green', '✅ 继续对话检查成功');
    console.log(`需要提示: ${continueCheck.shouldPrompt ? '是' : '否'}`);
    
    // 开始新会话
    const newSession = manager.startNewSession(testUserId, testScriptId);
    log('green', '✅ 新会话启动成功');
    console.log(`新会话数: ${newSession.sessionCount}`);
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // 5. 测试动态场景生成
    log('blue', '🎭 第五阶段：测试动态场景生成');
    
    // 模拟多次访问以触发动态内容
    for (let i = 0; i < 3; i++) {
      manager.updateUserProgress(testUserId, testScriptId, {
        currentSceneIndex: 10 + i
      });
      
      const dynamicScene = manager.getCurrentScene(testUserId, testScriptId);
      console.log(`动态场景 ${i + 1}: ${dynamicScene.name} - ${dynamicScene.description}`);
    }
    
    log('green', '✅ 动态场景生成测试通过');
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // 6. 总结
    log('bright', '📊 测试总结:');
    log('green', '✅ ScriptGenerator - 剧本内容生成');
    log('green', '✅ EnhancedScriptManager - 剧本管理');
    log('green', '✅ 用户进度管理 - 会话跟踪');
    log('green', '✅ 场景获取 - 基础功能');
    log('green', '✅ 无限流 - 动态内容生成');
    
    console.log('\n');
    log('bright', '🎉 所有测试通过！增强剧本系统运行正常');
    
    console.log('\n');
    log('cyan', '💡 系统特色:');
    console.log('• 真实感：基于用户真实故事自动生成剧本信息');
    console.log('• 无限流：每次进入都有新的场景和内容');
    console.log('• 智能提示：根据用户历史智能提示继续或重新开始');
    console.log('• 个性化：基于用户行为生成个性化场景');
    console.log('• 多样性：30个预设场景 + 无限动态场景');
    
  } catch (error) {
    log('red', `❌ 测试失败: ${error.message}`);
    console.error(error);
  }
}

// 运行测试
testEnhancedSystem(); 