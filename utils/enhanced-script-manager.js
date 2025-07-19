/**
 * 增强版剧本数据管理器
 * 支持动态剧本生成、无限流体验和场景管理
 */

const ScriptGenerator = require('./script-generator');

class EnhancedScriptManager {
  constructor() {
    this.scriptDatabase = {};
    this.sceneCache = new Map(); // 缓存动态生成的场景
    this.userProgress = new Map(); // 用户进度跟踪
    this.generator = new ScriptGenerator();
  }

  /**
   * 初始化剧本数据库 - 从预设数据生成
   */
  async initializeScripts() {
    try {
      // 在微信小程序环境中，我们使用预设的剧本列表
      const scriptList = this.getPresetScriptList();
      
      for (const scriptInfo of scriptList) {
        // 转换为适合当前系统的格式
        this.scriptDatabase[scriptInfo.id] = this.convertToSystemFormat(scriptInfo);
      }
      
      console.log(`✅ 成功初始化 ${Object.keys(this.scriptDatabase).length} 个剧本`);
    } catch (error) {
      console.error('初始化剧本数据库失败:', error);
      // 回退到静态数据
      this.initializeFallbackScripts();
    }
  }

  /**
   * 获取预设剧本列表
   */
  getPresetScriptList() {
    return [
      {
        id: 'script_001',
        title: '职场沟通场景',
        difficulty: 'medium',
        scriptType: 'professional',
        estimatedDuration: '15-20分钟',
        emotionalIntensity: 'medium',
        summary: '在职场环境中处理与同事或上司的沟通冲突',
        originalContent: '职场沟通挑战：如何在压力下保持专业和情感平衡',
        characters: ['职场新人', '资深同事'],
        tags: ['职场', '沟通', '人际关系'],
        scenes: this.generateDefaultScenes('职场沟通', 30)
      },
      {
        id: 'script_002',
        title: '家庭关系场景',
        difficulty: 'high',
        scriptType: 'family',
        estimatedDuration: '20-25分钟',
        emotionalIntensity: 'high',
        summary: '探索家庭成员之间的深层情感连接',
        originalContent: '家庭关系探索：理解家人间的情感需求和期待',
        characters: ['子女', '父母'],
        tags: ['家庭', '亲情', '理解'],
        scenes: this.generateDefaultScenes('家庭关系', 30)
      },
      {
        id: 'script_003',
        title: '情感表达场景',
        difficulty: 'medium',
        scriptType: 'romantic',
        estimatedDuration: '15-20分钟',
        emotionalIntensity: 'medium',
        summary: '学习如何真诚地表达内心感受',
        originalContent: '情感表达练习：突破内心障碍，真实表达感受',
        characters: ['情感表达者', '倾听者'],
        tags: ['情感', '表达', '真诚'],
        scenes: this.generateDefaultScenes('情感表达', 30)
      }
    ];
  }

  /**
   * 生成默认场景列表
   */
  generateDefaultScenes(theme, count) {
    const scenes = [];
    for (let i = 1; i <= count; i++) {
      scenes.push({
        index: i,
        name: `${theme}场景 ${i}`,
        description: `第${i}个${theme}相关的互动场景`,
        phase: this.determinePhase(i - 1, count)
      });
    }
    return scenes;
  }

  /**
   * 转换生成的剧本信息为系统格式
   */
  convertToSystemFormat(scriptInfo) {
    return {
      id: scriptInfo.id,
      title: scriptInfo.title,
      type: this.mapDifficultyToType(scriptInfo.difficulty),
      difficulty: scriptInfo.difficulty,
      duration: scriptInfo.estimatedDuration,
      energyMode: scriptInfo.emotionalIntensity === 'high',
      description: scriptInfo.summary,
      originalStory: scriptInfo.originalContent,
      cover: `/assets/scripts_list/${scriptInfo.id.replace('script_', '').padStart(3, '0')}.jpeg`,
      
      // 角色设定
      scriptType: scriptInfo.scriptType,
      mainCharacters: scriptInfo.characters,
      characterCount: scriptInfo.characters.length,
      
      // AI和用户角色定义
      aiRole: this.generateAIRole(scriptInfo),
      userRole: this.generateUserRole(scriptInfo),
      
      // 头像配置
      avatarConfig: this.generateAvatarConfig(scriptInfo.scriptType),
      
      // 标签系统
      tags: scriptInfo.tags,
      emotions: this.extractEmotions(scriptInfo.originalContent),
      
      // 场景系统
      sceneList: scriptInfo.scenes,
      totalScenes: scriptInfo.scenes.length,
      
      // 核心场景（从30个场景中提取关键场景）
      keyScenes: this.extractKeyScenes(scriptInfo.scenes),
      
      // 对话引导策略
      dialogueGuides: this.generateDialogueGuides(scriptInfo),
      
      // 预期收获
      benefits: this.generateBenefits(scriptInfo),
      
      // 无限流配置
      infiniteMode: {
        enabled: true,
        sceneVariations: 5, // 每个场景有5种变化
        newContentThreshold: 0.7, // 70%概率生成新内容
        personalizedScenes: true // 基于用户历史生成个性化场景
      }
    };
  }

