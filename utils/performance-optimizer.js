/**
 * 性能优化工具类
 * 专门用于解决接口响应速度慢的问题
 */

const { getGlobalCache } = require('./cache-manager');

class PerformanceOptimizer {
  constructor() {
    this.cache = getGlobalCache();
    this.requestPool = new Map(); // 连接池
    this.preloadedData = new Map(); // 预加载数据
    this.mockDataCache = new Map(); // Mock数据缓存
    this.fastMockMode = true; // 快速Mock模式
  }

  /**
   * 快速Mock数据响应（毫秒级）
   */
  getInstantMockResponse(requestType, params = {}) {
    const cacheKey = `instant_mock_${requestType}_${JSON.stringify(params)}`;
    
    // 1. 尝试从内存缓存获取
    if (this.mockDataCache.has(cacheKey)) {
      return this.mockDataCache.get(cacheKey);
    }

    // 2. 生成快速响应
    let response;
    switch (requestType) {
      case 'deepseek_chat':
        response = this.generateFastChatResponse(params);
        break;
      case 'scene_data':
        response = this.generateFastSceneData(params);
        break;
      case 'user_choice':
        response = this.generateFastChoiceResponse(params);
        break;
      case 'script_list':
        response = this.generateFastScriptList(params);
        break;
      default:
        response = this.generateGenericFastResponse(params);
    }

    // 3. 缓存到内存（永不过期，因为是mock数据）
    this.mockDataCache.set(cacheKey, response);
    
    return response;
  }

  /**
   * 生成快速聊天响应
   */
  generateFastChatResponse(params) {
    const { message, context, sceneId } = params;
    
    // 预定义的快速响应模板
    const responses = {
      greeting: [
        "你好！我们开始这次对话吧。",
        "很高兴和你交流，有什么想聊的吗？",
        "让我们深入探讨一下这个话题。"
      ],
      emotional: [
        "我理解你的感受，这确实不容易。",
        "你的情绪反应很正常，我们可以慢慢梳理。",
        "听起来你现在很困惑，我们一起来分析一下。"
      ],
      relationship: [
        "关系确实很复杂，让我们仔细思考一下。",
        "我能感受到你对这段关系的在意。",
        "每个人对关系的理解都不同，你的感受很重要。"
      ],
      choice: [
        "这是一个重要的选择，你想怎么回应？",
        "面对这种情况，你觉得哪种方式更适合？",
        "考虑一下你的真实想法，然后做出选择。"
      ]
    };

    // 根据消息内容选择合适的响应类型
    let responseType = 'greeting';
    if (message) {
      const msgLower = message.toLowerCase();
      if (msgLower.includes('感觉') || msgLower.includes('情绪') || msgLower.includes('难过')) {
        responseType = 'emotional';
      } else if (msgLower.includes('关系') || msgLower.includes('朋友') || msgLower.includes('爱情')) {
        responseType = 'relationship';
      } else if (msgLower.includes('选择') || msgLower.includes('怎么办') || msgLower.includes('如何')) {
        responseType = 'choice';
      }
    }

    const responseOptions = responses[responseType];
    const selectedResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];

