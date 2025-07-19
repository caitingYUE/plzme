/**
 * 缓存管理器
 * 提供多级缓存机制，优化内存使用和数据访问性能
 */

class CacheManager {
  constructor() {
    // L1: 内存缓存 (热数据) - 最近访问的数据
    this.memoryCache = new Map();
    this.memoryCacheMaxSize = 50; // 最大缓存50个对象
    
    // L2: 会话缓存 (温数据) - 本次会话期间的数据
    this.sessionCache = new Map();
    
    // 访问时间记录，用于LRU淘汰
    this.accessTimes = new Map();
    
    // 缓存统计
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
  }

  /**
   * 获取缓存数据
   */
  get(key) {
    // 先检查内存缓存
    if (this.memoryCache.has(key)) {
      this.accessTimes.set(key, Date.now());
      this.stats.hits++;
      return this.memoryCache.get(key);
    }

    // 再检查会话缓存
    if (this.sessionCache.has(key)) {
      const data = this.sessionCache.get(key);
      // 提升到内存缓存
      this.set(key, data, 'memory');
      this.stats.hits++;
      return data;
    }

    this.stats.misses++;
    return null;
  }

  /**
   * 设置缓存数据
   */
  set(key, value, level = 'memory') {
    if (level === 'memory') {
      // 检查是否需要淘汰旧数据
      if (this.memoryCache.size >= this.memoryCacheMaxSize) {
        this._evictLRU();
      }
      
      this.memoryCache.set(key, value);
      this.accessTimes.set(key, Date.now());
    } else if (level === 'session') {
      this.sessionCache.set(key, value);
    }
  }

  /**
   * 删除缓存
   */
  delete(key) {
    this.memoryCache.delete(key);
    this.sessionCache.delete(key);
    this.accessTimes.delete(key);
  }

  /**
   * 清空缓存
   */
  clear(level = 'all') {
    if (level === 'all' || level === 'memory') {
      this.memoryCache.clear();
      this.accessTimes.clear();
    }
    if (level === 'all' || level === 'session') {
      this.sessionCache.clear();
    }
  }

  /**
   * LRU淘汰最少使用的缓存
   */
  _evictLRU() {
    let oldestKey = null;
    let oldestTime = Date.now();

    for (const [key, time] of this.accessTimes) {
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.memoryCache.delete(oldestKey);
      this.accessTimes.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0 
      ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2)
      : 0;

    return {
      ...this.stats,
      hitRate: `${hitRate}%`,
      memorySize: this.memoryCache.size,
      sessionSize: this.sessionCache.size
    };
  }

  /**
   * 预加载数据到缓存
   */
  preload(key, loader, level = 'session') {
    if (!this.get(key)) {
      const data = loader();
      this.set(key, data, level);
      return data;
    }
    return this.get(key);
  }
}

// 全局缓存实例
let globalCacheInstance = null;

/**
 * 获取全局缓存实例
 */
function getGlobalCache() {
  if (!globalCacheInstance) {
    globalCacheInstance = new CacheManager();
  }
  return globalCacheInstance;
}

module.exports = {
  CacheManager,
  getGlobalCache
}; 