  /**
   * 获取当前场景 - 支持无限流
   */
  getCurrentScene(userId, scriptId) {
    const progress = this.getUserProgress(userId, scriptId);
    const script = this.getScript(scriptId);
    
    if (!script) return null;
    
    // 检查是否需要生成新场景
    if (this.shouldGenerateNewScene(progress, script)) {
      return this.generateDynamicScene(userId, scriptId, progress);
    }
    
    // 返回预设场景
    const sceneIndex = progress.currentSceneIndex || 0;
    const scene = script.sceneList[sceneIndex];
    
    if (!scene) {
      // 如果超出预设场景，生成新场景
      return this.generateDynamicScene(userId, scriptId, progress);
    }
    
    return {
      ...scene,
      isNewContent: false,
      sceneNumber: sceneIndex + 1,
      totalScenes: script.totalScenes,
      phase: this.determinePhase(sceneIndex, script.totalScenes)
    };
  }

  /**
   * 判断是否应该生成新场景
   */
  shouldGenerateNewScene(progress, script) {
    // 如果用户重新进入剧本，有70%概率生成新内容
    if (progress.sessionCount > 1) {
      return Math.random() < script.infiniteMode.newContentThreshold;
    }
    
    return false;
  }

  /**
   * 生成动态场景 - 实现无限流
   */
  generateDynamicScene(userId, scriptId, progress) {
    const script = this.getScript(scriptId);
    const cacheKey = `${userId}_${scriptId}_${progress.currentSceneIndex}`;
    
    // 检查缓存
    if (this.sceneCache.has(cacheKey)) {
      return this.sceneCache.get(cacheKey);
    }
    
    // 生成新场景
    const newScene = {
      index: progress.currentSceneIndex + 1,
      name: this.generateSceneName(progress, script),
      description: this.generateSceneDescription(progress, script),
      phase: this.determinePhase(progress.currentSceneIndex, script.totalScenes),
      isNewContent: true,
      sceneNumber: progress.currentSceneIndex + 1,
      totalScenes: '∞', // 无限场景
      dynamicPrompt: this.generateDynamicPrompt(progress, script)
    };
    
    // 缓存场景
    this.sceneCache.set(cacheKey, newScene);
    
    return newScene;
  }

  /**
   * 用户进度管理
   */
  getUserProgress(userId, scriptId) {
    const key = `${userId}_${scriptId}`;
    
    if (!this.userProgress.has(key)) {
      this.userProgress.set(key, {
        userId,
        scriptId,
        currentSceneIndex: 0,
        sessionCount: 1,
        totalTimeSpent: 0,
        lastAccess: new Date(),
        completedScenes: [],
        userResponses: [],
        emotionalJourney: []
      });
    }
    
    return this.userProgress.get(key);
  }

  /**
   * 更新用户进度
   */
  updateUserProgress(userId, scriptId, updates) {
    const progress = this.getUserProgress(userId, scriptId);
    Object.assign(progress, updates);
    progress.lastAccess = new Date();
    
    return progress;
  }

  /**
   * 检查用户是否应该继续对话
   */
  shouldContinueDialog(userId, scriptId) {
    const progress = this.getUserProgress(userId, scriptId);
    const timeSinceLastAccess = Date.now() - progress.lastAccess.getTime();
    
    // 如果超过24小时，提示用户是否继续
    return {
      shouldPrompt: timeSinceLastAccess > 24 * 60 * 60 * 1000,
      lastAccess: progress.lastAccess,
      sessionCount: progress.sessionCount,
      completedScenes: progress.completedScenes.length
    };
  }

  /**
   * 开始新的对话会话
   */
  startNewSession(userId, scriptId) {
    const progress = this.getUserProgress(userId, scriptId);
    progress.sessionCount += 1;
    progress.lastAccess = new Date();
    
    // 清除场景缓存以确保新体验
    const cacheKeys = Array.from(this.sceneCache.keys()).filter(key => 
      key.startsWith(`${userId}_${scriptId}`)
    );
    cacheKeys.forEach(key => this.sceneCache.delete(key));
    
    return progress;
  }

  /**
   * 获取剧本
   */
  getScript(scriptId) {
    return this.scriptDatabase[scriptId];
  }

  /**
   * 获取所有剧本
   */
  getAllScripts() {
    return Object.values(this.scriptDatabase);
  }

