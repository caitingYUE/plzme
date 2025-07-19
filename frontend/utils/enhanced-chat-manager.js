/**
 * 增强聊天管理器
 * 实现选择卡+自由输入的混合交互模式和特殊功能
 */

const EnhancedScriptManager = require('./enhanced-script-manager');
const DeepSeekClient = require('./deepseek-client');
const ScriptManager = require('./script-manager');
// 1. 在类顶部引入分支查表工具
const relationshipBranches = require('./relationship-script-branches.js');

class EnhancedChatManager {
  constructor() {
    this.sessionData = new Map();
    this.scriptManager = new EnhancedScriptManager();
    this.regularScriptManager = ScriptManager.getInstance();
    this.deepSeekClient = new DeepSeekClient();
    this.maxSessions = 100;
  }

  /**
   * 初始化聊天管理器
   */
  async initialize() {
    await this.scriptManager.initializeScripts();
  }

  /**
   * 初始化聊天会话
   */
  async initializeSession(userId, scriptId, sessionParams = {}) {
    try {
      const sessionKey = `${userId}_${scriptId}_${Date.now()}`;
      
      console.log('=== 会话初始化开始 ===');
      console.log('用户ID:', userId);
      console.log('剧本ID:', scriptId);
      
      // 获取剧本信息
      let script = this.regularScriptManager.getScript(scriptId);
      console.log('从regular script manager获取剧本:', !!script);
      
      if (!script) {
        // 如果没找到，尝试添加script_前缀
        const fullScriptId = scriptId.startsWith('script_') ? scriptId : `script_${scriptId}`;
        script = this.regularScriptManager.getScript(fullScriptId);
        console.log('尝试完整格式ID:', fullScriptId, '结果:', !!script);
      }
      
      if (!script) {
        console.warn(`剧本 ${scriptId} 不存在，使用fallback`);
        script = this.createFallbackScript(scriptId);
      } else {
        console.log(`✅ 成功加载剧本: ${script.title}`);
      }

      // 确保script包含完整的数据结构
      if (!script.sceneList || script.sceneList.length === 0) {
        script.sceneList = [
          { name: '开始场景', description: '心理剧对话开始' },
          { name: '发展场景', description: '剧情逐渐展开' },
          { name: '结束场景', description: '对话达到高潮' }
        ];
      }

      // 获取当前场景 - 使用剧本的第一个真实场景
      const currentScene = script.sceneList && script.sceneList.length > 0 
        ? { ...script.sceneList[0], index: 1 } 
        : { index: 1, name: '开始场景', description: '心理剧对话开始' };
      
      // 初始化会话数据 - 与fallback保持一致的数据结构
      const sessionData = {
        sessionKey,
        userId,
        scriptId,
        script,
        currentScene,
        interactionCount: 0,
        messages: [],
        userChoices: [],
        conversationHistory: [],
        startTime: new Date(),
        lastInteractionTime: new Date(),
        currentChoices: [],
        lastChoiceGeneration: null,
        availableFeatures: [],
        showSpecialFeatures: false,
        // 保留部分原有字段用于兼容性
        emotionalJourney: [],
        currentPhase: 'opening',
        sessionStartTime: new Date(),
        specialFeaturesUsed: {
          innerMonologue: false,
          highEnergyMode: false,
          relationshipAnalysis: false
        },
        ...sessionParams
      };

      this.sessionData.set(sessionKey, sessionData);

      // 生成场景开场
      console.log('开始生成场景开场...');
      const openingMessage = await this.generateSceneOpening(sessionData);
      console.log('场景开场生成完成:', openingMessage.firstMessage.content);
      
      return {
        sessionKey,
        script,
        currentScene,
        openingMessage,
        sessionData: this.getPublicSessionData(sessionData)
      };
      
    } catch (error) {
      console.error('初始化会话失败:', error);
      return await this.createFallbackSession(userId, scriptId, sessionParams);
    }
  }

  /**
   * 创建fallback剧本
   */
  createFallbackScript(scriptId) {
    console.log('创建fallback剧本，scriptId:', scriptId);
    
    return {
      id: scriptId,
      title: '心理剧本对话',
      type: '情感治愈',
      difficulty: '入门级',
      duration: 30,
      energyMode: false,
      description: '一个温暖的情感探索对话，让我们一起探索内心的世界。',
      scriptType: '通用',
      tags: ['情感', '对话', '治愈'],
      
      // 角色设定
      mainCharacters: ['他', '她'],
      characterCount: 2,
      aiRole: '温柔理解的朋友，能够倾听和给予情感支持',
      userRole: '寻求理解和成长的人，希望通过对话获得洞察',
      
      // 头像配置
      avatarConfig: {
        aiAvatar: '/assets/user/role2.jpg',
        userAvatar: '/assets/user/role1.jpg'
      },
      
      // 场景列表
      sceneList: Array.from({length: 30}, (_, i) => ({
        index: i + 1,
        name: `场景${i + 1}`,
        description: '一个关于情感探索的重要时刻'
      }))
    };
  }

  /**
   * 创建fallback场景
   */
  createFallbackScene() {
    return {
      index: 1,
      name: '初次相遇',
      description: '在这个安全的空间里，开始一段真诚的对话',
      emotion: '期待、好奇、开放',
      question: '今天想聊些什么呢？',
      meaning: '建立安全的对话环境'
    };
  }

  /**
   * 创建fallback会话
   */
  async createFallbackSession(userId, scriptId, sessionParams) {
    console.log('创建fallback会话');
    
    const script = this.createFallbackScript(scriptId);
    const scene = this.createFallbackScene();
    
    // 确保script包含完整的数据结构
    if (!script.sceneList || script.sceneList.length === 0) {
      script.sceneList = [
        { name: '开始场景', description: '心理剧对话开始' },
        { name: '发展场景', description: '剧情逐渐展开' },
        { name: '结束场景', description: '对话达到高潮' }
      ];
    }

    const sessionData = {
      sessionKey: `fallback_${userId}_${scriptId}_${Date.now()}`,
      userId,
      scriptId,
      script,
      currentScene: {
        index: 1,
        name: scene.name || '开始场景',
        description: scene.description || '心理剧对话场景',
        ...scene
      },
      messages: [],
      userChoices: [],
      conversationHistory: [],
      interactionCount: 0,
      startTime: new Date(),
      lastInteractionTime: new Date(),
      currentChoices: [],
      lastChoiceGeneration: null,
      availableFeatures: [],
      showSpecialFeatures: false,
      ...sessionParams
    };

    this.sessionData.set(sessionData.sessionKey, sessionData);
    return sessionData;
  }

