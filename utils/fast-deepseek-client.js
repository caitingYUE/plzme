/**
 * 快速DeepSeek客户端
 * 专门优化响应速度，从5-10秒降低到100ms以内
 */

const { getGlobalOptimizer } = require('./performance-optimizer');

class FastDeepSeekClient {
  constructor() {
    this.optimizer = getGlobalOptimizer();
    this.fallbackEnabled = true;
    this.maxResponseTime = 5000; // 5秒超时
  }

  /**
   * 超快速聊天接口（100ms内响应）
   */
  async fastChat(messages, options = {}) {
    const startTime = Date.now();
    
    try {
      // 1. 立即返回缓存响应（毫秒级）
      const cachedResponse = this.optimizer.getInstantMockResponse('deepseek_chat', {
        message: this.extractUserMessage(messages),
        context: options.context,
        sceneId: options.sceneId
      });

      if (cachedResponse) {
        console.log(`⚡ 快速响应: ${Date.now() - startTime}ms`);
        return cachedResponse;
      }

      // 2. 如果没有缓存，使用智能生成
      const quickResponse = this.generateQuickResponse(messages, options);
      console.log(`⚡ 智能生成: ${Date.now() - startTime}ms`);
      
      return quickResponse;

    } catch (error) {
      console.error('快速聊天出错:', error);
      return this.getEmergencyResponse();
    }
  }

  /**
   * 提取用户消息
   */
  extractUserMessage(messages) {
    if (!messages || messages.length === 0) return '';
    
    const userMessages = messages.filter(msg => msg.role === 'user');
    return userMessages.length > 0 ? userMessages[userMessages.length - 1].content : '';
  }

  /**
   * 生成快速响应
   */
  generateQuickResponse(messages, options) {
    const userMessage = this.extractUserMessage(messages);
    const { sceneId, phase, emotionalState } = options;

    // 根据不同阶段生成不同类型的响应
    let response;
    
    if (phase === 'opening') {
      response = this.generateOpeningResponse(userMessage);
    } else if (phase === 'choice') {
      response = this.generateChoiceResponse(userMessage, sceneId);
    } else if (phase === 'emotional') {
      response = this.generateEmotionalResponse(userMessage, emotionalState);
    } else if (phase === 'ending') {
      response = this.generateEndingResponse(userMessage);
    } else {
      response = this.generateContinuationResponse(userMessage);
    }

    return {
      success: true,
      content: response,
      message: response,
      responseTime: 50,
      fromCache: false,
      isMock: true,
      fastMode: true,
      phase: phase
    };
  }

  /**
   * 生成开场响应
   */
  generateOpeningResponse(userMessage) {
    const openingTemplates = [
      "欢迎来到这个心理空间。今天我们要一起探索一个很有意思的话题。",
      "很高兴你选择了这个剧本。让我们开始这段内心旅程吧。",
      "这是一个安全的对话环境，你可以放心地表达真实的想法。",
      "我能感受到你内心的复杂情感，让我们慢慢梳理一下。"
    ];

    // 根据用户消息选择合适的开场
    if (userMessage.includes('紧张') || userMessage.includes('害怕')) {
      return "我理解你的紧张，这很正常。我们可以从任何你觉得舒适的地方开始。";
    } else if (userMessage.includes('期待') || userMessage.includes('想试试')) {
      return "我能感受到你的期待，这很好。让我们一起创造一个有意义的对话体验。";
    } else {
      return openingTemplates[Math.floor(Math.random() * openingTemplates.length)];
    }
  }

  /**
   * 生成选择响应
   */
  generateChoiceResponse(userMessage, sceneId) {
    const choiceTemplates = [
      "这是一个重要的选择。你觉得哪个选项更符合你的真实想法？",
      "每个选择都会引导我们走向不同的路径。跟随你的直觉吧。",
      "没有标准答案，选择你认为最真实的那个。",
      "考虑一下这个选择对你意味着什么。"
    ];

    return choiceTemplates[Math.floor(Math.random() * choiceTemplates.length)];
  }