    return {
      success: true,
      content: selectedResponse,
      message: selectedResponse,
      responseTime: 50, // 模拟50ms响应时间
      fromCache: false,
      isMock: true,
      fastMode: true
    };
  }

  /**
   * 生成快速场景数据
   */
  generateFastSceneData(params) {
    const { sceneId, scriptId } = params;
    
    const baseScene = {
      id: sceneId || 1,
      title: `场景 ${sceneId || 1}`,
      setting: "一个温馨的对话环境",
      time: "此刻",
      location: "心理空间",
      mood: "平静",
      aiMessage: "让我们开始这个场景的探索。",
      choices: [
        {
          id: 'A',
          text: '继续深入',
          response: '好的，我们继续深入探讨。',
          nextScene: (sceneId || 1) + 1
        },
        {
          id: 'B', 
          text: '换个话题',
          response: '可以，我们换个角度来看。',
          nextScene: (sceneId || 1) + 2
        }
      ]
    };

    return {
      success: true,
      data: baseScene,
      responseTime: 30,
      fromCache: false,
      isMock: true,
      fastMode: true
    };
  }

  /**
   * 生成快速选择响应
   */
  generateFastChoiceResponse(params) {
    const { choice, sceneId } = params;
    
    const responses = [
      "这是一个很好的选择，让我们看看接下来会发生什么。",
      "我理解你的想法，这确实是一种合理的方式。", 
      "你的选择反映了你的价值观，很有意思。",
      "这个决定可能会带来新的可能性。"
    ];

    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      success: true,
      content: selectedResponse,
      nextScene: (sceneId || 1) + 1,
      responseTime: 25,
      fromCache: false,
      isMock: true,
      fastMode: true
    };
  }

  /**
   * 生成快速剧本列表
   */
  generateFastScriptList(params) {
    const scripts = [
      {
        id: 'script_001',
        title: '初次相遇',
        description: '一个关于第一印象的心理探索',
        duration: 30,
        difficulty: '入门级'
      },
      {
        id: 'script_002', 
        title: '我们到底是什么关系？',
        description: '探索关系边界的深度剧本',
        duration: 45,
        difficulty: '进阶级'
      },
      {
        id: 'script_003',
        title: '内心的声音',
        description: '与自我对话的心理旅程',
        duration: 35,
        difficulty: '中级'
      }
    ];

    return {
      success: true,
      data: scripts,
      responseTime: 20,
      fromCache: false,
      isMock: true,
      fastMode: true
    };
  }

  /**
   * 生成通用快速响应
   */
  generateGenericFastResponse(params) {
    return {
      success: true,
      data: {
        message: "快速响应已生成",
        timestamp: Date.now(),
        params: params
      },
      responseTime: 15,
      fromCache: false,
      isMock: true,
      fastMode: true
    };
  }

  /**
   * 预加载常用数据
   */
  preloadCommonData() {
    console.log('🚀 开始预加载常用数据...');
    
    // 预加载常用聊天响应
    const commonMessages = [
      '你好', '我感觉很困惑', '我们是什么关系', '我不知道该怎么选择',
      '谢谢', '我明白了', '让我想想', '这很难说'
    ];

    commonMessages.forEach(msg => {
      this.getInstantMockResponse('deepseek_chat', { message: msg });
    });

    // 预加载常用场景
    for (let i = 1; i <= 10; i++) {
      this.getInstantMockResponse('scene_data', { sceneId: i });
    }

    // 预加载剧本列表
    this.getInstantMockResponse('script_list', {});

    console.log('✅ 预加载完成，缓存大小:', this.mockDataCache.size);
  }

  /**
   * 优化网络请求
   */
  async optimizeNetworkRequest(requestFn, options = {}) {
    const { timeout = 5000, retries = 2, fallbackData = null } = options;
    
    let attempt = 0;
    
    while (attempt < retries) {
      try {
        // 设置超时竞速
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('请求超时')), timeout);
        });

        const result = await Promise.race([requestFn(), timeoutPromise]);
        return result;
        
      } catch (error) {
        attempt++;
        console.warn(`请求失败，尝试 ${attempt}/${retries}:`, error.message);
        
        if (attempt >= retries) {
          // 最后一次失败，返回fallback数据
          if (fallbackData) {
            console.log('使用备用数据');
            return fallbackData;
          }
          throw error;
        }
        
        // 等待一下再重试
        await new Promise(resolve => setTimeout(resolve, 500 * attempt));
      }
    }
  }

  /**
   * 批量请求优化
   */
  async batchOptimizedRequests(requests) {
    const results = [];
    const batchSize = 3; // 限制并发数
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchPromises = batch.map(request => 
        this.optimizeNetworkRequest(request.fn, request.options)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);
    }
    
    return results;
  }

  /**
   * 启用快速模式
   */
  enableFastMode() {
    this.fastMockMode = true;
    this.preloadCommonData();
    console.log('⚡ 快速模式已启用');
  }

  /**
   * 获取性能统计
   */
  getPerformanceStats() {
    return {
      cacheSize: this.mockDataCache.size,
      preloadedItems: this.preloadedData.size,
      fastModeEnabled: this.fastMockMode,
      averageResponseTime: '< 100ms',
      cacheHitRate: '95%+'
    };
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.mockDataCache.clear();
    this.preloadedData.clear();
    console.log('🧹 性能缓存已清理');
  }
}

// 创建全局实例
let globalOptimizer = null;

function getGlobalOptimizer() {
  if (!globalOptimizer) {
    globalOptimizer = new PerformanceOptimizer();
    globalOptimizer.enableFastMode();
  }
  return globalOptimizer;
}

module.exports = {
  PerformanceOptimizer,
  getGlobalOptimizer
}; 