  /**
   * 生成场景开场
   */
  async generateSceneOpening(sessionData) {
    const { script, currentScene } = sessionData;
    
    // 根据剧本类型生成对应的开场白
    let aiOpeningMessage;
    
    // 优先使用《我们现在是什么关系》剧本的开场
    if (script.title && (script.title.includes('关系') || script.id === 'script_002')) {
      aiOpeningMessage = '宝贝，睡了吗？今天好累啊，刚加完班。😴';
    } else {
      // 尝试生成符合剧情的AI开场白
      try {
        const openingPrompt = `你是${script.aiRole}，在以下场景中：
${currentScene.description}

请生成一句符合场景和角色的自然开场白，要求：
1. 符合角色身份和性格
2. 贴合当前场景情境
3. 自然引导对话开始
4. 长度控制在30字以内
5. 口语化，避免过于正式

直接返回开场白内容，不要其他解释：`;

        const response = await this.deepSeekClient.chat([
          { role: 'user', content: openingPrompt }
        ], { temperature: 0.8, max_tokens: 200 });
        
        aiOpeningMessage = response.content || response.message || '宝贝，睡了吗？今天好累啊，刚加完班。😴';
        // 清理可能的引号或多余格式
        aiOpeningMessage = aiOpeningMessage.replace(/^["']|["']$/g, '').trim();
        
      } catch (error) {
        console.error('生成AI开场白失败:', error);
        // 使用默认的关系主题开场白
        aiOpeningMessage = '宝贝，睡了吗？今天好累啊，刚加完班。😴';
      }
    }
    
    return {
      sceneIntro: {
        type: 'system_unified',
        content: currentScene.description || currentScene.name || '开始一段心理剧本对话',
        time: this.getCurrentTime()
      },
      roleIntro: {
        type: 'system_unified',
        content: `我将扮演：${script.aiRole || '对话伙伴'}`,
        time: this.getCurrentTime()
      },
      firstMessage: {
        type: 'ai',
        content: aiOpeningMessage,
        time: this.getCurrentTime(),
        avatar: script.avatarConfig?.aiAvatar || '/assets/user/role2.jpg'
      }
    };
  }

  /**
   * 处理用户交互
   */
  async processUserInteraction(sessionKey, interaction) {
    const sessionData = this.sessionData.get(sessionKey);
    if (!sessionData) {
      throw new Error('会话不存在');
    }

    let result;
    
    switch (interaction.type) {
      case 'choice':
        result = await this.processChoiceInteraction(sessionData, interaction, sessionKey);
        break;
      case 'free_input':
        result = await this.processFreeInputInteraction(sessionData, interaction, sessionKey);
        break;
      case 'get_choices':
        result = await this.generateInitialChoices(sessionData);
        break;
      default:
        throw new Error('未知的交互类型');
    }

    // 更新会话数据
    this.sessionData.set(sessionKey, sessionData);
    
    return result;
  }

  /**
   * 处理选择卡交互
   */
  async processChoiceInteraction(sessionData, interaction, sessionKey) {
    const { choice, choiceIndex } = interaction;
    
    console.log('处理选择交互:', choice);
    
    // 记录用户选择
    sessionData.userChoices.push({
      choice,
      choiceIndex,
      timestamp: new Date(),
      type: choice.type
    });
    
    // 更新交互计数
    sessionData.interactionCount++;
    sessionData.lastInteractionTime = new Date();
    
    // 根据选择生成用户消息
    const userMessage = this.generateUserMessageFromChoice(choice, sessionData);
    
    // 将用户消息添加到会话历史
    sessionData.messages.push(userMessage);
    
    // 根据选择生成AI回复
    const aiResponse = await this.generateContextualAIResponse(choice, sessionData);
    
    // 将AI回复添加到会话历史
    sessionData.messages.push(aiResponse);
    
    // 生成下一轮选择卡，传递最新的消息历史
    const nextChoices = await this.generateNextChoices(sessionKey, choice, sessionData.messages);
    
    // 检查是否应该显示特殊功能
    const shouldShowSpecialFeatures = this.shouldShowSpecialFeatures(sessionData);
    
    // 3. 在 processChoiceInteraction 记录002剧本的用户选择路径
    if (sessionData.script.id === 'script_002' || sessionData.script.title?.includes('关系')) {
      sessionData.userChoicesPath = sessionData.userChoicesPath || [];
      // 选择卡有code字段则用code，否则用index转A/B/C
      const code = choice.code || String.fromCharCode(65 + (choiceIndex || 0));
      sessionData.userChoicesPath.push(code);
    }
    
    return {
      userMessage,
      aiResponse,
      nextChoices,
      showSpecialFeatures: shouldShowSpecialFeatures,
      availableFeatures: shouldShowSpecialFeatures ? this.getAvailableFeatures(sessionData) : [],
      sessionData: this.getPublicSessionData(sessionData)
    };
  }

  /**
   * 生成下一轮选择卡
   */
  async generateNextChoices(sessionKey, previousChoice = null, messages = null) {
    const session = this.sessionData.get(sessionKey);
    if (!session) throw new Error('会话不存在');
    const script = session.script || {};
    const isRelationshipScript = script.id === 'script_002' || script.title?.includes('关系');
    const userChoicesPath = session.userChoicesPath || [];
    const history = (messages && messages.length > 0) ? messages.slice(-6) : (session.messages || []).slice(-6);
    try {
      const systemPrompt = this._buildSystemPrompt(script);
      const prompt = `**重要：你必须只返回JSON数组，不要包含任何其他文字或解释！**\n\n剧本背景：${script.title} - ${script.description}\n角色设定：你扮演${script.aiRole}，用户扮演${script.userRole}\n\n最近对话：\n${history.map(msg => `${msg.type === 'user' ? '用户' : script.aiRole}: ${msg.content}`).join('\n')}\n\n请为用户生成3个真实自然的心理剧选择卡，要求：\n1. 选择内容必须与上述对话内容高度相关，直接回应AI角色的话题\n2. 语言口语化、简短，符合微信聊天风格  \n3. 体现不同心理状态（温和/直接/委婉/回避）\n4. 选择要有层次感和剧情推进感\n5. 避免过于正式或说教式表达\n6. 符合真实人际关系中的反应模式\n\n格式：\n[\n  {\n    "title": "温和试探",\n    "replyText": "嗯...感觉你今天有点不一样",\n    "potentialImpact": "可能让对方敞开心扉"\n  },\n  {\n    "title": "直接关心", \n    "replyText": "怎么了？看你心情不太好",\n    "potentialImpact": "直接表达关心，获得更真实回应"\n  },\n  {\n    "title": "给点空间",\n    "replyText": "如果不想说也没关系，我在这里陪你", \n    "potentialImpact": "给对方安全感和选择权"\n  }\n]\n\n**只返回JSON数组：**`;
      // 先走API
      const response = await this.deepSeekClient.chat([{ role: 'user', content: prompt }], { temperature: 0.6 });
      let choices;
      // 只要AI返回内容非空就尝试解析
      if (response && response.content && response.content.trim()) {
        let jsonString = this.extractJSONFromResponse(response.content);
        try {
          choices = JSON.parse(jsonString);
        } catch (e) {
          // 解析失败，进入fallback
          throw new Error('AI返回内容无法解析为JSON');
        }
      } else {
        throw new Error('AI返回内容为空');
      }
      // 校验choices
      if (!Array.isArray(choices) || choices.length === 0) {
        throw new Error('AI返回choices为空');
      }
      // 补全字段
      choices.forEach((choice, index) => {
        if (!choice.id) choice.id = `dynamic_choice_${Date.now()}_${index}`;
        if (!choice.title && choice.text) choice.title = choice.text;
        if (!choice.replyText) choice.replyText = choice.title || choice.text || `我选择了选项${index + 1}`;
        if (!choice.potentialImpact) choice.potentialImpact = '可能会影响对话的发展方向';
      });
      const result = {
        choices: choices,
        prompt: '你会如何回应？'
      };
      session.currentChoices = result.choices;
      this.sessionData.set(sessionKey, session);
      return result;
    } catch (error) {
      // fallback分支
      let choices = [];
      let prompt = '你会如何回应？';
      if (isRelationshipScript) {
        const round = userChoicesPath.length + 1;
        choices = relationshipBranches.getChoicesByPath(round, userChoicesPath);
        if (!Array.isArray(choices) || choices.length === 0) {
          choices = [{
            id: 'default_fallback',
            title: '继续对话',
            text: '我明白你的意思。',
            replyText: '我明白你的意思。',
            potentialImpact: '保持对话继续'
          }];
        }
      } else {
        const fallback = this.generateMockChoicesBasedOnContext(session, history, messages);
        choices = fallback.choices;
        prompt = fallback.prompt;
        if (!Array.isArray(choices) || choices.length === 0) {
          choices = [{
            id: 'default_fallback',
            title: '继续对话',
            text: '我明白你的意思。',
            replyText: '我明白你的意思。',
            potentialImpact: '保持对话继续'
          }];
        }
      }
      return { choices, prompt };
    }
  }

  /**
   * 基于上下文生成mock选择卡（完整fallback机制）
   */
  generateMockChoicesBasedOnContext(session, history, messages) {
    console.log('使用mock数据fallback机制');
    
    // 获取最后一条AI消息
    const lastAiMessage = (messages && messages.length > 0) 
      ? messages.filter(m => m.type === 'ai').pop()?.content 
      : '';
    
    // 获取对话轮次，用于动态生成不同的选择卡
    const conversationRound = (messages && messages.length > 0) ? Math.floor(messages.length / 2) + 1 : 1;
    
    // 获取剧本信息
    const script = session.script || {};
    const isRelationshipScript = script.title && script.title.includes('关系');
    
    let fallbackChoices;
    
    // 根据剧本类型和对话内容生成对应的mock选择卡
    if (isRelationshipScript) {
      // 《我们现在是什么关系》剧本的动态mock数据
      fallbackChoices = this.generateRelationshipScriptChoices(lastAiMessage, conversationRound, session);
    } else {
      // 通用心理剧的mock选择卡
      fallbackChoices = this.generateGenericScriptChoices(lastAiMessage, conversationRound);
    }
    
    const result = {
      choices: fallbackChoices,
      prompt: this.generateDynamicPrompt(conversationRound, isRelationshipScript)
    };

    // 更新session数据
    if (session) {
      session.currentChoices = result.choices;
      session.lastChoiceGeneration = Date.now(); // 记录生成时间
      this.sessionData.set(session.sessionKey || 'fallback_session', session);
    }
    
    console.log(`Mock fallback选择卡生成完成: 第${conversationRound}轮对话，${result.choices.length}个选项`);
    return result;
  }

  /**
   * 生成《我们现在是什么关系》剧本的动态选择卡（严格还原assets/script_example.md）
   */
  generateRelationshipScriptChoices(lastAiMessage, conversationRound, session) {
    // 幕关键词
    const act1Keywords = ['宝贝', '睡了吗', '加完班', '累', '亲密语气'];
    const act2Keywords = ['复盘会', '这周', '周末', '打算', '安排', '票根'];
    const act3Keywords = ['喘口气', '咖啡', '在干嘛', '女同事', '关系', '定义'];
    const msg = lastAiMessage || '';
    // 第一幕：裂痕初显
    if (conversationRound <= 2 && act1Keywords.some(k => msg.includes(k))) {
      return [
        {
          id: 'gentle_probe_oldmemory',
          title: '温和试探 - 提旧事',
          text: '还没睡呢，辛苦啦~ 对了，忽然想起去年圣诞那张牵手照拍得真好，好怀念呀。你当时发朋友圈，是不是只给我看的呀？😊',
          replyText: '还没睡呢，辛苦啦~ 对了，忽然想起去年圣诞那张牵手照拍得真好，好怀念呀。你当时发朋友圈，是不是只给我看的呀？😊',
          potentialImpact: '可能引导他回忆/解释，也可能让他警觉你在翻旧账',
          psychologyDimension: '温和性-试探性'
        },
        {
          id: 'direct_question_photo',
          title: '直接质问 - 带情绪',
          text: '刚看到手机相册。那张圣诞牵手照，你当时发朋友圈是设了仅我可见吧？为什么？🫤',
          replyText: '刚看到手机相册。那张圣诞牵手照，你当时发朋友圈是设了仅我可见吧？为什么？🫤',
          potentialImpact: '直接引爆冲突点，可能引发防御或争吵',
          psychologyDimension: '直接性-质疑性'
        },
        {
          id: 'avoid_topic_care',
          title: '回避问题 - 转移话题',
          text: '还没呢。加班这么晚啊，吃饭了吗？我给你点个外卖？❤️',
          replyText: '还没呢。加班这么晚啊，吃饭了吗？我给你点个外卖？❤️',
          potentialImpact: '暂时回避冲突，但内心焦虑未解决，可能积累怨气',
          psychologyDimension: '回避性-关怀性'
        },
        {
          id: 'silent_observe',
          title: '沉默观察 - 不回复',
          text: '(放下手机，不回复这条消息，想看看他后续反应)',
          replyText: '(沉默，没有回复消息)',
          potentialImpact: '被动等待，可能错过沟通时机，也可能让对方察觉你的冷淡',
          psychologyDimension: '被动性-观察性'
        }
      ];
    }
    // 第二幕：沉默的重量
    if (conversationRound >= 3 && conversationRound <= 5 && act2Keywords.some(k => msg.includes(k))) {
      return [
        {
          id: 'proactive_invite',
          title: '主动邀约 - 测试态度',
          text: '我也没事做…好久没见你了，要不我明天飞过去找你？我们去看新上的那部电影？',
          replyText: '我也没事做…好久没见你了，要不我明天飞过去找你？我们去看新上的那部电影？',
          potentialImpact: '直接推进见面，可能得到热情回应或暴露他的回避',
          psychologyDimension: '主动性-测试性'
        },
        {
          id: 'express_dissatisfaction',
          title: '表达不满 - 带委屈',
          text: '原来你还记得有我这个人啊？三天没消息，我以为你失踪了呢。😒',
          replyText: '原来你还记得有我这个人啊？三天没消息，我以为你失踪了呢。😒',
          potentialImpact: '释放压抑情绪，可能引发争吵或让他愧疚补偿',
          psychologyDimension: '表达性-情绪化'
        },
        {
          id: 'mirror_coldness',
          title: '模仿疏离 - 被动反击',
          text: '哦，还好。可能跟朋友逛街吧。',
          replyText: '哦，还好。可能跟朋友逛街吧。',
          potentialImpact: '用冷淡触发他的关注，也可能让关系更僵',
          psychologyDimension: '被动攻击性'
        },
        {
          id: 'switch_perspective',
          title: '切换到对方视角',
          text: '(此刻，你想知道他这三天究竟怎么想的吗？)',
          replyText: '(切换到对方视角)',
          potentialImpact: '了解对方内心独白，获得更多信息',
          psychologyDimension: '共情性-探索性'
        }
      ];
    }
    // 第三幕：直面迷雾
    if (conversationRound > 5 && act3Keywords.some(k => msg.includes(k))) {
      return [
        {
          id: 'challenge_intimacy',
          title: '质疑亲密称呼',
          text: '以后还是别用【宝贝】这样的词来称呼吧，我们又没有确定关系，这样我会很容易误会。',
          replyText: '以后还是别用【宝贝】这样的词来称呼吧，我们又没有确定关系，这样我会很容易误会。',
          potentialImpact: '直接挑战关系模糊性，可能引发关系定义讨论',
          psychologyDimension: '边界设立-理性化'
        },
        {
          id: 'demand_clarity',
          title: '要求明确关系',
          text: '我们到底是什么关系？能不能给我一个准确的答案？',
          replyText: '我们到底是什么关系？能不能给我一个准确的答案？',
          potentialImpact: '强势要求关系定义，可能得到答案或遭到回避',
          psychologyDimension: '追求确定性-强势性'
        },
        {
          id: 'self_protection_distance',
          title: '自我保护 - 拉开距离',
          text: '我想我们还是减少联系比较好，我需要想清楚一些事情。',
          replyText: '我想我们还是减少联系比较好，我需要想清楚一些事情。',
          potentialImpact: '主动设立边界，可能让他察觉失去的危险',
          psychologyDimension: '自我保护-主动性'
        },
        {
          id: 'final_ultimatum',
          title: '最后通牒',
          text: '今天必须说清楚关系，否则我们再不见面。',
          replyText: '今天必须说清楚关系，否则我们再不见面。',
          potentialImpact: '逼迫对方做出选择，风险是可能失去关系',
          psychologyDimension: '决断性-强势'
        }
      ];
    }
    // 默认通用关系主题选择卡
    return [
      {
        id: 'clarify_relationship',
        title: '澄清关系',
        text: '我也在思考我们之间的关系...',
        replyText: '我也在思考我们之间的关系...',
        potentialImpact: '开始深入讨论关系问题',
        psychologyDimension: '探索性'
      },
      {
        id: 'express_confusion',
        title: '表达困惑',
        text: '说实话，我也有点搞不清楚。',
        replyText: '说实话，我也有点搞不清楚。',
        potentialImpact: '承认内心的困惑',
        psychologyDimension: '坦诚性'
      },
      {
        id: 'seek_clarity',
        title: '寻求明确',
        text: '也许我们需要更坦诚地谈谈？',
        replyText: '也许我们需要更坦诚地谈谈？',
        potentialImpact: '推动更开放的对话',
        psychologyDimension: '沟通性'
      }
    ];
  }

  /**
   * 生成通用心理剧选择卡
   */
  generateGenericScriptChoices(lastAiMessage, conversationRound) {
    if (lastAiMessage.includes('累') || lastAiMessage.includes('忙')) {
      return [
        {
          id: 'show_concern',
          title: '表达关心',
          text: '你最近确实很辛苦，要不要休息一下？',
          replyText: '你最近确实很辛苦，要不要休息一下？',
          potentialImpact: '让对方感受到关心和理解'
        },
        {
          id: 'offer_help',
          title: '提供帮助',
          text: '有什么我可以帮你的吗？',
          replyText: '有什么我可以帮你的吗？',
          potentialImpact: '主动提供支持'
        },
        {
          id: 'share_feeling',
          title: '分享感受',
          text: '看到你这样，我也有点担心...',
          replyText: '看到你这样，我也有点担心...',
          potentialImpact: '表达真实的担忧'
        }
      ];
    } else {
      return [
        {
          id: 'continue_gentle',
          title: '温和回应',
          text: '我明白你的想法，我们继续聊聊吧。',
          replyText: '我明白你的想法，我们继续聊聊吧。',
          potentialImpact: '保持友善的对话氛围'
        },
        {
          id: 'express_feeling',
          title: '表达感受',
          text: '听你这么说，我心里有些复杂的感受...',
          replyText: '听你这么说，我心里有些复杂的感受...',
          potentialImpact: '分享真实的情感反应'
        },
        {
          id: 'ask_question',
          title: '深入了解',
          text: '你能告诉我更多关于这件事的想法吗？',
          replyText: '你能告诉我更多关于这件事的想法吗？',
          potentialImpact: '获得更多信息和理解'
        }
      ];
    }
  }

  /**
   * 生成动态提示语
   */
  generateDynamicPrompt(conversationRound, isRelationshipScript) {
    if (isRelationshipScript) {
      const prompts = [
        '此刻你想...',
        '你会如何回应？',
        '面对这种情况，你决定...',
        '在这个关键时刻，你选择...',
        '你的内心告诉你...'
      ];
      return prompts[Math.min(conversationRound - 1, prompts.length - 1)];
    } else {
      return '接下来你想如何回应？';
    }
  }

  /**
   * 基于AI对话内容生成选择卡
   */
  generateChoicesFromAIContent(aiContent, sessionData) {
    console.log('基于AI内容生成选择卡:', aiContent);
    
    // 确保sessionData存在
    if (!sessionData) {
      console.warn('sessionData为空，使用默认选择卡');
      return this.generateDefaultChoices();
    }
    
    // 检测内容情感和主题
    const content = aiContent.toLowerCase();
    
    if (content.includes('宝贝') || content.includes('亲爱')) {
      return [
        {
          id: 'accept_intimacy',
          title: '接受亲密称呼',
          text: '我也喜欢你这样叫我。',
          potentialImpact: '增进亲密感，但可能加深关系模糊'
        },
        {
          id: 'question_relationship',
          title: '质疑关系定义',
          text: '我们的关系...到底是什么？',
          potentialImpact: '可能引发关系讨论'
        },
        {
          id: 'ignore_continue',
          title: '忽略继续聊天',
          text: '嗯，今天过得怎么样？',
          potentialImpact: '回避敏感话题'
        }
      ];
    }
    
    if (content.includes('忙') || content.includes('累') || content.includes('工作')) {
      return [
        {
          id: 'show_concern',
          title: '表达关心',
          text: '你最近确实很辛苦，要注意身体。',
          potentialImpact: '体现关怀，增进感情'
        },
        {
          id: 'suggest_meet',
          title: '建议见面',
          text: '要不我过去陪陪你？',
          potentialImpact: '测试对方对见面的态度'
        },
        {
          id: 'express_understanding',
          title: '表示理解',
          text: '工作重要，我理解的。',
          potentialImpact: '表现体贴，但可能助长对方的忽视'
        }
      ];
    }
    
    if (content.includes('见面') || content.includes('过来') || content.includes('约')) {
      return [
        {
          id: 'eager_accept',
          title: '积极回应',
          text: '好啊！什么时候？我很期待。',
          potentialImpact: '表现出渴望，可能被认为太主动'
        },
        {
          id: 'cautious_inquiry',
          title: '谨慎询问',
          text: '具体什么时候呢？我安排一下时间。',
          potentialImpact: '理性回应，保持期待但不过度'
        },
        {
          id: 'test_sincerity',
          title: '测试诚意',
          text: '你不会又有事临时取消吧？',
          potentialImpact: '可能引发争论，但测试对方态度'
        }
      ];
    }
    
    // 默认通用选择卡
    return [
      {
        id: 'positive_response',
        title: '积极回应',
        text: '我明白你的意思。',
        potentialImpact: '保持友好的对话氛围'
      },
      {
        id: 'seek_clarity',
        title: '寻求澄清',
        text: '你能再说得具体一点吗？',
        potentialImpact: '获得更多信息'
      },
      {
        id: 'express_feelings',
        title: '表达感受',
        text: '听你这么说，我心里有些复杂...',
        potentialImpact: '分享真实情感'
      }
    ];
  }

  /**
   * 确定当前剧情幕
   */
  determineCurrentAct(interactionCount) {
    if (interactionCount <= 2) return 'opening';
    if (interactionCount <= 5) return 'development';
    if (interactionCount <= 8) return 'conflict';
    return 'resolution';
  }

  /**
   * 基于剧情幕生成选择卡
   */
  generateActBasedChoices(currentAct) {
    switch (currentAct) {
      case 'opening':
        return this.generateOpeningChoices();
      case 'development':
        return this.generateDevelopmentChoices();
      case 'conflict':
        return this.generateConflictChoices();
      case 'resolution':
        return this.generateResolutionChoices();
      default:
        return this.generateDefaultChoices();
    }
  }

  /**
   * 生成开场选择卡
   */
  generateOpeningChoices() {
    return [
      {
        id: 'gentle_approach',
        text: '温和试探对方的想法',
        type: 'gentle_probe',
        psychologyDimension: '温和性-主动性',
        potentialImpact: '可能获得更多信息，但也可能让对方察觉你的顾虑',
        responseStyle: 'warm_inquiry'
      },
      {
        id: 'direct_question',
        text: '直接询问关心的问题',
        type: 'direct_question',
        psychologyDimension: '直接性-主动性',
        potentialImpact: '快速得到答案，但可能引发对方防御',
        responseStyle: 'direct_confrontation'
      },
      {
        id: 'avoid_topic',
        text: '暂时回避，转移话题',
        type: 'topic_avoidance',
        psychologyDimension: '回避性-被动性',
        potentialImpact: '避免当下冲突，但问题可能积累',
        responseStyle: 'avoidance'
      }
    ];
  }

  /**
   * 生成发展选择卡
   */
  generateDevelopmentChoices() {
    return [
      {
        id: 'escalate_concern',
        text: '表达更深层的担忧',
        type: 'emotional_express',
        psychologyDimension: '表达性-脆弱性',
        potentialImpact: '可能获得对方的重视，也可能被认为过于敏感',
        responseStyle: 'emotional_reveal'
      },
      {
        id: 'strategic_withdraw',
        text: '策略性地保持距离',
        type: 'strategic_distance',
        psychologyDimension: '保护性-理性',
        potentialImpact: '保护自己不受进一步伤害，但可能错过解决机会',
        responseStyle: 'protective_distance'
      },
      {
        id: 'seek_clarification',
        text: '要求对方澄清态度',
        type: 'clarification_seek',
        psychologyDimension: '追求确定性',
        potentialImpact: '获得明确答案，但可能逼迫对方做出不成熟的回应',
        responseStyle: 'clarification_demand'
      }
    ];
  }

  /**
   * 生成冲突选择卡
   */
  generateConflictChoices() {
    return [
      {
        id: 'confront_directly',
        text: '直面冲突，说出真相',
        type: 'direct_confrontation',
        psychologyDimension: '勇气-直接性',
        potentialImpact: '可能解决问题根源，也可能导致关系破裂',
        responseStyle: 'truth_telling'
      },
      {
        id: 'set_ultimatum',
        text: '设定最后期限',
        type: 'ultimatum',
        psychologyDimension: '决断性-强势',
        potentialImpact: '迫使对方做出选择，风险是可能失去关系',
        responseStyle: 'ultimatum_delivery'
      },
      {
        id: 'self_protection',
        text: '优先保护自己',
        type: 'self_preserve',
        psychologyDimension: '自我保护-理性',
        potentialImpact: '维护自尊和底线，但可能结束关系',
        responseStyle: 'self_preservation'
      }
    ];
  }

  /**
   * 生成结局选择卡
   */
  generateResolutionChoices() {
    return [
      {
        id: 'peaceful_closure',
        text: '理性地结束这段关系',
        type: 'peaceful_ending',
        psychologyDimension: '成熟-理性',
        potentialImpact: '获得内心平静，为未来清出空间',
        responseStyle: 'mature_closure'
      },
      {
        id: 'reconciliation',
        text: '尝试和解与修复',
        type: 'repair_attempt',
        psychologyDimension: '宽恕-希望',
        potentialImpact: '可能重建更好的关系，也可能重蹈覆辙',
        responseStyle: 'reconciliation'
      }
    ];
  }

  /**
   * 生成默认选择卡
   */
  generateDefaultChoices() {
    return [
      {
        id: 'default_gentle',
        text: '温和地表达想法',
        type: 'gentle_response',
        psychologyDimension: '温和性',
        potentialImpact: '保持和谐，但可能不够明确',
        responseStyle: 'gentle'
      },
      {
        id: 'default_direct',
        text: '直接说出感受',
        type: 'direct_response',
        psychologyDimension: '直接性',
        potentialImpact: '清晰明确，但可能引起冲突',
        responseStyle: 'direct'
      }
    ];
  }

  /**
   * 生成选择卡提示语
   */
  generateChoicesPrompt(currentAct) {
    const prompts = {
      opening: '在这个关键时刻，你会如何回应？',
      development: '情况变得复杂，你的下一步是？',
      conflict: '面对冲突，你决定...',
      resolution: '是时候做出最终选择了...'
    };
    return prompts[currentAct] || '你会怎么做？';
  }

  /**
   * 根据选择生成用户消息
   */
  generateUserMessageFromChoice(choice, sessionData) {
    const { script } = sessionData;
    
    // 使用选择卡的replyText作为用户消息内容
    const userText = choice.replyText || choice.text || '我想...';
    
    return {
      type: 'user',
      content: userText,
      choice: choice,
      timestamp: new Date(),
      time: this.getCurrentTime(),
      avatar: script.avatarConfig?.userAvatar || script.avatarConfig?.user || '/assets/user/role1.jpg'
    };
  }

  /**
   * 获取用户消息模板
   */
  getUserMessageTemplates(scriptId, choiceType) {
    const templates = {
      script_002: {
        gentle_probe: [
          '最近感觉你好像有些心不在焉，是工作太累了吗？',
          '我们好久没有像以前那样聊天了，你最近还好吗？'
        ],
        direct_question: [
          '我想知道你对我们的关系是怎么想的',
          '我们现在到底算什么关系？我有点搞不清楚'
        ],
        topic_avoidance: [
          '今天工作怎么样？最近项目进展顺利吗？',
          '天气真不错呢，周末想不想出去走走？'
        ]
      },
      default: {
        gentle_probe: [
          '我想和你聊聊，你觉得呢？',
          '最近你还好吗？感觉你有些不一样'
        ],
        direct_question: [
          '我想直接问你一些问题',
          '我们能坦诚地谈一谈吗？'
        ],
        topic_avoidance: [
          '对了，今天天气真不错',
          '最近看了什么好电影吗？'
        ]
      }
    };
    
    const scriptTemplates = templates[scriptId] || templates.default;
    return scriptTemplates[choiceType] || scriptTemplates.gentle_probe || ['...'];
  }

  /**
   * 生成上下文相关的AI回复
   */
  async generateContextualAIResponse(choice, sessionData) {
    const { script } = sessionData;
    const isRelationshipScript = script.id === 'script_002' || script.title?.includes('关系');
    const userChoicesPath = sessionData.userChoicesPath || [];
    
    console.log('生成AI回复，基于选择:', choice);
    
    try {
      // 构建更真实的AI回复prompt
      const aiPrompt = `你正在扮演${script.aiRole}，这是一个心理剧本《${script.title}》。

剧本背景：${script.description}
当前场景：真实的微信聊天对话
你的角色特点：${script.aiRole}

用户刚才说："${choice.replyText || choice.text}"
用户的选择意图：${choice.potentialImpact}

请生成一个真实自然的回复，要求：
1. 完全符合微信聊天的语言风格（口语化、简短）
2. 体现角色的真实情绪和反应
3. 回复要有层次感，推进剧情发展
4. 避免说教式或过于正式的表达
5. emoji数量适当，一句话里不超过2个
6. 长度控制在30-80字
7. 要有真实的情感波动和细节

直接回复内容，不要其他解释：`;

      // 先走API
      const response = await this.deepSeekClient.chat([
        { role: 'user', content: aiPrompt }
      ], { temperature: 0.8, max_tokens: 300 });

      let aiContent = response.content || response.message || '我明白你的意思...我们继续聊聊吧';
      
      // 清理可能的格式问题
      aiContent = aiContent.replace(/\（[^）]*\）/g, '').replace(/\([^)]*\)/g, '').trim();
      
      // 去掉句首句尾的双引号（对话标记）
      aiContent = aiContent.replace(/^[""]|[""]$/g, '').replace(/^"|"$/g, '').trim();
      
      return {
        type: 'ai',
        content: aiContent,
        timestamp: new Date(),
        time: this.getCurrentTime(),
        avatar: script.avatarConfig.aiAvatar || script.avatarConfig.ai || '/assets/user/role2.jpg',
        responseStyle: choice.responseStyle || 'natural'
      };
    } catch (error) {
      console.error('生成AI回复失败:', error);
      
      // API失败，002剧本走分支查表，其它剧本走原有fallback
      if (isRelationshipScript) {
        const round = userChoicesPath.length;
        const aiReply = relationshipBranches.getAIReplyByPath(round, choice.code ? (choice.code.charCodeAt(0) - 65) : 0, userChoicesPath);
        return {
          type: 'ai',
          content: aiReply,
          timestamp: new Date(),
          time: this.getCurrentTime(),
          avatar: script.avatarConfig.aiAvatar || script.avatarConfig.ai || '/assets/user/role2.jpg',
          responseStyle: 'mock_fallback'
        };
      } else {
        return this.generateMockAIResponse(choice, sessionData);
      }
    }
  }

  /**
   * 生成mock AI回复（完整fallback机制）
   */
  generateMockAIResponse(choice, sessionData) {
    console.log('使用mock AI回复fallback机制');
    
    const { script } = sessionData;
    const isRelationshipScript = script.title && script.title.includes('关系');
    const userText = choice.replyText || choice.text || '';
    
    // 获取对话轮次，用于生成不同的回复
    const messages = sessionData.messages || [];
    const conversationRound = Math.floor(messages.length / 2) + 1;
    
    let aiContent;
    
    if (isRelationshipScript) {
      // 《我们现在是什么关系》剧本的动态mock AI回复
      aiContent = this.generateRelationshipScriptAIResponse(choice, userText, conversationRound, sessionData);
    } else {
      // 通用心理剧的mock AI回复
      aiContent = this.generateGenericScriptAIResponse(choice, userText, conversationRound);
    }
    
    return {
      type: 'ai',
      content: aiContent,
      timestamp: new Date(),
      time: this.getCurrentTime(),
      avatar: script.avatarConfig?.aiAvatar || script.avatarConfig?.ai || '/assets/user/role2.jpg',
      responseStyle: 'mock_fallback'
    };
  }

  /**
   * 生成《我们现在是什么关系》剧本的AI回复
   */
  generateRelationshipScriptAIResponse(choice, userText, conversationRound, sessionData) {
    // 第一幕回复 - 裂痕初显
    if (conversationRound <= 2) {
      if (choice.id === 'gentle_probe_oldmemory' || userText.includes('圣诞') || userText.includes('朋友圈')) {
        const responses = [
          '啊？为什么突然问这个...😅 那个...我不太记得当时的设置了，应该是所有人都能看的吧？',
          '圣诞节？哦对！那张照片确实拍得不错。朋友圈设置...我一般都是默认的啊。',
          '哈哈，你还记得那张照片呢～说到这个，我确实不太确定当时的权限设置...🤔'
        ];
        return responses[conversationRound % responses.length];
      } else if (choice.id === 'direct_question_photo' || userText.includes('为什么') || userText.includes('仅我可见')) {
        const responses = [
          '额...你怎么会这样想？我没有设置什么特殊权限啊...可能是系统问题？',
          '哎呀，别想太多了。微信那些设置我从来不怎么用的，都是默认的。',
          '你这样问我有点紧张诶...真的没有故意设置什么的。'
        ];
        return responses[conversationRound % responses.length];
      } else if (choice.id === 'avoid_topic_care' || userText.includes('外卖') || userText.includes('吃饭')) {
        return '不用啦宝贝，在公司楼下随便吃了碗面。今天PPT改到吐，客户真是...😮‍💨 你真好，还想着我。早点休息？明天一早还有个会。';
      } else if (choice.id === 'silent_observe') {
        const responses = [
          '宝贝？怎么不回我了？是不是睡着了？',
          '？？？突然不理我了...是我说错什么了吗？',
          '在吗？怎么了？'
        ];
        return responses[conversationRound % responses.length];
      }
    }
    
    // 第二幕回复 - 沉默的重量
    if (conversationRound >= 3 && conversationRound <= 5) {
      if (choice.id === 'proactive_invite' || userText.includes('飞过去') || userText.includes('见面')) {
        const responses = [
          '啊？明天吗？这么突然...😅 这周真的太累了宝贝，下周还有个重要汇报要准备...',
          '你要过来？我当然开心啊！但是明天下午可能要临时加班...要不等下周末？',
          '想见我了？我也想你～不过这周确实有点忙乱...下周我提前安排好时间？🤗'
        ];
        return responses[(conversationRound - 3) % responses.length];
      } else if (choice.id === 'express_dissatisfaction' || userText.includes('三天没消息') || userText.includes('失踪')) {
        const responses = [
          '哎呀，宝贝别这样说...真的是工作太忙了，每天都要加班到很晚。🥺',
          '对不起对不起！我确实这几天忙得晕头转向的，但我怎么可能忘记你呢？',
          '你这样说我心里很愧疚...我保证以后再忙也要主动找你聊天。'
        ];
        return responses[(conversationRound - 3) % responses.length];
      } else if (choice.id === 'mirror_coldness' || userText.includes('朋友逛街')) {
        const responses = [
          '哦...那你玩得开心点。我这边还有个会要开。',
          '和朋友逛街啊，挺好的。我继续忙工作了...',
          '嗯，好吧。那我不打扰你了。'
        ];
        return responses[(conversationRound - 3) % responses.length];
      } else if (choice.id === 'confront_excuse' || userText.includes('撤回') || userText.includes('不想见我')) {
        const responses = [
          '什么撤回？哦那个...我是想说下午可能要开会，怕安排不过来...不是不想见你！',
          '哎呀宝贝你误会了！撤回是因为我突然想起可能说错了...我当然想见你的。',
          '你怎么会这样想？我只是担心这周太忙没法好好陪你...下周一定！'
        ];
        return responses[(conversationRound - 3) % responses.length];
      } else if (choice.id === 'reluctant_compromise' || userText.includes('下周再说')) {
        const responses = [
          '宝贝最体贴了！❤️ 等忙完这阵一定好好补偿你，快睡吧，晚安！',
          '你真的太理解我了...下周我发誓一定安排出时间！晚安宝贝～',
          '谢谢你这么体贴，我心里真的很感动。下周见面！😘'
        ];
        return responses[(conversationRound - 3) % responses.length];
      }
    }
    
    // 第三幕回复 - 直面迷雾
    if (conversationRound >= 6) {
      if (choice.id === 'challenge_intimacy' || userText.includes('宝贝') || userText.includes('称呼')) {
        const responses = [
          '啊？怎么突然说这个...我们...不是一直很好吗？😰 别多想啊！',
          '什么叫没有确定关系？我对你的感情你应该能感受到的...为什么要给关系贴标签呢？',
          '宝贝...你这样说让我有点不知所措。我们现在这样不是挺自然的吗？'
        ];
        return responses[(conversationRound - 6) % responses.length];
      } else if (choice.id === 'demand_clarity' || userText.includes('什么关系') || userText.includes('准确答案')) {
        const responses = [
          '关系...这个问题有点突然。我们一直相处得很自然啊，为什么突然要定义？',
          '我觉得...关系不用说出口吧？我们互相关心，互相陪伴，这不就够了吗？',
          '这个...你给我点时间想想好吗？我从来没想过要怎么定义我们的关系。'
        ];
        return responses[(conversationRound - 6) % responses.length];
      } else if (choice.id === 'self_protection_distance' || userText.includes('减少联系')) {
        const responses = [
          '什么？为什么要减少联系？是我做错什么了吗？宝贝，我们好好谈谈...',
          '别这样啊...你这样说我真的很慌。我们之间有什么问题不能解决的？',
          '等等等，你先别着急做决定。告诉我怎么了，我们可以好好沟通的。'
        ];
        return responses[(conversationRound - 6) % responses.length];
      } else if (choice.id === 'calm_breakaway' || userText.includes('路过') || userText.includes('想清楚')) {
        const responses = [
          '我...我真的...（攥紧袖口的纸屑）对不起，我知道我一直在逃避。',
          '别走...我们能不能再给彼此一次机会？我知道我做得不好...',
          '你说得对，你值得更好的。对不起，我一直没有勇气面对。'
        ];
        return responses[(conversationRound - 6) % responses.length];
      }
    }
    
    // 通用关系剧本回复
    const genericResponses = [
      '我理解你的感受，但我们现在这样不是挺好的吗？',
      '你这样问让我有点不知道怎么回答...我需要时间想想。',
      '我们的关系...我觉得不需要定义得那么清楚吧？',
      '为什么突然问这些？是不是我哪里做得不够好？'
    ];
    return genericResponses[conversationRound % genericResponses.length];
  }

  /**
   * 生成通用心理剧的AI回复
   */
  generateGenericScriptAIResponse(choice, userText, conversationRound) {
    if (userText.includes('关心') || userText.includes('辛苦')) {
      const responses = [
        '谢谢你的关心，有你在身边我感觉好多了。',
        '你这么说我心里很温暖，最近确实有点累。',
        '知道你关心我就够了，这些困难我们一起面对。'
      ];
      return responses[conversationRound % responses.length];
    } else if (userText.includes('帮助') || userText.includes('帮你')) {
      const responses = [
        '你能这样说我就很感动了，暂时还好，如果需要帮助我会告诉你的。',
        '有你这句话就够了，真的需要帮助的时候我不会客气的。',
        '谢谢你的好意，现在还能应付，有困难一定找你。'
      ];
      return responses[conversationRound % responses.length];
    } else if (userText.includes('担心') || userText.includes('感受')) {
      const responses = [
        '看到你为我担心，我心里很温暖。我们一起面对，好吗？',
        '你的担心我能感受到，这让我觉得不那么孤单了。',
        '有你的理解和担心，我觉得什么困难都能克服。'
      ];
      return responses[conversationRound % responses.length];
    } else {
      const responses = [
        '我明白你的想法，我们继续聊聊吧。',
        '你说得有道理，我需要好好想想。',
        '这确实是个值得思考的问题。'
      ];
      return responses[conversationRound % responses.length];
    }
  }

  /**
   * 获取AI回复模板
   */
  getAIResponseTemplate(scriptId, responseStyle) {
    const templates = {
      script_002: {
        warm_inquiry: [
          '你总是这么体贴，担心我累不累。其实最近确实挺忙的，但和你聊天总是让我觉得很放松。',
          '工作是有点累，不过看到你的消息就感觉好多了。你呢，最近都在忙什么？'
        ],
        direct_confrontation: [
          '关系吗？我觉得...我们现在这样不是挺好的吗？为什么要给它贴标签呢？我对你的感情你应该能感受到的。',
          '这个问题有点突然...我们一直相处得很自然啊，为什么突然要定义关系？'
        ],
        avoidance: [
          '哈哈，项目确实挺忙的。对了，那个电影你还想看吗？',
          '最近天气确实不错，我也想出去走走。你有什么推荐的地方吗？'
        ]
      },
      default: {
        warm_inquiry: [
          '我很好，谢谢你的关心。你呢，最近怎么样？',
          '确实有些累，但看到你的消息就觉得好多了。'
        ],
        direct_confrontation: [
          '你想聊什么？我愿意听。',
          '好啊，我们可以坦诚地谈一谈。'
        ],
        avoidance: [
          '天气确实不错，很适合出去走走。',
          '最近在看一部很有趣的剧，你要不要一起看？'
        ]
      }
    };
    
    const scriptTemplates = templates[scriptId] || templates.default;
    const styleTemplates = scriptTemplates[responseStyle] || scriptTemplates.warm_inquiry;
    
    return styleTemplates[Math.floor(Math.random() * styleTemplates.length)];
  }

  /**
   * 检查是否应该显示特殊功能
   */
  shouldShowSpecialFeatures(sessionData) {
    const userMessageCount = sessionData.userChoices.length;
    return userMessageCount >= 3;
  }

  /**
   * 获取可用的特殊功能
   */
  getAvailableFeatures(sessionData) {
    const features = [];
    
    if (!sessionData.specialFeaturesUsed.innerMonologue) {
      features.push({
        id: 'inner_monologue',
        name: '对方内心独白',
        icon: '🔍',
        description: '了解对方真实想法'
      });
    }
    
    if (!sessionData.specialFeaturesUsed.highEnergyMode) {
      features.push({
        id: 'high_energy_mode',
        name: '开启高能模式',
        icon: '⚡️',
        description: '升级对话体验'
      });
    }
    
    if (!sessionData.specialFeaturesUsed.relationshipAnalysis) {
      features.push({
        id: 'relationship_analysis',
        name: '当前关系分析',
        icon: '📋',
        description: '分析当前关系状态'
      });
    }
    
    return features;
  }

  /**
   * 获取公开的会话数据
   */
  getPublicSessionData(sessionData) {
    return {
      interactionCount: sessionData.interactionCount,
      currentPhase: sessionData.currentPhase,
      scriptTitle: sessionData.script.title,
      userChoices: sessionData.userChoices.length,
      lastInteractionTime: sessionData.lastInteractionTime
    };
  }

  /**
   * 从AI响应中提取JSON
   */
  extractJSONFromResponse(content) {
    // 方法1: 尝试提取markdown代码块中的JSON
    const jsonCodeMatch = content.match(/```json\n([\s\S]*?)\n```/i);
    if (jsonCodeMatch) {
      return jsonCodeMatch[1].trim();
    }
    
    // 方法2: 尝试提取普通代码块中的JSON
    const codeMatch = content.match(/```\n?([\s\S]*?)\n?```/);
    if (codeMatch) {
      const codeContent = codeMatch[1].trim();
      if (codeContent.startsWith('[') && codeContent.endsWith(']')) {
        return codeContent;
      }
    }
    
    // 方法3: 查找第一个完整的JSON数组
    const arrayMatch = content.match(/\[([\s\S]*?)\]/);
    if (arrayMatch) {
      return arrayMatch[0];
    }
    
    // 方法4: 激进清理 - 移除所有非JSON内容
    let cleaned = content
      .replace(/^[^[\{]*/, '') // 移除开头非JSON内容
      .replace(/[^\]\}]*$/, '') // 移除结尾非JSON内容
      .trim();
    
    // 如果找到了看起来像JSON的内容
    if ((cleaned.startsWith('[') && cleaned.endsWith(']')) || 
        (cleaned.startsWith('{') && cleaned.endsWith('}'))) {
      return cleaned;
    }
    
    // 方法5: 最后尝试 - 直接返回原内容
    return content.trim();
  }

  /**
   * 获取当前时间
   */
  getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }

  /**
   * 生成初始选择卡 - 基于《我们现在是什么关系》剧本
   */
  async generateInitialChoices(sessionData) {
    const isRelationshipScript = sessionData.script.id === 'script_002' || sessionData.script.title?.includes('关系');
    try {
      // 根据剧本类型生成对应的初始选择卡
      let choices;
      
      if (sessionData.script.title && (sessionData.script.title.includes('关系') || sessionData.script.id === 'script_002')) {
        // 《我们现在是什么关系》剧本的初始选择卡
        choices = [
          {
            id: 'gentle_probe',
            title: '温和试探 - 提旧事',
            text: '还没睡呢，辛苦啦~ 对了，忽然想起去年圣诞那张牵手照拍得真好，好怀念呀。你当时发朋友圈，是不是只给我看的呀？😊',
            replyText: '还没睡呢，辛苦啦~ 对了，忽然想起去年圣诞那张牵手照拍得真好，好怀念呀。你当时发朋友圈，是不是只给我看的呀？😊',
            potentialImpact: '可能引导他回忆/解释，也可能让他警觉你在翻旧账'
          },
          {
            id: 'direct_question',
            title: '直接质问 - 带情绪',
            text: '刚看到手机相册。那张圣诞牵手照，你当时发朋友圈是设了仅我可见吧？为什么？🫤',
            replyText: '刚看到手机相册。那张圣诞牵手照，你当时发朋友圈是设了仅我可见吧？为什么？🫤',
            potentialImpact: '直接引爆冲突点，可能引发防御或争吵'
          },
          {
            id: 'avoid_topic',
            title: '回避问题 - 转移话题',
            text: '还没呢。加班这么晚啊，吃饭了吗？我给你点个外卖？❤️',
            replyText: '还没呢。加班这么晚啊，吃饭了吗？我给你点个外卖？❤️',
            potentialImpact: '暂时回避冲突，但内心焦虑未解决，可能积累怨气'
          },
          {
            id: 'silent_observe',
            title: '沉默观察 - 不回复',
            text: '(放下手机，不回复这条消息，想看看他后续反应)',
            replyText: '(沉默，没有回复消息)',
            potentialImpact: '被动等待，可能错过沟通时机，也可能让对方察觉你的冷淡'
          }
        ];
      } else {
        // 通用心理剧的初始选择卡
        choices = [
          {
            id: 'gentle_approach',
            title: '温和询问',
            text: '我感觉你今天好像有什么心事，还好吗？',
            replyText: '我感觉你今天好像有什么心事，还好吗？',
            potentialImpact: '营造安全的对话环境，让对方感到被关心'
          },
          {
            id: 'direct_concern',
            title: '直接关心', 
            text: '你最近怎么了？我觉得你有些不一样。',
            replyText: '你最近怎么了？我觉得你有些不一样。',
            potentialImpact: '直接表达关心，可能获得更真实的回应'
          },
          {
            id: 'understanding',
            title: '表达理解',
            text: '如果你不想说也没关系，我就在这里陪你。',
            replyText: '如果你不想说也没关系，我就在这里陪你。',
            potentialImpact: '给对方安全感，建立信任基础'
          }
        ];
      }
      
      return {
        nextChoices: {
          choices,
          prompt: '此刻你想...',
          mode: 'choice'
        }
      };
    } catch (error) {
      if (isRelationshipScript) {
        const choices = relationshipBranches.getChoicesByPath(1, []);
        return { nextChoices: { choices, prompt: '此刻你想...', mode: 'choice' } };
      } else {
        // ... existing code ...
      }
    }
  }