  // 辅助方法
  generateAIRole(scriptInfo) {
    const roleDescriptions = {
      '男主本': '温柔理解的女性朋友，能够倾听和给予情感支持',
      '女主本': '成熟稳重的男性朋友，擅长提供客观视角和建议',
      '双女主': '善解人意的女性朋友，专长于情感交流和共鸣',
      '双男主': '可靠的男性朋友，擅长理性分析和支持',
      '不限人群': '经验丰富的心理陪伴者，能够适应不同的角色需求'
    };
    
    return roleDescriptions[scriptInfo.scriptType] || roleDescriptions['不限人群'];
  }

  generateUserRole(scriptInfo) {
    const coreThemes = this.extractCoreThemes(scriptInfo.originalContent);
    return `正在经历${coreThemes.join('和')}的人，希望通过对话获得理解和成长`;
  }

  generateAvatarConfig(scriptType) {
    const configs = {
      '男主本': {
        aiAvatar: '/assets/user/role1.jpg',    // AI扮演女性
        userAvatar: '/assets/user/role2.jpg'   // 用户是男性视角
      },
      '女主本': {
        aiAvatar: '/assets/user/role2.jpg',    // AI扮演男性
        userAvatar: '/assets/user/role1.jpg'   // 用户是女性视角
      },
      '双女主': {
        aiAvatar: '/assets/user/role1.jpg',
        userAvatar: '/assets/user/role1.jpg'
      },
      '双男主': {
        aiAvatar: '/assets/user/role2.jpg',
        userAvatar: '/assets/user/role2.jpg'
      },
      '不限人群': {
        aiAvatar: '/assets/user/role1.jpg',
        userAvatar: '/assets/user/role2.jpg'
      }
    };
    
    return configs[scriptType] || configs['不限人群'];
  }

  extractKeyScenes(scenes) {
    const keyIndices = [0, 4, 9, 14, 19, 24, 27, 29]; // 分布在不同阶段的关键点
    
    return keyIndices.map(index => {
      const scene = scenes[index];
      if (!scene) return null;
      
      return {
        name: scene.name,
        setting: scene.description,
        emotion: this.inferEmotionFromScene(scene),
        question: this.generateSceneQuestion(scene),
        meaning: this.generateSceneMeaning(scene)
      };
    }).filter(Boolean);
  }

  generateDialogueGuides(scriptInfo) {
    return [
      {
        phase: 'opening',
        prompt: '温和地询问用户的情感经历，建立信任',
        questions: this.generateOpeningQuestions(scriptInfo)
      },
      {
        phase: 'exploration',
        prompt: '深入探索具体的情感体验和感受',
        questions: this.generateExplorationQuestions(scriptInfo)
      },
      {
        phase: 'insight',
        prompt: '帮助用户获得新的认知和理解',
        questions: this.generateInsightQuestions(scriptInfo)
      },
      {
        phase: 'healing',
        prompt: '引导用户找到内在力量和成长方向',
        questions: this.generateHealingQuestions(scriptInfo)
      }
    ];
  }

  determinePhase(sceneIndex, totalScenes) {
    const progress = sceneIndex / totalScenes;
    
    if (progress <= 0.2) return 'opening';
    if (progress <= 0.6) return 'development';
    if (progress <= 0.9) return 'conflict';
    return 'resolution';
  }

  generateSceneName(progress, script) {
    const phaseNames = {
      opening: ['新的开始', '另一种可能', '不同的视角', '重新审视', '深入内心'],
      development: ['情感深化', '复杂交织', '微妙变化', '内心波动', '关系探索'],
      conflict: ['情感冲突', '内心挣扎', '艰难选择', '痛苦觉醒', '关键时刻'],
      resolution: ['新的理解', '内在成长', '释然接受', '智慧获得', '重新出发']
    };
    
    const phase = this.determinePhase(progress.currentSceneIndex, script.totalScenes);
    const names = phaseNames[phase] || phaseNames.development;
    
    return names[Math.floor(Math.random() * names.length)];
  }