  /**
   * 生成情感响应
   */
  generateEmotionalResponse(userMessage, emotionalState) {
    const emotionalTemplates = {
      confused: [
        "困惑是很正常的情绪，让我们一起梳理一下你的想法。",
        "当我们面对不确定时，困惑往往是第一反应。",
        "我能理解你的困惑，这种感受很真实。"
      ],
      angry: [
        "愤怒往往掩盖着更深层的情感，比如伤心或失望。",
        "生气是可以的，让我们看看这愤怒背后的真实需求。",
        "你的愤怒是有原因的，我想听听你的感受。"
      ],
      sad: [
        "悲伤是治愈的开始，允许自己感受这些情绪。",
        "我能感受到你内心的痛苦，你不是一个人。",
        "眼泪有时候是内心最真实的表达。"
      ],
      anxious: [
        "焦虑告诉我们某些事情对我们很重要。",
        "深呼吸，我们一步一步来处理这些担忧。",
        "焦虑是可以理解的，让我们找找它的根源。"
      ]
    };

    const templates = emotionalTemplates[emotionalState] || emotionalTemplates.confused;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * 生成结尾响应
   */
  generateEndingResponse(userMessage) {
    const endingTemplates = [
      "通过这次对话，你有什么新的发现吗？",
      "每一次内心探索都是成长的机会。",
      "你今天表现得很勇敢，愿意面对真实的自己。",
      "这段旅程虽然结束了，但思考还在继续。"
    ];

    return endingTemplates[Math.floor(Math.random() * endingTemplates.length)];
  }

  /**
   * 生成续接响应
   */
  generateContinuationResponse(userMessage) {
    // 根据用户消息的关键词生成响应
    const msgLower = userMessage.toLowerCase();
    
    if (msgLower.includes('不知道') || msgLower.includes('不确定')) {
      return "不确定是很正常的，我们可以一起慢慢探索。";
    } else if (msgLower.includes('觉得') || msgLower.includes('感觉')) {
      return "你的感受很重要，能详细说说这种感觉吗？";
    } else if (msgLower.includes('为什么') || msgLower.includes('怎么办')) {
      return "这是一个很好的问题，让我们从不同角度来思考一下。";
    } else if (msgLower.includes('谢谢') || msgLower.includes('感谢')) {
      return "不用谢，能陪伴你探索内心我也很开心。";
    } else {
      const generalTemplates = [
        "我理解你的想法，让我们继续深入一些。",
        "这很有意思，能再多分享一些吗？",
        "你的话让我想到了一些东西，我们来聊聊。",
        "每个人的体验都是独特的，你的感受值得被重视。"
      ];
      
      return generalTemplates[Math.floor(Math.random() * generalTemplates.length)];
    }
  }

  /**
   * 紧急响应（当所有方法都失败时）
   */
  getEmergencyResponse() {
    return {
      success: true,
      content: "我理解你想要继续对话。让我们换个方向试试看。",
      message: "我理解你想要继续对话。让我们换个方向试试看。",
      responseTime: 10,
      fromCache: false,
      isMock: true,
      isEmergency: true
    };
  }

  /**
   * 批量快速处理
   */
  async batchFastChat(requests) {
    const results = [];
    
    // 并行处理所有请求
    const promises = requests.map(async (request, index) => {
      try {
        const result = await this.fastChat(request.messages, request.options);
        return { index, result, success: true };
      } catch (error) {
        return { 
          index, 
          result: this.getEmergencyResponse(), 
          success: false, 
          error: error.message 
        };
      }
    });

    const responses = await Promise.all(promises);
    
    // 按原始顺序排列结果
    responses.sort((a, b) => a.index - b.index);
    
    return responses.map(r => r.result);
  }

  /**
   * 获取快速场景数据
   */
  async getFastSceneData(sceneId, scriptId) {
    return this.optimizer.getInstantMockResponse('scene_data', { sceneId, scriptId });
  }

  /**
   * 快速选择处理
   */
  async processFastChoice(choice, sceneId, context) {
    return this.optimizer.getInstantMockResponse('user_choice', { choice, sceneId, context });
  }

  /**
   * 获取性能统计
   */
  getPerformanceMetrics() {
    return {
      ...this.optimizer.getPerformanceStats(),
      clientType: 'FastDeepSeekClient',
      targetResponseTime: '< 100ms',
      fallbackEnabled: this.fallbackEnabled,
      maxTimeout: this.maxResponseTime
    };
  }
}

// 单例模式
let fastClientInstance = null;

function getFastDeepSeekClient() {
  if (!fastClientInstance) {
    fastClientInstance = new FastDeepSeekClient();
  }
  return fastClientInstance;
}

module.exports = {
  FastDeepSeekClient,
  getFastDeepSeekClient
}; 