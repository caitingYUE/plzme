/**
 * AI请求缓存管理器
 * 优化DeepSeek API调用，避免重复请求，提升响应速度
 */

const { getGlobalCache } = require('./cache-manager');

class AIRequestCache {
  constructor() {
    this.cache = getGlobalCache();
    this.requestQueue = new Map(); // 防止并发重复请求
    this.debounceTimers = new Map(); // 防抖定时器
    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      apiCalls: 0,
      timesSaved: 0
    };
  }

  /**
   * 生成缓存键值
   */
  _generateCacheKey(messages, options = {}) {
    // 简化消息内容用于生成哈希
    const messageContent = messages.map(msg => ({
      role: msg.role,
      content: msg.content?.substring(0, 200) // 只取前200字符
    }));
    
    const keyData = {
      messages: messageContent,
      temperature: options.temperature || 0.8,
      model: options.model || 'deepseek-chat'
    };
    
    // 生成简单哈希
    const keyString = JSON.stringify(keyData);
    let hash = 0;
    for (let i = 0; i < keyString.length; i++) {
      const char = keyString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转为32位整数
    }
    
    return `ai_request_${Math.abs(hash)}`;
  }

  /**
   * 判断是否可以缓存（排除动态内容）
   */
  _shouldCache(messages) {
    // 检查是否包含时间敏感或个人信息
    const sensitiveKeywords = ['现在时间', '当前时间', '今天', '最新', '实时'];
    const messageText = messages.map(m => m.content || '').join(' ').toLowerCase();
    
    return !sensitiveKeywords.some(keyword => 
      messageText.includes(keyword) || messageText.includes(keyword.toLowerCase())
    );
  }

  /**
   * 获取缓存的AI响应
   */
  async getCachedResponse(messages, options = {}) {
    this.stats.totalRequests++;
    
    if (!this._shouldCache(messages)) {
      return null;
    }

    const cacheKey = this._generateCacheKey(messages, options);
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      this.stats.cacheHits++;
      this.stats.timesSaved += cached.responseTime || 1000; // 估算节省时间
      console.log('✅ AI缓存命中:', cacheKey.substring(0, 20) + '...');
      
      // 添加小幅随机变化，避免完全一致的回复
      if (cached.content && Math.random() < 0.3) {
        cached.content = this._addVariation(cached.content);
      }
      
      return cached;
    }
    
    return null;
  }

  /**
   * 缓存AI响应
   */
  setCachedResponse(messages, options, response, responseTime) {
    if (!this._shouldCache(messages) || !response?.content) {
      return;
    }

    const cacheKey = this._generateCacheKey(messages, options);
    const cacheData = {
      content: response.content,
      message: response.message || response.content,
      timestamp: Date.now(),
      responseTime,
      usage: response.usage || {}
    };
    
    // 根据内容类型设置缓存级别
    const isFrequentContent = this._isFrequentContent(response.content);
    const cacheLevel = isFrequentContent ? 'memory' : 'session';
    
    this.cache.set(cacheKey, cacheData, cacheLevel);
    console.log('💾 AI响应已缓存:', cacheKey.substring(0, 20) + '...');
  }

  /**
   * 防抖处理AI请求
   */
  async debouncedRequest(requestKey, requestFn, delay = 500) {
    return new Promise((resolve, reject) => {
      // 清除已有的定时器
      if (this.debounceTimers.has(requestKey)) {
        clearTimeout(this.debounceTimers.get(requestKey));
      }

      // 设置新的定时器
      const timer = setTimeout(async () => {
        try {
          this.debounceTimers.delete(requestKey);
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);

      this.debounceTimers.set(requestKey, timer);
    });
  }

  /**
   * 防止并发重复请求
   */
  async deduplicateRequest(requestKey, requestFn) {
    // 如果已有相同请求在进行中，等待其完成
    if (this.requestQueue.has(requestKey)) {
      console.log('🔄 等待重复请求完成:', requestKey.substring(0, 20) + '...');
      return await this.requestQueue.get(requestKey);
    }

    // 创建新的请求Promise
    const requestPromise = requestFn().finally(() => {
      this.requestQueue.delete(requestKey);
    });

    this.requestQueue.set(requestKey, requestPromise);
    return await requestPromise;
  }

  /**
   * 添加文本变化（避免完全相同的回复）
   */
  _addVariation(content) {
    const variations = [
      { from: '我理解', to: '我明白' },
      { from: '确实', to: '的确' },
      { from: '那么', to: '这样' },
      { from: '可以', to: '能够' },
      { from: '这个', to: '这种' }
    ];
    
    const randomVariation = variations[Math.floor(Math.random() * variations.length)];
    return content.replace(new RegExp(randomVariation.from, 'g'), randomVariation.to);
  }

  /**
   * 判断是否为常见内容
   */
  _isFrequentContent(content) {
    const frequentPhrases = [
      '我理解你的感受',
      '让我们继续',
      '你想聊什么',
      '我很好，谢谢',
      '确实如此'
    ];
    
    return frequentPhrases.some(phrase => content.includes(phrase));
  }

  /**
   * 预加载常用AI响应
   */
  preloadCommonResponses() {
    const commonScenarios = [
      {
        messages: [{ role: 'user', content: '你好' }],
        response: { content: '你好！很高兴和你交流，有什么想聊的吗？' }
      },
      {
        messages: [{ role: 'user', content: '我感觉有点困惑' }],
        response: { content: '我理解你的困惑。能具体说说是什么让你感到困惑吗？' }
      },
      {
        messages: [{ role: 'user', content: '谢谢' }],
        response: { content: '不用客气，能帮到你我很开心。还有其他需要探讨的吗？' }
      }
    ];

    commonScenarios.forEach(scenario => {
      this.setCachedResponse(scenario.messages, {}, scenario.response, 0);
    });

    console.log('🚀 AI常用响应预加载完成');
  }

  /**
   * 清理过期缓存
   */
  cleanExpiredCache() {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30分钟
    let cleanedCount = 0;

    // 检查会话缓存中的AI响应
    for (const [key, value] of this.cache.sessionCache.entries()) {
      if (key.startsWith('ai_request_') && value.timestamp) {
        if (now - value.timestamp > maxAge) {
          this.cache.delete(key);
          cleanedCount++;
        }
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 清理了 ${cleanedCount} 个过期AI缓存`);
    }
  }

  /**
   * 获取缓存统计
   */
  getStats() {
    const cacheHitRate = this.stats.totalRequests > 0 
      ? (this.stats.cacheHits / this.stats.totalRequests * 100).toFixed(2)
      : '0';

    return {
      ...this.stats,
      cacheHitRate: `${cacheHitRate}%`,
      timesSaved: `${Math.round(this.stats.timesSaved / 1000)}秒`,
      activeRequests: this.requestQueue.size,
      pendingDebounce: this.debounceTimers.size
    };
  }

  /**
   * 重置统计
   */
  resetStats() {
    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      apiCalls: 0,
      timesSaved: 0
    };
  }
}

// 全局AI请求缓存实例
let globalAICache = null;

/**
 * 获取全局AI缓存实例
 */
function getGlobalAICache() {
  if (!globalAICache) {
    globalAICache = new AIRequestCache();
    // 预加载常用响应
    globalAICache.preloadCommonResponses();
    
    // 定期清理过期缓存
    setInterval(() => {
      globalAICache.cleanExpiredCache();
    }, 10 * 60 * 1000); // 每10分钟清理一次
  }
  return globalAICache;
}

module.exports = {
  AIRequestCache,
  getGlobalAICache
}; 