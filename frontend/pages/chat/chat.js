// pages/chat/chat.js
const DeepSeekClient = require('../../utils/deepseek-client.js');
const ScriptManager = require('../../utils/script-manager.js');
const getEnhancedChatManager = require('../../utils/enhanced-chat-manager.js');
const { getGlobalStorageManager } = require('../../utils/storage-manager.js');

Page({
  data: {
    chatTitle: '心理剧本对话',
    energyMode: false,
    messages: [],
    inputValue: '',
    isLoading: false,
    scrollTop: 0,
    scrollIntoView: '',
    messageId: 0,
    lastInnerMonologueTime: 0, // 用于内心独白功能节流
    lastHighEnergyTime: 0, // 用于高能女主工具节流
    lastRelationshipAnalysisTime: 0, // 用于关系分析功能节流
    
    // 新增数据
    scriptId: '',
    chatType: 'script',
    currentPhase: 'opening',
    conversationHistory: [],
    scriptData: null,
    sessionStartTime: null,
    userResponses: [],
    
    // 动态选择卡系统
    choices: [],
    showChoices: false,
    showInput: false,
    choicesEnabled: true,
    choicesPrompt: '',
    inputPrompt: '',
    
    // 增强交互数据
    sessionKey: '',
    currentChoices: [],
    inputMode: 'free',
    allowFreeInput: true,
    inputPlaceholder: '输入你的想法...',
    inputMaxLength: 500,
    inputHint: '',
    
    // 特殊功能
    showSpecialFeatures: true,
    userMessageCount: 0,
    availableFeatures: [],
    specialFeaturesUsed: {
      innerMonologue: false,
      highEnergyMode: false,
      relationshipAnalysis: false
    },
    
    // 高能模式相关
    isHighEnergyMode: false,
    highEnergyRounds: 0,
    maxHighEnergyRounds: 5,
    
    // 场景数据
    sceneProgress: {
      current: 1,
      total: 30,
      percentage: 0
    },
    sceneSwitchData: null,
    currentSceneStyle: '',
    
    // 调试信息
    debugInfo: {
      messageCount: 0,
      currentAct: 'opening'
    },
    
    // 存储键
    storageKey: '',
    
    // 新增依赖
    deepSeekClient: null,
    scriptManager: null,
    enhancedChatManager: null,
    avatarConfig: null,
    
    // 场景列表相关
    showSceneListModal: false,
    scenesList: [],
    currentScene: null
  },

  async onLoad(options) {
          this.scriptManager = ScriptManager.getInstance();
    this.deepSeekClient = new DeepSeekClient();
    this.enhancedChatManager = getEnhancedChatManager(); // 不需要传参数，内部会自动创建
    this.storageManager = getGlobalStorageManager();
    
    const { scriptId } = options;
    if (!scriptId) {
      wx.showToast({
        title: '参数错误',
        icon: 'error'
      });
      return;
    }

    // 设置存储键
    this.storageKey = `chat_history_${scriptId}`;
    
    // 获取剧本数据
    const scriptData = this.getScriptData(scriptId);
    
    // 根据剧本类型配置头像
    const avatarConfig = this.getAvatarConfig(scriptData);
    
    this.setData({
      scriptId,
      scriptData: scriptData,
      avatarConfig: avatarConfig,
      sessionStartTime: new Date(),
      deepSeekClient: this.deepSeekClient // 添加到data中
    });

    const history = this.storageManager.getChatData(scriptId);
    if (history && history.length > 0) {
      this.setData({ messages: history });
      this.scrollToBottom();
      // 检查是否需要显示特殊功能
      this.checkSpecialFeatures();
      
      // 如果有历史记录，初始化会话管理器但不添加开场消息
      await this.initEnhancedChatOnly();
      
      // 确保输入框和选择卡可见
      this.setData({
        showInput: true,
        showChoices: true
      });
      
      // 显示新场景提示（如果需要）
      if (this.data.messages.length === 0) {
        this.showNewScenePrompt();
      }
    } else {
      this.initEnhancedChat();
    }
  },

  /**
   * 仅初始化会话管理器（不添加开场消息）
   */
  async initEnhancedChatOnly() {
    try {
      console.log('初始化会话管理器（无开场消息）...');
      
      // 获取用户ID
      const userId = wx.getStorageSync('userId') || 'default_user';
      
      const sessionData = await this.enhancedChatManager.initializeSession(
        userId, 
        this.data.scriptId,
        {
          userPreferences: {
            preferredInteractionMode: 'guided'
          }
        }
      );

      console.log('会话初始化成功:', sessionData);

      this.setData({
        sessionKey: sessionData.sessionKey,
        scriptData: sessionData.script,
        sceneProgress: {
          current: sessionData.currentScene.index || 1,
          total: sessionData.script.sceneList.length,
          percentage: (((sessionData.currentScene.index || 1) / sessionData.script.sceneList.length) * 100)
        }
      });

    } catch (error) {
      console.error('初始化会话管理器失败:', error);
      this.setData({ isLoading: false });
    }
  },

  /**
   * 初始化增强聊天系统
   */
  async initEnhancedChat() {
    try {
      console.log('初始化增强聊天系统...');
      
      // 获取用户ID
      const userId = wx.getStorageSync('userId') || 'default_user';
      
      const sessionData = await this.enhancedChatManager.initializeSession(
        userId, 
        this.data.scriptId,
        {
          userPreferences: {
            preferredInteractionMode: 'guided'
          }
        }
      );

      console.log('会话初始化成功:', sessionData);

      this.setData({
        sessionKey: sessionData.sessionKey,
        scriptData: sessionData.script,
        sceneProgress: {
          current: sessionData.currentScene.index || 1,
          total: sessionData.script.sceneList.length,
          percentage: (((sessionData.currentScene.index || 1) / sessionData.script.sceneList.length) * 100)
        }
      });

      // 添加开场消息
      await this.addOpeningMessages(sessionData.openingMessage);
      
      // 生成初始选择卡
      await this.generateInitialChoices();

    } catch (error) {
      console.error('初始化增强聊天失败:', error);
      // 降级到基础对话模式
      await this.initFallbackChat();
    }
  },

  /**
   * 初始化降级聊天（当增强聊天失败时）
   */
  async initFallbackChat() {
    console.log('进入降级聊天模式...');
    
    try {
      // 显示场景介绍
      const { scriptData } = this.data;
      const sceneIntroMessage = {
        type: 'scene_intro',
        content: `场景：${scriptData.scenario || scriptData.description}`,
        time: this.getCurrentTime()
      };
      
      await this.addMessageWithTypewriter(sceneIntroMessage);
      await this.delay(1000);
      
      // 显示第一个场景描述
      if (scriptData.sceneList && scriptData.sceneList.length > 0) {
        const firstScene = scriptData.sceneList[0];
        const sceneMessage = {
          type: 'scene_description',
          content: `${firstScene.name}: ${firstScene.description}`,
          time: this.getCurrentTime()
        };
        
        await this.addMessageWithTypewriter(sceneMessage);
        await this.delay(1000);
      }
      
      // AI开场白
      const welcomeMessage = {
        type: 'ai',
        content: '嗨，我在这里等你...我们可以开始聊聊吗？',
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig.ai
      };
      
      await this.addMessageWithTypewriter(welcomeMessage);
      
      // 显示基础选择卡
      this.setData({
        showChoices: true,
        showInput: true,
        choices: [
          {
            title: '友好回应',
            replyText: '当然，我也想和你聊聊',
            potentialImpact: '营造轻松的对话氛围'
          },
          {
            title: '好奇询问',
            replyText: '你在想什么呢？',
            potentialImpact: '了解对方的想法'
          },
          {
            title: '直接表达',
            replyText: '我有些话想对你说',
            potentialImpact: '开诚布公的沟通'
          }
        ],
        choicesPrompt: '你想如何开始这段对话？',
        choicesEnabled: true
      });
      
    } catch (error) {
      console.error('降级聊天初始化也失败:', error);
      this.addMessage({
        type: 'system_error',
        content: '抱歉，对话系统遇到问题。请刷新页面重试。',
        time: this.getCurrentTime()
      });
    } finally {
      this.setData({ isLoading: false });
    }
  },

  /**
   * 获取默认剧本数据
   */
  getDefaultScriptData() {
    return {
      id: 'default_001',
      title: '咖啡店的约定',
      scenario: '海边咖啡厅的角落桌位，透明玻璃窗外是金黄色的夕阳和波光粼粼的海面',
      character: '她',
      userRole: '你',
      aiRole: '她',
      type: 'male_lead', // 男主本
      themes: ['沟通', '理解', '情感表达'],
      description: '在这个温暖而私密的空间里，一段重要的对话即将开始...',
      sceneList: [
        { name: '咖啡厅相遇', description: '在这个温暖而私密的空间里，一段重要的对话即将开始' },
        { name: '深入交流', description: '彼此敞开心扉，分享内心的想法' },
        { name: '情感共鸣', description: '在理解中找到情感的共鸣点' }
      ]
    };
  },

  /**
   * 添加开场消息
   */
  async addOpeningMessages(openingMessage) {
    console.log('添加开场消息:', openingMessage);
    
    // 1. 场景介绍
    if (openingMessage?.sceneIntro) {
      this.addMessage(openingMessage.sceneIntro);
      await this.delay(1000);
    }

    // 2. AI角色介绍
    if (openingMessage?.roleIntro) {
      this.addMessage(openingMessage.roleIntro);
      await this.delay(800);
    }

    // 3. AI第一句对话
    if (openingMessage?.firstMessage) {
      await this.addMessageWithTypewriter(openingMessage.firstMessage);
      await this.delay(500);
    }

    this.scrollToBottom();
  },

  /**
   * 延迟函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * 生成初始选择卡
   */
  async generateInitialChoices() {
    try {
      console.log('生成初始选择卡...');
      
      // 显示加载状态
      this.setData({ isLoading: true });
      
      const result = await this.enhancedChatManager.generateNextChoices(this.data.sessionKey);

      console.log('初始选择卡结果:', result);

      if (result?.choices && result.choices.length > 0) {
        this.setData({
          showChoices: true,
          showInput: true, // 始终显示输入框
          choices: result.choices,
          choicesPrompt: result.prompt || '你会如何回应？'
        });
        console.log('选择卡已显示');
      } else {
        console.log('没有选择卡，显示输入框');
        this.setData({
          showChoices: false,
          showInput: true,
          inputPrompt: '请输入你的回应...'
        });
      }
    } catch (error) {
      console.error('生成初始选择卡失败:', error);
      // 错误处理，显示提示信息
      this.addMessage({
        type: 'system_error',
        content: '抱歉，无法生成互动选项，请稍后重试。',
        time: this.getCurrentTime()
      });
      this.setData({ showChoices: false, showInput: true, inputPrompt: '你可以自由输入回应...' });
    } finally {
      // 隐藏加载状态
      this.setData({ isLoading: false });
    }
  },

  /**
   * 处理选择卡点击事件
   */
  async handleChoiceSelect(e) {
    const { choice: choiceData, index } = e.currentTarget.dataset;
    
    if (!this.data.choicesEnabled) {
      console.log('选择卡已禁用');
      return;
    }

    // 修复：确保choice是对象而不是字符串
    let choice = choiceData;
    if (typeof choiceData === 'string') {
      try {
        choice = JSON.parse(choiceData);
      } catch (error) {
        console.error('解析选择数据失败:', error);
        // 使用index从choices数组中获取
        choice = this.data.choices[index];
      }
    }

    if (!choice) {
      console.error('无法获取选择数据, index:', index, 'choices:', this.data.choices);
      return;
    }

    console.log('用户选择:', choice);

    // 禁用选择卡，防止重复点击
    this.setData({
      choicesEnabled: false,
      showChoices: false
    });

    // 不在这里添加用户消息，由enhanced-chat-manager统一处理
    // const userMessage = {
    //   type: 'user', 
    //   content: choice.replyText || choice.text,
    //   time: this.getCurrentTime(),
    //   avatar: this.data.avatarConfig.user,
    //   choiceTitle: choice.title || choice.text,
    //   choiceImpact: choice.potentialImpact || choice.impact
    // };

    // await this.addMessageWithTypewriter(userMessage);

    await this.delay(500);

    // 显示加载状态
    this.setData({ isLoading: true });

    try {
      // 添加调试信息
      console.log('当前sessionKey:', this.data.sessionKey);
      console.log('选择数据:', choice);
      
      // 检查sessionKey是否存在
      if (!this.data.sessionKey) {
        console.error('SessionKey不存在，尝试重新初始化...');
        throw new Error('SessionKey不存在');
      }
      
      // 检查enhancedChatManager是否存在
      if (!this.enhancedChatManager) {
        console.error('EnhancedChatManager不存在，重新创建...');
        this.enhancedChatManager = getEnhancedChatManager();
        throw new Error('EnhancedChatManager需要重新初始化');
      }
      
      // 检查是否有有效的sessionKey，如果没有则使用降级处理
      if (!this.data.sessionKey || !this.enhancedChatManager) {
        console.log('使用降级选择处理模式');
        await this.handleFallbackChoice(choice, index);
        return;
      }
      
      // 使用enhanced-chat-manager处理选择交互
      const result = await this.enhancedChatManager.processUserInteraction(
        this.data.sessionKey,
        {
          type: 'choice',
          choice: choice,
          choiceIndex: index
        }
      );

      // 隐藏加载状态
      this.setData({ isLoading: false });

      await this.delay(300);

      // 立即显示用户消息（无打字机效果）
      if (result.userMessage) {
        this.addMessage(result.userMessage);
        // AI思考时间，更真实的停顿
        await this.delay(1000);
      }

      // 添加AI回复到页面显示（带打字机效果）
      if (result.aiResponse) {
        await this.addMessageWithTypewriter(result.aiResponse);
        await this.delay(500);
      }

      // 检查特殊功能
      if (result.showSpecialFeatures) {
        this.setData({
          availableFeatures: result.availableFeatures || []
        });
      }

      // 生成新的选择卡
      if (result.nextChoices && result.nextChoices.choices) {
        this.setData({
          showChoices: true,
          choices: result.nextChoices.choices,
          choicesPrompt: result.nextChoices.prompt || '接下来你想如何回应？',
          choicesEnabled: true
        });
      }

    } catch (error) {
      console.error('处理选择失败:', error);
      
      // 隐藏加载状态
      this.setData({ isLoading: false });
      
      // 显示错误提示，但避免重新初始化导致循环
      this.addMessage({
        type: 'system_error',
        content: '抱歉，处理您的选择时出错。您可以尝试重新点击选择卡或直接输入消息。',
        time: this.getCurrentTime()
      });
      
      // 重新启用选择卡和输入框
      this.setData({
        choicesEnabled: true,
        showChoices: true,
        showInput: true
      });
    }
  },

  /**
   * 处理降级模式的选择卡点击
   */
  async handleFallbackChoice(choice, index) {
    try {
      // 立即添加用户消息（无打字机效果）
      const userMessage = {
        type: 'user',
        content: choice.replyText || choice.text,
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig.user,
        choiceTitle: choice.title || choice.text,
        choiceImpact: choice.potentialImpact || choice.impact
      };

      // 立即显示用户消息，不使用打字机效果
      this.addMessage(userMessage);
      await this.delay(500);

      // 生成AI回复
      const aiResponse = await this.generateSimpleAIResponse(choice);
      await this.addMessageWithTypewriter(aiResponse);
      await this.delay(500);

      // 生成新的选择卡
      await this.generateFallbackChoices();

    } catch (error) {
      console.error('降级选择处理失败:', error);
      this.addMessage({
        type: 'system_error',
        content: '抱歉，处理选择时出错，请重试。',
        time: this.getCurrentTime()
      });
    } finally {
      this.setData({ isLoading: false, choicesEnabled: true });
    }
  },

  /**
   * 生成简单AI回复
   */
  async generateSimpleAIResponse(choice) {
    try {
      // 使用DeepSeek生成回复
      const prompt = `作为心理剧中的AI角色，用户刚才选择了"${choice.title}"，回复内容是"${choice.replyText}"。
请生成一个自然、符合角色设定的回应，要求：
1. 回应长度30-50字
2. 符合剧情发展
3. 自然口语化
4. 推进对话发展

直接回复内容，不要其他解释：`;

      const response = await this.data.deepSeekClient.chat([
        { role: 'user', content: prompt }
      ], { temperature: 0.8, max_tokens: 200 });

      let content = response.content || response.message || '我理解你的想法，这确实是个不错的开始。';
      content = content.replace(/\（[^）]*\）/g, '').replace(/\([^)]*\)/g, '').trim();
      
      // 去掉句首句尾的双引号（对话标记）
      content = content.replace(/^[""]|[""]$/g, '').replace(/^"|"$/g, '').trim();

      return {
        type: 'ai',
        content: content,
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig.ai
      };

    } catch (error) {
      console.error('生成AI回复失败:', error);
      return {
        type: 'ai',
        content: '我理解你的想法，让我们继续深入探讨吧。',
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig.ai
      };
    }
  },

  /**
   * 生成降级模式选择卡
   */
  async generateFallbackChoices() {
    const fallbackChoices = [
      {
        title: '继续探讨',
        replyText: '我想了解更多',
        potentialImpact: '深入当前话题'
      },
      {
        title: '表达感受',
        replyText: '让我说说我的感受',
        potentialImpact: '分享内心想法'
      },
      {
        title: '转换话题',
        replyText: '我们聊点别的吧',
        potentialImpact: '改变对话方向'
      }
    ];

    this.setData({
      showChoices: true,
      choices: fallbackChoices,
      choicesPrompt: '你想如何继续？',
      choicesEnabled: true
    });
  },

  /**
   * 生成AI回复
   */
  async generateAIResponse(choiceData) {
    try {
      console.log('调用DeepSeek API生成回复...');
      
      // 显示加载状态
      this.setData({ isLoading: true });
      
      // 构建对话历史
      const conversationHistory = this.data.messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      // 添加当前选择的上下文
      const prompt = `
你是一位资深的心理剧导演和编剧，擅长情感关系分析和心理动态把握。

剧本标题：《${this.data.scriptData?.title || '心理剧场景'}》
剧本简介：${this.data.scriptData?.description || '心理剧简介'}
场景设定：${this.data.scriptData?.scenario || '情感关系探索场景'}
角色关系：你扮演${this.data.scriptData?.aiRole || '对话伙伴'}，用户扮演${this.data.scriptData?.userRole || '参与者'}

用户刚才的选择：
- 行动标题：${choiceData.title || choiceData.text}
- 实际回复：${choiceData.replyText || choiceData.text}
- 潜在影响：${choiceData.potentialImpact || choiceData.impact}

请作为角色生成自然、真实的回应，要求：
1. 回应要符合角色设定和情感状态
2. 语言自然流畅，避免括号内的动作描述，符合逻辑和常识，口语化，仿照微信聊天场景，可以适当增加emoji
3. 体现心理层面的微妙变化
4. 推进剧情发展，为下一轮互动做铺垫
5. 回应长度控制在50字以内，符合角色性格特色

请直接回复角色的对话内容：
`;

      conversationHistory.push({
        role: 'user',
        content: prompt
      });

      // 调用DeepSeek API
      const aiResponse = await this.data.deepSeekClient.chat(conversationHistory, {
        temperature: 0.8,
        max_tokens: 400
      });

      let aiContent = aiResponse.content || aiResponse.message || '我理解你的想法，让我们继续深入探讨。';
      
      // 过滤掉括号内的动作描述 - 支持中英文括号
      aiContent = aiContent.replace(/\（[^）]*\）/g, '').replace(/\([^)]*\)/g, '').trim();
      
      const aiMessage = {
        type: 'ai',
        content: aiContent,
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig.ai,
        replyTo: choiceData.title || choiceData.text
      };

      console.log('AI回应生成完成:', aiMessage.content);
      return aiMessage;

    } catch (error) {
      console.error('生成AI回复失败:', error);
      
      // 使用fallback回复
      const aiMessage = {
        type: 'ai',
        content: '我理解你的选择。这确实是一个很好的方式来处理这种情况。让我们继续深入探讨吧。',
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig.ai
      };

      return aiMessage;
    } finally {
      // 隐藏加载状态
      this.setData({ isLoading: false });
    }
  },

  /**
   * 生成新的选择卡
   */
  async generateNewChoices(previousChoice) {
    try {
      console.log('生成新的选择卡...');
      
      // 显示加载状态
      this.setData({ isLoading: true });
      
      // 传递当前最新的消息历史
      const result = await this.enhancedChatManager.generateNextChoices(this.data.sessionKey, previousChoice, this.data.messages);

      setTimeout(() => {
        this.setData({
          showChoices: true,
          showInput: true, // 始终保持输入框可见
          choices: result.choices,
          choicesPrompt: result.prompt || '接下来你想如何回应？',
          choicesEnabled: true
        });
        console.log('新选择卡已显示');
      }, 500);

    } catch (error) {
      console.error('生成新选择卡失败:', error);
      
      // 显示错误提示，并允许用户自由输入
      this.addMessage({
        type: 'system_error',
        content: '抱歉，无法生成新的互动选项。',
        time: this.getCurrentTime()
      });
      this.setData({
        showChoices: false,
        showInput: true,
        inputPrompt: '你可以自由输入回应...',
        choicesEnabled: true
      });
    } finally {
      // 隐藏加载状态
      this.setData({ isLoading: false });
    }
  },

  /**
   * 切换输入模式
   */
  switchInputMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      inputMode: mode,
      allowFreeInput: mode === 'free',
      inputHint: mode === 'free' ? '你可以自由表达想法，AI会智能分析并引导对话' : ''
    });
  },

  /**
   * 发送消息（自由输入）
   */
  async sendMessage(options = {}) {
    const text = options.text || this.data.inputValue.trim();
    if (!text) return;

    // 清空输入框并显示加载状态
    this.setData({ 
      inputValue: '', 
      isLoading: true,
      currentChoices: [], // 清除选择卡
      showChoices: false,
      choicesEnabled: false
    });

    try {
      // 检查sessionKey和enhancedChatManager是否存在
      if (!this.data.sessionKey || !this.enhancedChatManager) {
        console.error('Session未正确初始化，尝试重新初始化...');
        await this.initEnhancedChat();
        
        if (!this.data.sessionKey || !this.enhancedChatManager) {
          throw new Error('无法建立有效的对话会话');
        }
      }

      // 处理用户交互（这会在内部添加用户消息到sessionData）
      const result = await this.enhancedChatManager.processUserInteraction(
        this.data.sessionKey,
        {
          type: 'free_input',
          text: text
        }
      );

      // 添加用户消息到页面显示
      if (result.userMessage) {
        this.addMessage(result.userMessage); // 立即显示，不用打字机效果
        await this.delay(500);
      } else {
        // 如果没有userMessage，手动创建一个
        const userMessage = {
          type: 'user',
          content: text,
          time: this.getCurrentTime(),
          avatar: this.data.avatarConfig?.user || '/assets/user/role1.jpg'
        };
        this.addMessage(userMessage);
        await this.delay(500);
      }

      // 添加AI回应（使用打字机效果）
      if (result.aiResponse) {
        await this.addMessageWithTypewriter(result.aiResponse);
        await this.delay(500);
      }

      // 生成新的选择卡
      if (result.nextChoices && result.nextChoices.choices) {
        this.setData({
          showChoices: true,
          choices: result.nextChoices.choices,
          choicesPrompt: result.nextChoices.prompt || '接下来你想如何回应？',
          choicesEnabled: true
        });
      } else {
        // 如果没有选择卡，保持输入框可用
        this.setData({
          showChoices: false,
          showInput: true
        });
      }

      // 检查特殊功能
      if (result.showSpecialFeatures) {
        this.setData({
          availableFeatures: result.availableFeatures || []
        });
      }

      // 更新会话数据
      if (result.sessionData) {
        this.updateSessionData(result.sessionData);
      }

    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 添加用户消息（即使AI处理失败）
      const userMessage = {
        type: 'user',
        content: text,
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig?.user || '/assets/user/role1.jpg'
      };
      this.addMessage(userMessage);
      await this.delay(500);
      
      // 显示错误信息并生成fallback回复
      const errorMessage = {
        type: 'ai',
        content: '抱歉，我刚才走神了...你能再说一遍吗？',
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig?.ai || '/assets/user/role2.jpg'
      };
      await this.addMessageWithTypewriter(errorMessage);
      
      // 生成fallback选择卡
      await this.generateFallbackChoices();
      
      this.showError('网络连接不稳定，请稍后再试');
    } finally {
      this.setData({ isLoading: false });
    }
  },

  /**
   * 生成自由输入后的选择卡
   */
  async generateChoicesAfterFreeInput() {
    try {
      const result = await this.enhancedChatManager.processUserInteraction(
        this.data.sessionKey,
        {
          type: 'get_choices',
          context: 'after_free_input'
        }
      );

      if (result.nextChoices) {
        this.setData({
          currentChoices: result.nextChoices.choices,
          choicesPrompt: result.nextChoices.prompt,
          inputMode: 'choice',
          allowFreeInput: false
        });
      }
    } catch (error) {
      console.error('生成选择卡失败:', error);
    }
  },

  /**
   * 检查是否满足工具使用条件
   */
  checkToolUsageRequirement() {
    if (this.data.userMessageCount < 3) {
      wx.showToast({
        title: '请再多聊一会儿吧',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    return true;
  },

  /**
   * 激活内心独白功能
   */
  async activateInnerMonologue() {
    if (!this.checkToolUsageRequirement()) {
      return;
    }

    const now = Date.now();
    if (now - this.data.lastInnerMonologueTime < 30000) { // 30秒内只能使用一次
      wx.showToast({
        title: '请稍后再试',
        icon: 'none'
      });
      return;
    }
    this.setData({ lastInnerMonologueTime: now }); // 更新点击时间

    try {
      this.setData({ isLoading: true });
      
      // 获取最近的对话内容
      const recentMessages = this.data.messages.slice(-5);
      const conversationContext = recentMessages.map(msg => 
        `${msg.type === 'user' ? '用户' : 'AI角色'}：${msg.content}`
      ).join('\n');
      
      // 构建内心独白提示
      const monologuePrompt = `
你是心理剧中的AI角色，现在需要生成你的内心独白，解释你的行为动机和心理状态。

最近的对话内容：
${conversationContext}

请作为AI角色生成真实的内心独白，要求：
1. 以第一人称表达你的真实想法和感受
2. 解释你的行为动机和心理状态
3. 可以包含矛盾、恐惧、期待等复杂情感
4. 语言自然真实，避免过于分析性的表达
5. 长度控制在50-80字
6. 不要括号动作描述

请直接回复角色的内心独白：
`;

      const response = await this.data.deepSeekClient.chat([
        { role: 'user', content: monologuePrompt }
      ]);

      let monologueContent = response.content || response.message || '此刻我的内心很复杂，既想要亲近又担心受伤...';
      
      // 过滤掉括号内的动作描述
      monologueContent = monologueContent.replace(/\（[^）]*\）/g, '').replace(/\([^)]*\)/g, '').trim();
      
      const monologueMessage = {
        type: 'inner_monologue',
        content: monologueContent,
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig.ai
      };
      
      await this.addMessageWithTypewriter(monologueMessage);
      
      // 显示提示
      wx.showToast({
        title: '已显示角色内心独白',
        icon: 'success',
        duration: 2000
      });
      
    } catch (error) {
      console.error('生成内心独白失败:', error);
      
      // 使用预设内心独白
      const fallbackMessage = {
        type: 'inner_monologue', 
        content: '我能感受到对方的情绪变化，我也在思考如何更好地回应和理解...',
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig.ai
      };
      
      await this.addMessageWithTypewriter(fallbackMessage);
      
    } finally {
      this.setData({ isLoading: false });
    }
  },

  /**
   * 激活变身高能模式
   */
  async activateHighEnergyMode() {
    if (!this.checkToolUsageRequirement()) {
      return;
    }

    const now = Date.now();
    if (now - this.data.lastHighEnergyTime < 60000) { // 60秒节流
      wx.showToast({
        title: '请勿重复点击，60秒后再试',
        icon: 'none'
      });
      return;
    }
    this.setData({ lastHighEnergyTime: now }); // 更新点击时间
    
    try {
      this.setData({ isLoading: true });
      
      // 激活高能模式
      this.setData({ 
        isHighEnergyMode: true, 
        highEnergyRounds: 0,
        showChoices: false,
        showInput: false
      });

      const activationMessage = {
        type: 'high_energy_activation',
        content: '🔥 变身高能模式已激活！\n\n接下来我将进入高能状态，带你体验真正的主角光环！准备好接受强大的自己了吗？✨',
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig.ai
      };
      
      await this.addMessageWithTypewriter(activationMessage);
      await this.delay(1000);
      
      // 开始AI自动对话
      await this.startHighEnergyAutoChat();
      
      wx.showToast({
        title: '变身高能模式已激活',
        icon: 'success',
        duration: 2000
      });
      
    } catch (error) {
      console.error('激活高能女主工具失败:', error);
      
      const fallbackMessage = {
        type: 'high_energy',
        content: '释放你内在的力量，成为自己人生的主角！你有能力掌控自己的情感和选择！',
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig.ai
      };
      
      await this.addMessageWithTypewriter(fallbackMessage);
      
    } finally {
      this.setData({ isLoading: false });
    }
  },

  /**
   * 开始高能模式自动对话
   */
  async startHighEnergyAutoChat() {
    try {
      await this.generateHighEnergyRound();
    } catch (error) {
      console.error('高能模式自动对话失败:', error);
      await this.endHighEnergyMode();
    }
  },

  /**
   * 生成一轮高能模式对话
   */
  async generateHighEnergyRound() {
    // 检查模式是否还在激活状态
    if (!this.data.isHighEnergyMode) {
      console.log('高能模式已关闭，停止生成对话');
      return;
    }
    
    if (this.data.highEnergyRounds >= this.data.maxHighEnergyRounds) {
      await this.endHighEnergyMode();
      return;
    }

    const currentRound = this.data.highEnergyRounds + 1;
    
    try {
      // 生成高能导师的回复
      const aiPrompt = `你现在是高能导师模式，第${currentRound}轮对话。你要：

1. 展现极强的自信和主导力
2. 用激励性、有力量的语言
3. 帮助用户看到自己的价值和潜力  
4. 语言风格霸气、直接、有感染力
5. 适当使用emoji，但一句话不超过2个
6. 长度控制在50-100字

生成一段高能导师的激励话语：`;

      const aiResponse = await this.data.deepSeekClient.chat([
        { role: 'user', content: aiPrompt }
      ], { temperature: 0.9, max_tokens: 300 });

      let aiContent = aiResponse.content || aiResponse.message || '你就是天生的主角！不要让任何人质疑你的价值！💪';
      aiContent = aiContent.replace(/\（[^）]*\）/g, '').replace(/\([^)]*\)/g, '').trim();

      const aiMessage = {
        type: 'high_energy_ai',
        content: aiContent,
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig.ai,
        round: currentRound
      };

      await this.addMessageWithTypewriter(aiMessage);
      await this.delay(2000);

      // 生成用户的高能回复
      await this.generateHighEnergyUserReply(currentRound);

    } catch (error) {
      console.error('生成高能模式对话失败:', error);
      await this.endHighEnergyMode();
    }
  },

  /**
   * 生成用户的高能回复
   */
  async generateHighEnergyUserReply(round) {
    // 检查模式是否还在激活状态
    if (!this.data.isHighEnergyMode) {
      console.log('高能模式已关闭，停止生成用户回复');
      return;
    }
    
    try {
      const userPrompt = `现在是高能模式第${round}轮，用户受到激励后的回应。生成一句：

1. 体现用户逐渐被激发的状态
2. 语言自信、有力量感
3. 表达对自己的认可和决心
4. 长度控制在20-50字
5. 口语化、真实自然

直接生成用户回复内容：`;

      const userResponse = await this.data.deepSeekClient.chat([
        { role: 'user', content: userPrompt }
      ], { temperature: 0.8, max_tokens: 200 });

      let userContent = userResponse.content || userResponse.message || '你说得对！我确实值得更好的！';
      userContent = userContent.replace(/\（[^）]*\）/g, '').replace(/\([^)]*\)/g, '').trim();

      const userMessage = {
        type: 'high_energy_user',
        content: userContent,
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig.user,
        round: round
      };

      await this.addMessageWithTypewriter(userMessage);
      await this.delay(1500);

      // 更新轮数
      this.setData({ highEnergyRounds: round });

      // 继续下一轮或结束（检查模式是否还在激活状态）
      if (round < this.data.maxHighEnergyRounds && this.data.isHighEnergyMode) {
        setTimeout(() => {
          // 再次检查模式状态，防止用户手动结束后继续执行
          if (this.data.isHighEnergyMode) {
            this.generateHighEnergyRound();
          }
        }, 1000);
      } else {
        await this.endHighEnergyMode();
      }

    } catch (error) {
      console.error('生成用户高能回复失败:', error);
      await this.endHighEnergyMode();
    }
  },

  /**
   * 结束高能模式
   */
  async endHighEnergyMode() {
    const endMessage = {
      type: 'high_energy_end',
      content: '✨ 高能模式结束！感受到内在力量的觉醒了吗？现在的你更加强大了！',
      time: this.getCurrentTime(),
      avatar: this.data.avatarConfig.ai
    };

    await this.addMessageWithTypewriter(endMessage);
    await this.delay(1000);

    // 恢复正常模式
    this.setData({
      isHighEnergyMode: false,
      highEnergyRounds: 0,
      showChoices: true,
      showInput: true
    });

    // 生成新的选择卡
    if (this.enhancedChatManager && this.data.sessionKey) {
      try {
        const result = await this.enhancedChatManager.generateNextChoices(this.data.sessionKey);
        if (result?.choices && result.choices.length > 0) {
          this.setData({
            choices: result.choices,
            choicesPrompt: result.prompt || '回到正常对话，你想如何继续？',
            choicesEnabled: true
          });
        }
      } catch (error) {
        console.error('生成恢复模式选择卡失败:', error);
        await this.generateFallbackChoices();
      }
    } else {
      await this.generateFallbackChoices();
    }
  },

  /**
   * 手动结束高能模式
   */
  async manualEndHighEnergyMode() {
    if (this.data.isHighEnergyMode) {
      // 立即设置状态，阻止后续自动对话
      this.setData({
        isHighEnergyMode: false,
        highEnergyRounds: 0
      });
      
      await this.endHighEnergyMode();
      wx.showToast({
        title: '已退出高能模式',
        icon: 'success'
      });
    }
  },

  /**
   * 激活关系分析功能
   */
  async activateRelationshipAnalysis() {
    if (!this.checkToolUsageRequirement()) {
      return;
    }

    const now = Date.now();
    if (now - this.data.lastRelationshipAnalysisTime < 120000) { // 120秒内只能使用一次
      wx.showToast({
        title: '请勿重复点击，2分钟后再试',
        icon: 'none'
      });
      return;
    }
    this.setData({ lastRelationshipAnalysisTime: now }); // 更新点击时间
    
    try {
      this.setData({ isLoading: true });
      
      // 获取最近的对话内容
      const recentMessages = this.data.messages.slice(-8);
      const conversationContext = recentMessages.map(msg => 
        `${msg.type === 'user' ? '用户' : 'AI角色'}：${msg.content}`
      ).join('\n');
      
      const prompt = `
请基于以下对话内容，生成一份关系分析报告：

对话内容：
${conversationContext}

请从以下几个维度分析：
1. 关系状态：当前关系的整体状况
2. 沟通模式：双方的沟通特点和模式
3. 情感动态：情感变化和互动特征
4. 成长建议：具体的改善建议
5. 温暖鼓励：给予正面的鼓励和支持

请用简洁专业的语言，每个维度2-3句话，总字数控制在200字以内。
`;

      const response = await this.data.deepSeekClient.chat([
        { role: 'user', content: prompt }
      ]);

      let analysisContent = response.content || response.message || `
【关系状态】：正在探索和磨合中，双方都在寻找合适的相处模式
【沟通模式】：善于观察、情感细腻、渴望理解、勇于表达
【情感动态】：在温暖与谨慎之间寻找平衡，互动中体现出真诚和关怀
【成长建议】：保持真诚沟通、建立健康边界、培养自我价值感
【温暖鼓励】：你的真诚和勇气值得被珍惜，继续做那个敢于表达的自己`;
      
      // 过滤掉括号内的动作描述
      analysisContent = analysisContent.replace(/\（[^）]*\）/g, '').replace(/\([^)]*\)/g, '').trim();
      
      const analysisMessage = {
        type: 'relationship_analysis',
        content: analysisContent,
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig.ai
      };
      
      await this.addMessageWithTypewriter(analysisMessage);
      
      wx.showToast({
        title: '关系分析已生成',
        icon: 'success',
        duration: 2000
      });
      
    } catch (error) {
      console.error('生成关系分析失败:', error);
      
      const fallbackMessage = {
        type: 'relationship_analysis',
        content: `【关系状态】：正在探索和磨合中，双方都在寻找合适的相处模式\n【沟通特点】：善于观察、情感细腻、渴望理解、勇于表达\n【成长建议】：保持真诚沟通、建立健康边界、培养自我价值感\n【温暖鼓励】：你的真诚和勇气值得被珍惜，继续做那个敢于表达的自己`,
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig.ai
      };
      
      await this.addMessageWithTypewriter(fallbackMessage);
      
    } finally {
      this.setData({ isLoading: false });
    }
  },

  /**
   * 继续到下一场景
   */
  async continueToNextScene() {
    this.setData({ 
      sceneSwitchData: null,
      isLoading: true,
      currentChoices: [],
      messages: [] // 清除当前对话
    });

    try {
      // 重新初始化增强聊天
      await this.initEnhancedChat();
    } catch (error) {
      console.error('切换场景失败:', error);
      this.showError('场景切换失败');
    } finally {
      this.setData({ isLoading: false });
    }
  },

  /**
   * 重新开始当前场景
   */
  async restartCurrentScene() {
    this.setData({
      sceneSwitchData: null,
      messages: [],
      currentChoices: [],
      specialFeaturesUsed: {
        innerMonologue: false,
        highEnergyMode: false,
        relationshipAnalysis: false
      }
    });

    // 重新初始化
    await this.initEnhancedChat();
  },

  /**
   * 更新会话数据
   */
  updateSessionData(sessionData) {
    // 防御性编程，确保所有必要的数据结构都存在
    if (!sessionData) {
      console.warn('sessionData为空，跳过更新');
      return;
    }

    // 确保script存在
    const script = sessionData.script || this.data.scriptData || this.getScriptData(this.data.scriptId);
    
    // 确保currentScene存在
    const currentScene = sessionData.currentScene || { 
      index: 1, 
      name: '开始场景',
      description: '开始对话' 
    };
    
    // 确保sceneList存在
    const sceneList = script?.sceneList || [{ name: '默认场景', description: '心理剧对话场景' }];
    
    this.setData({
      sceneProgress: {
        current: currentScene.index || 1,
        total: sceneList.length || 3,
        percentage: ((currentScene.index || 1) / (sceneList.length || 3)) * 100
      },
      availableFeatures: sessionData.availableFeatures || [],
      userMessageCount: sessionData.interactionCount || 0
    });
  },

  /**
   * 检查特殊功能可用性
   */
  checkSpecialFeatures() {
    const userMessageCount = this.data.messages.filter(msg => msg.type === 'user').length;
    
    this.setData({
      userMessageCount: userMessageCount,
      availableFeatures: userMessageCount >= 3 ? ['innerMonologue', 'highEnergyMode', 'relationshipAnalysis'] : []
    });
  },

  /**
   * 显示错误信息
   */
  showError(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  },

  /**
   * 页面卸载时记录时间信息
   */
  onUnload() {
    // 在聊天中央添加时间记录
    const endTimeStr = this.formatEndTime();
    const timeMessage = {
      type: 'time_record',
      content: `对话结束于：${endTimeStr}`,
      timestamp: new Date()
    };
    
    // 添加到消息列表
    const messages = [...this.data.messages, timeMessage];
    
    // 保存聊天历史（优化存储）
    if (this.data.scriptId) {
      this.storageManager.setChatData(this.data.scriptId, messages, 'daily');
    }
  },

  /**
   * 格式化结束时间
   */
  formatEndTime() {
    const now = new Date();
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    const isToday = now.toDateString() === today.toDateString();
    const isYesterday = now.toDateString() === yesterday.toDateString();
    
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (isToday) {
      return `今天 ${timeStr}`;
    } else if (isYesterday) {
      return `昨天 ${timeStr}`;
    } else {
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      return `${month}月${day}日 ${timeStr}`;
    }
  },

  onReady() {
    // 页面准备就绪
  },

  onShow() {
    // 滚动到底部
    this.scrollToBottom();
  },

  /**
   * 生成AI欢迎消息
   */
  async generateAIWelcomeMessage() {
    try {
      const scriptData = this.data.scriptData;
      
      // 根据剧本场景生成合适的开场白
      let welcomeContent = '';
      if (scriptData.title.includes('咖啡') || scriptData.scenario.includes('咖啡')) {
        welcomeContent = '你终于来了...我在想，我们之间是不是该好好谈谈了。';
      } else if (scriptData.scenario.includes('雨夜')) {
        welcomeContent = '这雨下得真大，我们找个地方避避雨吧。其实...我一直想跟你说些什么。';
      } else {
        welcomeContent = '我觉得我们需要聊聊，有些话憋在心里太久了。';
      }

      // 创建AI欢迎消息
      const aiWelcomeMessage = {
        type: 'ai',
        content: welcomeContent,
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig.ai,
        isWelcome: true
      };

      // 使用打字机效果显示AI欢迎消息
      await this.addMessageWithTypewriter(aiWelcomeMessage);

    } catch (error) {
      console.error('生成AI欢迎消息失败:', error);
      
      // 使用默认欢迎消息
      const fallbackMessage = {
        type: 'ai',
        content: '我们能聊聊吗？我觉得现在正是时候。',
        time: this.getCurrentTime(),
        avatar: this.data.avatarConfig.ai,
        isWelcome: true
      };

      await this.addMessageWithTypewriter(fallbackMessage);
    }
  },

  /**
   * 获取降级开场消息
   */
  getFallbackOpeningMessage() {
    const { scriptData } = this.data;
    return `欢迎来到《${scriptData.title}》心理剧场景。我是你的专业导演，将陪伴你探索内心世界。准备好开始这段成长之旅了吗？`;
  },

  /**
   * 获取剧本主题
   */
  getScriptThemes(scriptId) {
    const themeMap = {
      'relationship_uncertainty': ['关系不确定', '情感探索', '自我成长'],
      'communication_barrier': ['沟通障碍', '理解差异', '情感表达'],
      'trust_building': ['信任建立', '安全感', '情感依恋'],
      'conflict_resolution': ['冲突解决', '妥协艺术', '关系修复'],
      'default': ['人际关系', '情感成长', '自我认知']
    };
    
    return themeMap[scriptId] || themeMap.default;
  },

  /**
   * 输入框内容变化
   */
  onInputChange(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  /**
   * 添加消息
   */
  addMessage(message) {
    const newMessage = {
      ...message,
      id: Date.now() + Math.random(),
      time: message.time || this.getCurrentTime()
    };

    const messages = [...this.data.messages, newMessage];
    this.setData({ messages });
    
    // 如果是用户消息，检查特殊功能可用性
    if (message.type === 'user') {
      this.checkSpecialFeatures();
    }
    
    this.scrollToBottom();
    
    // 保存聊天历史（优化存储）
    if (this.data.scriptId) {
      this.storageManager.setChatData(this.data.scriptId, messages, 'daily');
    }
    
    // Debug: 显示当前消息数量
    console.log('添加消息后，总消息数:', messages.length);
    console.log('用户消息数:', messages.filter(m => m.type === 'user').length);
  },

  /**
   * 滚动到底部
   */
  scrollToBottom() {
    setTimeout(() => {
      const query = wx.createSelectorQuery();
      query.select('.message-list').boundingClientRect();
      query.exec(res => {
        if (res[0]) {
          this.setData({
            scrollTop: res[0].height
          });
        }
      });
    }, 100);
  },

  /**
   * 获取当前时间
   */
  getCurrentTime() {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  },

  /**
   * 获取默认场景名称
   */
  getDefaultScenario(scriptId) {
    const scenarios = {
      'relationship_uncertainty': '两人关系模糊不清的深夜对话',
      'communication_barrier': '误解产生后的澄清时刻',
      'trust_building': '需要建立信任的关键对话',
      'conflict_resolution': '冲突爆发后的和解尝试'
    };
    return scenarios[scriptId] || '一段需要深入探讨的对话场景';
  },

  /**
   * 获取默认场景描述
   */
  getDefaultScenarioDesc(scriptId) {
    const descriptions = {
      'relationship_uncertainty': '在这个场景中，你们将面对关系定义不明确带来的焦虑和困惑',
      'communication_barrier': '探索沟通中的误解，学习更好的表达方式',
      'trust_building': '在信任的基础上，建立更深层的情感连接',
      'conflict_resolution': '学习如何在冲突中保持理性，寻找双赢的解决方案'
    };
    return descriptions[scriptId] || '通过角色扮演，探索真实的情感反应和成长机会';
  },

  /**
   * 返回上一页
   */
  navigateBack() {
    wx.navigateBack();
  },

  /**
   * 显示心理工具箱
   */
  showToolbox() {
    wx.showActionSheet({
      itemList: ['内心独白', '关系报告'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.activateTool('inner_monologue');
            break;
          case 1:
            this.activateTool('relationship_report');
            break;
        }
      }
    });
  },

  /**
   * 激活心理工具
   */
  async activateTool(toolType) {
    try {
      if (this.deepSeekClient && this.deepSeekClient.apiKey) {
        // 使用AI生成工具引导
        await this.generateToolGuidance(toolType);
      } else {
        // 降级到预设引导
        await this.usePresetToolGuidance(toolType);
      }
    } catch (error) {
      console.error('工具激活失败:', error);
      await this.usePresetToolGuidance(toolType);
    }
  },

  /**
   * 使用AI生成工具引导
   */
  async generateToolGuidance(toolType) {
    const { scriptData, energyMode } = this.data;
    
    const systemPrompt = this.deepSeekClient.generateSystemPrompt(scriptData, energyMode);
    const toolPrompt = this.deepSeekClient.generateToolPrompt(toolType);
    
    const messages = [
      {
        role: 'system',
        content: systemPrompt + '\n\n' + toolPrompt
      },
      {
        role: 'user',
        content: `请激活${this.getToolName(toolType)}工具，开始引导我。`
      }
    ];

    this.setData({ isLoading: true });

    try {
      const response = await this.deepSeekClient.chat(messages, {
        temperature: 0.8,
        maxTokens: 400
      });

      if (response.success) {
        await this.addMessageWithTypewriter({
          type: 'ai',
          content: response.content
        });

        // 更新对话历史
        this.data.conversationHistory.push(...messages);
        this.data.conversationHistory.push({
          role: 'assistant',
          content: response.content
        });
      } else {
        throw new Error(response.error);
      }
    } finally {
      this.setData({ isLoading: false });
    }
  },

  /**
   * 使用预设工具引导（降级方案）
   */
  async usePresetToolGuidance(toolType) {
    const toolMessages = {
      'inner_monologue': '让我们开始一段内心独白。请闭上眼睛，深呼吸，然后告诉我：此刻你内心最深处的声音在说什么？',
      'relationship_report': '我将为你生成一份关系洞察报告。请描述一段对你很重要的关系，可以是恋人、朋友或家人。'
    };

    await this.addMessageWithTypewriter({
      type: 'ai',
      content: toolMessages[toolType],
      avatar: this.data.scriptData?.avatarConfig?.aiAvatar || '/assets/user/role2.jpg'
    });
  },

  /**
   * 获取工具名称
   */
  getToolName(toolType) {
    const names = {
      'inner_monologue': '内心独白',
      'relationship_report': '关系报告'
    };
    return names[toolType] || '心理工具';
  },

  /**
   * 结束对话
   */
  endSession() {
    wx.showModal({
      title: '结束对话',
      content: '确定要结束这次心理剧本体验吗？我们可以为你生成一份成长报告。',
      confirmText: '生成报告',
      cancelText: '继续对话',
      success: (res) => {
        if (res.confirm) {
          this.generateGrowthReport();
        }
      }
    });
  },

  /**
   * 生成成长报告
   */
  generateGrowthReport() {
    const { sessionStartTime, scriptData, userResponses, energyMode } = this.data;
    
    // 计算会话时长
    const endTime = new Date();
    const duration = Math.round((endTime - sessionStartTime) / 1000 / 60); // 分钟
    
    let report = {
      title: this.data.chatTitle,
      duration: `${duration}分钟`,
      messageCount: this.data.messages.length,
      userResponseCount: userResponses.length,
      energyMode: energyMode
    };

    if (scriptData && this.scriptManager) {
      // 使用剧本管理器生成详细报告
      const scriptSummary = this.scriptManager.generateScriptSummary(
        scriptData.id, 
        userResponses
      );
      
      report = {
        ...report,
        ...scriptSummary,
        insights: scriptSummary.insights || ['提升了自我认知', '增强了情感表达能力'],
        recommendations: scriptSummary.recommendations || ['继续保持自我探索的勇气']
      };
    } else {
      // 默认报告内容
      report.insights = ['提升了自我认知', '增强了情感表达能力', '发现了内在力量'];
      report.recommendations = ['继续保持自我探索的勇气', '定期进行情感梳理'];
    }
    
    // 跳转到报告页面
    wx.navigateTo({
      url: `/pages/report/report?data=${encodeURIComponent(JSON.stringify(report))}`,
      success: () => {
        // 延迟返回，让用户有时间查看报告
        setTimeout(() => {
          wx.navigateBack();
        }, 500);
      },
      fail: (error) => {
        console.error('跳转报告页面失败:', error);
        wx.showToast({
          title: '生成报告失败',
          icon: 'error'
        });
      }
    });
  },

  onShareAppMessage() {
    return {
      title: `${this.data.chatTitle} - 心理剧本对话`,
      path: `/pages/chat/chat?scriptId=${this.data.scriptId}&scriptTitle=${encodeURIComponent(this.data.chatTitle)}`
    };
  },

  async activateEmpowermentMode() {
    this.setData({ isLoading: true });

    const lastMessage = this.data.messages.filter(m => m.type === 'ai').pop();
    if (!lastMessage) {
      wx.showToast({ title: '需要AI先发言才能开启', icon: 'none' });
      this.setData({ isLoading: false });
      return;
    }

    const prompt = `你现在是一位自信、果断、充满能量的用户。针对AI咨询师刚才说的"${lastMessage.content}"，请生成一句简短、主动、有力量的用户回复。直接给出回复内容，不要任何多余的解释。`;

    try {
      const response = await this.deepSeekClient.sendMessage({ message: prompt, history: [] });
      if (response.success && response.data.message) {
        this.setData({ inputValue: response.data.message });
        await this.sendMessage({ isEmpowered: true });
      } else {
        throw new Error('Failed to generate empowered response');
      }
    } catch (error) {
      const fallbackMessage = "我准备好了，让我们继续吧。";
      this.setData({ inputValue: fallbackMessage });
      await this.sendMessage({ isEmpowered: true });
    }
  },

  /**
   * 打字机效果显示文本
   */
  async showTypewriterText(element, text, speed = 50) {
    return new Promise((resolve) => {
      let index = 0;
      const timer = setInterval(() => {
        if (index < text.length) {
          const currentText = text.slice(0, index + 1);
          this.setData({
            [`${element}`]: currentText
          });
          index++;
        } else {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  },

  /**
   * 添加消息并实现打字机效果
   */
  async addMessageWithTypewriter(message) {
    const messageId = this.data.messageId++;
    const newMessage = {
      id: messageId,
      ...message,
      content: '', // 先设为空，打字机效果会逐字显示
      isTyping: true
    };
    
    // 先添加空消息
    this.setData({
      messages: [...this.data.messages, newMessage]
    });
    
    this.scrollToBottom();
    
    // 使用打字机效果显示内容
    await this.showTypewriterText(`messages[${this.data.messages.length - 1}].content`, message.content);
    
    // 标记打字机效果完成
    this.setData({
      [`messages[${this.data.messages.length - 1}].isTyping`]: false
    });
    
    // 如果是用户消息，检查特殊功能可用性
    if (message.type === 'user') {
      this.checkSpecialFeatures();
    }
    
    // 保存聊天历史（优化存储）
    if (this.data.scriptId) {
      this.storageManager.setChatData(this.data.scriptId, this.data.messages, 'daily');
    }
    
    // Debug: 显示当前消息数量
    console.log('添加消息后，总消息数:', this.data.messages.length);
    console.log('用户消息数:', this.data.messages.filter(m => m.type === 'user').length);
  },

  /**
   * 清除对话记录（测试用）
   */
  clearChat() {
    wx.showModal({
      title: '清除对话',
      content: '确定要清除所有对话记录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除页面数据 - 完整重置
          this.setData({
            messages: [],
            messageId: 0,
            currentChoices: [],
            choices: [], // 确保清除选择卡数据
            choicesPrompt: '',
            choicesEnabled: false, // 重置选择卡状态
            inputValue: '',
            inputMode: 'free',
            allowFreeInput: true,
            userMessageCount: 0,
            sceneSwitchData: null,
            showChoices: false, // 隐藏选择卡显示
            showInput: true,
            conversationState: null // 重置对话状态
          });
          
          // 清除本地存储（优化版本）
          if (this.data.scriptId) {
            this.storageManager.setChatData(this.data.scriptId, [], 'session');
          }
          
          // 清除增强聊天管理器的session数据
          if (this.enhancedChatManager && this.data.sessionKey) {
            try {
              // 重置session状态
              const session = this.enhancedChatManager.sessionData.get(this.data.sessionKey);
              if (session) {
                session.messages = [];
                session.userChoices = [];
                session.currentChoices = [];
                session.conversationHistory = [];
                session.lastChoiceGeneration = null;
                this.enhancedChatManager.sessionData.set(this.data.sessionKey, session);
              }
            } catch (error) {
              console.error('清除session数据失败:', error);
            }
          }
          
          // 重新初始化聊天
          setTimeout(async () => {
            try {
              if (this.enhancedChatManager) {
                await this.initEnhancedChat();
              } else {
                await this.initChat();
              }
              
              // 确保生成新的初始选择卡
              if (this.data.sessionKey && this.enhancedChatManager) {
                const result = await this.enhancedChatManager.generateInitialChoices(
                  this.enhancedChatManager.sessionData.get(this.data.sessionKey)
                );
                if (result && result.choices) {
                  this.setData({
                    choices: result.choices,
                    choicesPrompt: result.prompt || '你想如何开始这个场景？',
                    choicesEnabled: true,
                    showChoices: true
                  });
                }
              } else {
                // 降级到简单选择卡生成
                await this.generateFallbackChoices();
              }
            } catch (error) {
              console.error('重新初始化失败:', error);
              // 确保基本的UI状态正确
              this.setData({
                choicesEnabled: true,
                showChoices: true,
                showInput: true
              });
            }
          }, 100);
          
          wx.showToast({
            title: '对话已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 根据剧本类型配置头像
   */
  getAvatarConfig(scriptData) {
    const avatarMap = {
      'male_lead': {
        // 男主本：AI扮演女性用role1.jpg，用户是男性用role2.jpg
        ai: '/assets/user/role1.jpg',
        user: '/assets/user/role2.jpg'
      },
      'female_lead': {
        // 女主本：AI扮演男性用role2.jpg，用户是女性用role1.jpg  
        ai: '/assets/user/role2.jpg',
        user: '/assets/user/role1.jpg'
      },
      'double_female': {
        // 双女主：AI扮演女性用role3.jpg，用户是女性用role1.jpg
        ai: '/assets/user/role3.jpg',
        user: '/assets/user/role1.jpg'
      },
      'double_male': {
        // 双男主：AI扮演男性用role4.jpg，用户是男性用role2.jpg
        ai: '/assets/user/role4.jpg', 
        user: '/assets/user/role2.jpg'
      }
    };
    
    return avatarMap[scriptData.type] || avatarMap['male_lead'];
  },

  /**
   * 获取剧本数据
   */
  getScriptData(scriptId) {
    // 使用ScriptManager获取真实的剧本数据
    if (this.scriptManager) {
      const script = this.scriptManager.getScript(scriptId);
      if (script) {
        console.log('从ScriptManager获取剧本:', script.title, '场景数量:', script.sceneList.length);
        return script;
      }
    }
    
    console.log('使用fallback剧本数据');
    // fallback数据
    const scripts = {
      'script_001': {
        id: 'script_001',
        title: '未完成的梦',
        type: 'male_lead', // 男主本
        scenario: '夕阳下的湖边，一个关于暗恋与告别的温柔故事',
        character: '她',
        userRole: '男性视角',
        aiRole: '女性角色',
        sceneList: [
          { name: '初次相遇', description: '在某个平凡的午后，他们的目光第一次相遇' },
          { name: '心动时刻', description: '她的一个微笑让他心跳加速，暗恋的种子悄然种下' }
        ]
      },
      'script_002': {
        id: 'script_002', 
        title: '我们现在是什么关系',
        type: 'female_lead', // 女主本
        scenario: '在模糊的关系边界中，探索亲密与承诺的真相',
        description: '这是一个关于模糊关系定义的心理剧。通过真实的情感场景，探索现代人在关系中的困惑与成长。',
        character: '他',
        userRole: '女性视角 - 渴望确定性，心思细腻，容易因细节产生不安',
        aiRole: '男性角色 - 行为矛盾，动机模糊，享受亲密但回避承诺',
        benefits: [
          '探索关系中的边界和期待',
          '理解情感需求的表达方式',
          '学习在模糊关系中保护自己',
          '获得关于自我价值的认知'
        ],
        avatarConfig: {
          ai: '/assets/user/role4.jpg',
          user: '/assets/user/role1.jpg'
        },
        sceneList: [
          { 
            name: '裂痕初显', 
            description: '晚上，你独自刷着手机，回想起一些细节，内心越来越不安。发现他把你们的合照设置了朋友圈权限。',
            aiIntro: '宝贝，睡了吗？今天好累啊，刚加完班。😴'
          },
          { 
            name: '沉默的重量', 
            description: '周五晚上，你们的对话停留在昨天你问的"周末有什么安排吗？"，他还没回复。那种熟悉的焦虑感又缠上来。',
            aiIntro: '刚开完复盘会，这周简直不是人过的！😂 你呢？周末打算干嘛？'
          },
          { 
            name: '直面迷雾', 
            description: '你临时出差到他城市，在咖啡厅看见他和女同事有说有笑。此刻是关系定义的摊牌时刻。',
            aiIntro: '在干嘛呢？刚开完会喘口气~ ☕'
          }
        ]
      }
    };
    
    return scripts[scriptId] || scripts['script_001'];
  },

  /**
   * 显示新场景提示
   */
  async showNewScenePrompt() {
    const { scriptData } = this.data;
    
    // 显示场景介绍消息
    if (scriptData && scriptData.sceneList && scriptData.sceneList.length > 0) {
      const currentSceneIndex = (this.data.sceneProgress?.current || 1) - 1;
      const currentScene = scriptData.sceneList[currentSceneIndex] || scriptData.sceneList[0];
      
      const sceneIntroMessage = {
        type: 'scene_intro',
        content: `📍 场景：${currentScene.name}\n\n${currentScene.description}\n\n${scriptData.scenario || ''}`,
        time: this.getCurrentTime()
      };
      
      await this.addMessageWithTypewriter(sceneIntroMessage);
      await this.delay(1000);
    }
    
    // 确保UI显示正常
    this.setData({
      showInput: true,
      showChoices: true
    });
    
    // 生成初始选择卡
    if (this.enhancedChatManager && this.data.sessionKey) {
      try {
        const result = await this.enhancedChatManager.generateNextChoices(this.data.sessionKey);
        if (result?.choices && result.choices.length > 0) {
          this.setData({
            choices: result.choices,
            choicesPrompt: result.prompt || '你想如何开始这个场景？',
            choicesEnabled: true
          });
        }
      } catch (error) {
        console.error('生成初始选择卡失败:', error);
        await this.generateFallbackChoices();
      }
    } else {
      await this.generateFallbackChoices();
    }
  },

  /**
   * 继续对话
   */
  continueConversation() {
    this.setData({
      showInput: true,
      showChoices: true
    });
  },

  /**
   * 显示场景列表
   */
  showSceneList() {
    // 获取当前剧本的场景列表
    const scriptData = this.data.scriptData;
    if (!scriptData || !scriptData.sceneList) {
      wx.showToast({
        title: '场景数据不存在',
        icon: 'error'
      });
      return;
    }

    // 获取当前场景信息
    const currentSceneIndex = (this.data.sceneProgress?.current || 1) - 1;
    const currentScene = scriptData.sceneList[currentSceneIndex] || scriptData.sceneList[0];

    this.setData({
      showSceneListModal: true,
      scenesList: scriptData.sceneList,
      currentScene: {
        ...currentScene,
        id: currentSceneIndex
      }
    });
  },

  /**
   * 隐藏场景列表
   */
  hideSceneList() {
    this.setData({
      showSceneListModal: false
    });
  },

  /**
   * 阻止事件冒泡
   */
  stopPropagation() {
    // 阻止事件冒泡，防止点击modal内容时关闭modal
  },

  /**
   * 选择场景
   */
  async selectScene(e) {
    const { scene, index } = e.currentTarget.dataset;
    
    if (!scene) return;

    // 检查是否是当前场景
    const currentIndex = (this.data.sceneProgress?.current || 1) - 1;
    if (index === currentIndex) {
      this.hideSceneList();
      return;
    }

    // 显示确认弹窗
    wx.showModal({
      title: '切换场景',
      content: `是否切换到场景：${scene.name}？\n\n${scene.description}`,
      confirmText: '切换',
      cancelText: '取消',
      success: async (res) => {
        if (res.confirm) {
          await this.switchToScene(scene, index);
        }
      }
    });
  },

  /**
   * 切换到指定场景
   */
  async switchToScene(scene, index) {
    // 更新当前场景
    this.setData({
      currentScene: {
        ...scene,
        id: index
      },
      sceneProgress: {
        current: index + 1,
        total: this.data.scenesList.length,
        percentage: ((index + 1) / this.data.scenesList.length) * 100
      }
    });

    // 添加场景切换消息
    const sceneMessage = {
      id: `scene_switch_${this.data.messageId++}`,
      type: 'system_unified',
      content: `📍 切换到场景：${scene.name}\n\n${scene.description}`,
      timestamp: this.getCurrentTime(),
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false })
    };

    this.addMessage(sceneMessage);

    // 关闭场景列表
    this.hideSceneList();

    // 滚动到底部
    this.scrollToBottom();

    // 生成新场景的选择卡
    await this.generateSceneChoices(scene);

    wx.showToast({
      title: '场景切换成功',
      icon: 'success'
    });
  },

  /**
   * 生成新场景的选择卡
   */
  async generateSceneChoices(scene) {
    try {
      // 基于场景生成相关的选择卡
      const choices = [
        {
          id: 'scene_adapt_1',
          text: '仔细观察周围环境',
          title: '环境感知',
          potentialImpact: '了解当前场景的氛围和背景'
        },
        {
          id: 'scene_adapt_2', 
          text: '主动开始对话',
          title: '主动交流',
          potentialImpact: '积极参与到场景互动中'
        },
        {
          id: 'scene_adapt_3',
          text: '等待对方反应',
          title: '观察等待',
          potentialImpact: '让对方先表达想法和感受'
        }
      ];

      this.setData({
        choices: choices,
        showChoices: true,
        choicesPrompt: `在"${scene.name}"这个场景中，你想如何开始？`,
        choicesEnabled: true
      });
    } catch (error) {
      console.error('生成场景选择卡失败:', error);
    }
  }
})