  generateSceneDescription(progress, script) {
    const templates = [
      '从另一个角度重新审视这段经历',
      '探索内心深处未被发现的感受',
      '发现新的情感层面和可能性',
      '在熟悉的故事中找到新的意义',
      '用新的智慧重新理解过往'
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  generateDynamicPrompt(progress, script) {
    return {
      rolePrompt: script.aiRole,
      sceneContext: `用户正在经历${script.type}类型的情感探索，当前是第${progress.currentSceneIndex + 1}次对话`,
      guidanceStyle: '采用更加个性化和深入的引导方式，基于用户的历史回应调整对话策略',
      specialInstructions: '这是动态生成的场景，要展现出与之前不同的新视角和洞察'
    };
  }

  // 其他辅助方法
  mapDifficultyToType(difficulty) {
    const mapping = {
      '轻松入门': '情感入门',
      '适度探索': '情感治愈',
      '深度体验': '深度剧情'
    };
    return mapping[difficulty] || '情感治愈';
  }

  extractEmotions(content) {
    const emotions = [];
    const emotionPatterns = [
      { pattern: /开心|快乐|幸福|甜蜜/g, emotion: '快乐' },
      { pattern: /难过|伤心|痛苦|失望/g, emotion: '悲伤' },
      { pattern: /困惑|迷茫|纠结/g, emotion: '困惑' },
      { pattern: /愤怒|生气|不满/g, emotion: '愤怒' },
      { pattern: /平静|安详|释然/g, emotion: '平静' }
    ];
    
    emotionPatterns.forEach(({ pattern, emotion }) => {
      if (pattern.test(content)) {
        emotions.push(emotion);
      }
    });
    
    return [...new Set(emotions)];
  }

  extractCoreThemes(content) {
    const themes = [];
    if (content.includes('暗恋') || content.includes('喜欢')) themes.push('暗恋');
    if (content.includes('分手') || content.includes('分离')) themes.push('分离');
    if (content.includes('困惑') || content.includes('迷茫')) themes.push('困惑');
    if (content.includes('成长') || content.includes('学会')) themes.push('成长');
    return themes.length > 0 ? themes : ['情感'];
  }

  generateBenefits(scriptInfo) {
    return [
      '获得情感支持和理解',
      '学会处理复杂情感',
      '发现内在成长的力量',
      '找到面对挑战的勇气'
    ];
  }

  generateOpeningQuestions(scriptInfo) {
    return [
      '最近在情感上有什么困扰你的事情吗？',
      '想和我聊聊你的心情吗？',
      '有什么特别想要理解或解决的感受吗？'
    ];
  }

  generateExplorationQuestions(scriptInfo) {
    return [
      '这种感受是什么时候开始的？',
      '你觉得这件事对你意味着什么？',
      '在这个过程中，你最在意的是什么？'
    ];
  }

  generateInsightQuestions(scriptInfo) {
    return [
      '从这次经历中，你学到了什么？',
      '现在回想起来，你的感受有什么变化吗？',
      '这段经历如何改变了你？'
    ];
  }

  generateHealingQuestions(scriptInfo) {
    return [
      '你想对过去的自己说些什么？',
      '现在的你会如何面对类似的情况？',
      '你觉得自己变得更强大了吗？'
    ];
  }

  inferEmotionFromScene(scene) {
    if (scene.name.includes('相遇') || scene.name.includes('开始')) return '期待';
    if (scene.name.includes('冲突') || scene.name.includes('争吵')) return '愤怒';
    if (scene.name.includes('分离') || scene.name.includes('结束')) return '悲伤';
    if (scene.name.includes('理解') || scene.name.includes('成长')) return '释然';
    return '复杂';
  }

  generateSceneQuestion(scene) {
    const questions = [
      '在这个时刻，你的内心是什么感受？',
      '如果是你，会怎么处理这种情况？',
      '这种经历让你想到了什么？',
      '你觉得这代表着什么意义？'
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }

  generateSceneMeaning(scene) {
    const meanings = [
      '探索内心真实的感受和需求',
      '理解关系中的复杂动态',
      '学会接受和处理不确定性',
      '发现成长和改变的可能性'
    ];
    return meanings[Math.floor(Math.random() * meanings.length)];
  }

  /**
   * 回退方案：初始化静态剧本数据
   */
  initializeFallbackScripts() {
    this.scriptDatabase = {
      'script_001': {
        id: 'script_001',
        title: '未完成的梦',
        type: '情感治愈',
        difficulty: '入门级',
        duration: 30,
        energyMode: false,
        description: '一个关于暗恋与告别的温柔故事，探索那些美好却不完整的感情记忆。',
        scriptType: '男主本',
        tags: ['男主本', '暗恋情结', '青春遗憾'],
        sceneList: Array.from({length: 30}, (_, i) => ({
          index: i + 1,
          name: `场景${i + 1}`,
          description: '一个关于情感探索的重要时刻'
        })),
        infiniteMode: { enabled: true, sceneVariations: 5, newContentThreshold: 0.7 },
        totalScenes: 30,
        aiRole: '温柔理解的女性朋友，能够倾听和给予情感支持',
        userRole: '正在经历暗恋和青春遗憾的人，希望通过对话获得理解和成长',
        avatarConfig: {
          aiAvatar: '/assets/user/role1.jpg',
          userAvatar: '/assets/user/role2.jpg'
        },
        benefits: [
          '获得情感支持和理解',
          '学会处理复杂情感',
          '发现内在成长的力量',
          '找到面对挑战的勇气'
        ]
      }
    };
  }
}

module.exports = EnhancedScriptManager;