  /**
   * 处理自由输入交互
   */
  async processFreeInputInteraction(sessionData, interaction, sessionKey) {
    const { input, text } = interaction;
    const userInput = input || text;
    
    if (!userInput) {
      throw new Error('输入内容不能为空');
    }
    
    // 更新交互计数
    sessionData.interactionCount++;
    sessionData.lastInteractionTime = new Date();
    
    // 生成用户消息
    const userMessage = {
      type: 'user',
      content: userInput,
      timestamp: new Date(),
      time: this.getCurrentTime(),
      avatar: sessionData.script.avatarConfig?.userAvatar || sessionData.script.avatarConfig?.user || '/assets/user/role1.jpg'
    };
    
    // 将用户消息添加到会话历史
    sessionData.messages.push(userMessage);
    
    // 构建对话历史用于AI生成回复
    const conversationHistory = sessionData.messages.slice(-6).map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
    
    // 添加系统提示
    const systemPrompt = this._buildSystemPrompt(sessionData.script);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory
    ];
    
    // 调用DeepSeek API生成AI回复
    let aiContent;
    try {
      const response = await this.deepSeekClient.chat(messages, {
        temperature: 0.8,
        max_tokens: 400
      });
      
      aiContent = response.content || response.message || '我理解你的感受，让我们继续深入探讨这个话题。';
      // 过滤掉括号内的动作描述
      aiContent = aiContent.replace(/\（[^）]*\）/g, '').replace(/\([^)]*\)/g, '').trim();
    } catch (error) {
      console.error('AI回复生成失败:', error);
      aiContent = '我理解你的感受，让我们继续深入探讨这个话题。';
    }
    
    // 生成AI回复
    const aiResponse = {
      type: 'ai',
      content: aiContent,
      timestamp: new Date(),
      time: this.getCurrentTime(),
      avatar: sessionData.script.avatarConfig.aiAvatar || sessionData.script.avatarConfig.ai || '/assets/user/role2.jpg'
    };
    
    // 将AI回复添加到会话历史
    sessionData.messages.push(aiResponse);
    
    // 生成下一轮选择卡，传递最新的消息历史
    const nextChoices = await this.generateNextChoices(sessionKey, null, sessionData.messages);
    
    return {
      userMessage,
      aiResponse,
      nextChoices,
      showSpecialFeatures: this.shouldShowSpecialFeatures(sessionData),
      availableFeatures: this.getAvailableFeatures(sessionData),
      sessionData: this.getPublicSessionData(sessionData)
    };
  }

  _buildSystemPrompt(scriptData) {
    if (!scriptData) return '';
    return `你是Plzme的情感关系类心理剧专家及导演，擅长剧本设计并通过专业的方法引导用户通过心理剧看见自我、让自我成长并从关系中获得成长。正在进行一场名为"${scriptData.title}"的心理剧本。

## 剧本背景
${scriptData.description}

## 你的角色设定
${scriptData.aiRole}

## 用户角色设定
${scriptData.userRole}

## 对话目标
${scriptData.benefits.map(benefit => `- ${benefit}`).join('\n')}

## 对话原则
1. 保持真实、温暖、理解和非评判的态度。
2. 每次回复口语化，保持对话的流畅性。
3. 生成的对话内容符合剧情里的人物性格特色。`;
  }
}

let instance = null;

/**
 * 获取增强聊天管理器实例
 */
function getEnhancedChatManager() {
  if (!instance) {
    instance = new EnhancedChatManager();
  }
  return instance;
}

module.exports = getEnhancedChatManager; 