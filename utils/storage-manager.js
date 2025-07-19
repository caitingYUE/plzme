/**
 * LocalStorage 优化管理器
 * 提供智能存储、数据压缩、批量操作和缓存策略
 */

const { getGlobalCache } = require('./cache-manager');

class StorageManager {
  constructor() {
    this.cache = getGlobalCache();
    this.pendingWrites = new Map(); // 待写入队列
    this.writeTimeout = null;
    this.batchInterval = 1000; // 1秒批量写入
    this.compressionThreshold = 1024; // 1KB以上数据压缩
    
    // 存储键命名空间
    this.namespaces = {
      user: 'user_',
      script: 'script_',
      chat: 'chat_',
      app: 'app_',
      cache: 'cache_'
    };
    
    // 过期时间配置（毫秒）
    this.expiration = {
      session: 24 * 60 * 60 * 1000,      // 24小时
      daily: 7 * 24 * 60 * 60 * 1000,    // 7天
      weekly: 30 * 24 * 60 * 60 * 1000,  // 30天
      permanent: 0                        // 不过期
    };

    this.stats = {
      reads: 0,
      writes: 0,
      cacheHits: 0,
      compressions: 0,
      decompressions: 0,
      cleanups: 0
    };

    // 初始化时清理过期数据
    this.cleanExpiredData();
    
    // 定期清理
    setInterval(() => {
      this.cleanExpiredData();
    }, 10 * 60 * 1000); // 每10分钟清理一次
  }

  /**
   * 智能获取数据（带缓存）
   */
  get(key, useCache = true) {
    this.stats.reads++;
    
    // 1. 先从内存缓存获取
    if (useCache) {
      const cacheKey = `storage_${key}`;
      const cached = this.cache.get(cacheKey);
      if (cached !== null) {
        this.stats.cacheHits++;
        return cached;
      }
    }

    try {
      // 2. 从localStorage获取
      const rawData = wx.getStorageSync(key);
      if (!rawData) {
        return null;
      }

      let data;
      
      // 3. 检查是否是包装的数据（带过期时间）
      if (typeof rawData === 'object' && rawData._storage_meta) {
        const { value, expiry, compressed } = rawData;
        
        // 检查是否过期
        if (expiry && Date.now() > expiry) {
          this.remove(key);
          return null;
        }
        
        // 解压缩
        if (compressed) {
          data = this._decompress(value);
          this.stats.decompressions++;
        } else {
          data = value;
        }
      } else {
        // 兼容旧数据格式
        data = rawData;
      }

      // 4. 缓存到内存
      if (useCache) {
        const cacheKey = `storage_${key}`;
        this.cache.set(cacheKey, data, 'memory');
      }

      return data;
    } catch (error) {
      console.error('Storage read error:', error);
      return null;
    }
  }

  /**
   * 智能设置数据（批量写入、压缩）
   */
  set(key, value, expirationType = 'session', immediate = false) {
    this.stats.writes++;
    
    // 1. 更新内存缓存
    const cacheKey = `storage_${key}`;
    this.cache.set(cacheKey, value, 'memory');

    // 2. 准备存储数据
    const wrappedData = this._wrapData(value, expirationType);
    
    if (immediate) {
      // 立即写入
      this._writeToStorage(key, wrappedData);
    } else {
      // 加入批量写入队列
      this.pendingWrites.set(key, wrappedData);
      this._scheduleBatchWrite();
    }
  }

  /**
   * 批量设置数据
   */
  setBatch(dataMap, expirationType = 'session') {
    Object.entries(dataMap).forEach(([key, value]) => {
      const cacheKey = `storage_${key}`;
      this.cache.set(cacheKey, value, 'memory');
      
      const wrappedData = this._wrapData(value, expirationType);
      this.pendingWrites.set(key, wrappedData);
    });
    
    this._scheduleBatchWrite();
  }

  /**
   * 删除数据
   */
  remove(key) {
    // 从缓存删除
    const cacheKey = `storage_${key}`;
    this.cache.delete(cacheKey);
    
    // 从localStorage删除
    try {
      wx.removeStorageSync(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
    
    // 从待写入队列删除
    this.pendingWrites.delete(key);
  }

  /**
   * 清空命名空间
   */
  clearNamespace(namespace) {
    const prefix = this.namespaces[namespace] || namespace + '_';
    
    try {
      const info = wx.getStorageInfoSync();
      const keysToRemove = info.keys.filter(key => key.startsWith(prefix));
      
      keysToRemove.forEach(key => {
        this.remove(key);
      });
      
      console.log(`清理命名空间 ${namespace}: ${keysToRemove.length} 个键`);
    } catch (error) {
      console.error('Clear namespace error:', error);
    }
  }

  /**
   * 用户数据专用方法
   */
  setUserData(key, value, expirationType = 'weekly') {
    const fullKey = this.namespaces.user + key;
    this.set(fullKey, value, expirationType);
  }

  getUserData(key) {
    const fullKey = this.namespaces.user + key;
    return this.get(fullKey);
  }

  /**
   * 聊天数据专用方法
   */
  setChatData(sessionId, messages, expirationType = 'daily') {
    const fullKey = this.namespaces.chat + sessionId;
    this.set(fullKey, messages, expirationType);
  }

  getChatData(sessionId) {
    const fullKey = this.namespaces.chat + sessionId;
    return this.get(fullKey);
  }

  /**
   * 应用配置专用方法
   */
  setAppConfig(key, value) {
    const fullKey = this.namespaces.app + key;
    this.set(fullKey, value, 'permanent', true); // 立即写入
  }

  getAppConfig(key) {
    const fullKey = this.namespaces.app + key;
    return this.get(fullKey);
  }

  /**
   * 包装数据（添加元信息）
   */
  _wrapData(value, expirationType) {
    const expiry = this.expiration[expirationType] 
      ? Date.now() + this.expiration[expirationType]
      : 0;

    const serialized = JSON.stringify(value);
    let compressed = false;
    let finalValue = value;

    // 大数据压缩
    if (serialized.length > this.compressionThreshold) {
      finalValue = this._compress(value);
      compressed = true;
      this.stats.compressions++;
    }

    return {
      _storage_meta: true,
      value: finalValue,
      expiry,
      compressed,
      timestamp: Date.now()
    };
  }

  /**
   * 简单压缩（移除空格和缩短字段名）
   */
  _compress(data) {
    const jsonString = JSON.stringify(data);
    
    // 简单的字符串压缩：移除不必要的空格和缩短常见字段
    return jsonString
      .replace(/\s+/g, ' ')
      .replace(/"timestamp"/g, '"ts"')
      .replace(/"content"/g, '"c"')
      .replace(/"message"/g, '"m"')
      .replace(/"avatar"/g, '"av"')
      .replace(/"type"/g, '"t"');
  }

  /**
   * 解压缩
   */
  _decompress(compressedData) {
    try {
      // 恢复字段名
      const restored = compressedData
        .replace(/"ts"/g, '"timestamp"')
        .replace(/"c"/g, '"content"')
        .replace(/"m"/g, '"message"')
        .replace(/"av"/g, '"avatar"')
        .replace(/"t"/g, '"type"');
      
      return JSON.parse(restored);
    } catch (error) {
      console.error('Decompression error:', error);
      return compressedData; // 返回原始数据
    }
  }

  /**
   * 安排批量写入
   */
  _scheduleBatchWrite() {
    if (this.writeTimeout) {
      clearTimeout(this.writeTimeout);
    }

    this.writeTimeout = setTimeout(() => {
      this._executeBatchWrite();
    }, this.batchInterval);
  }

  /**
   * 执行批量写入
   */
  _executeBatchWrite() {
    if (this.pendingWrites.size === 0) {
      return;
    }

    const writes = Array.from(this.pendingWrites.entries());
    this.pendingWrites.clear();

    console.log(`📦 执行批量写入: ${writes.length} 个项目`);

    writes.forEach(([key, data]) => {
      this._writeToStorage(key, data);
    });
  }

  /**
   * 实际写入存储
   */
  _writeToStorage(key, data) {
    try {
      wx.setStorageSync(key, data);
    } catch (error) {
      console.error('Storage write error:', error);
      
      // 如果写入失败，尝试清理空间后重试
      if (error.errMsg && error.errMsg.includes('exceed')) {
        this._emergencyCleanup();
        try {
          wx.setStorageSync(key, data);
        } catch (retryError) {
          console.error('Storage retry write error:', retryError);
        }
      }
    }
  }

  /**
   * 清理过期数据
   */
  cleanExpiredData() {
    const now = Date.now();
    let cleanedCount = 0;

    try {
      const info = wx.getStorageInfoSync();
      
      info.keys.forEach(key => {
        try {
          const data = wx.getStorageSync(key);
          if (data && typeof data === 'object' && data._storage_meta) {
            if (data.expiry && now > data.expiry) {
              wx.removeStorageSync(key);
              // 也从缓存中删除
              const cacheKey = `storage_${key}`;
              this.cache.delete(cacheKey);
              cleanedCount++;
            }
          }
        } catch (error) {
          // 忽略单个键的错误
        }
      });

      if (cleanedCount > 0) {
        console.log(`🧹 清理过期数据: ${cleanedCount} 个项目`);
        this.stats.cleanups += cleanedCount;
      }
    } catch (error) {
      console.error('Clean expired data error:', error);
    }
  }

  /**
   * 紧急清理（存储空间不足时）
   */
  _emergencyCleanup() {
    console.log('🚨 执行紧急存储清理');
    
    // 1. 先清理过期数据
    this.cleanExpiredData();
    
    // 2. 清理缓存命名空间的数据
    this.clearNamespace('cache');
    
    // 3. 清理旧的聊天记录（超过7天）
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    this._cleanOldData(this.namespaces.chat, weekAgo);
  }

  /**
   * 清理指定时间之前的数据
   */
  _cleanOldData(prefix, beforeTime) {
    try {
      const info = wx.getStorageInfoSync();
      const keysToCheck = info.keys.filter(key => key.startsWith(prefix));
      
      let cleanedCount = 0;
      keysToCheck.forEach(key => {
        try {
          const data = wx.getStorageSync(key);
          if (data && data._storage_meta && data.timestamp < beforeTime) {
            wx.removeStorageSync(key);
            const cacheKey = `storage_${key}`;
            this.cache.delete(cacheKey);
            cleanedCount++;
          }
        } catch (error) {
          // 忽略错误
        }
      });
      
      if (cleanedCount > 0) {
        console.log(`清理旧数据 ${prefix}: ${cleanedCount} 个项目`);
      }
    } catch (error) {
      console.error('Clean old data error:', error);
    }
  }

  /**
   * 强制刷新（立即执行所有待写入操作）
   */
  flush() {
    if (this.writeTimeout) {
      clearTimeout(this.writeTimeout);
      this.writeTimeout = null;
    }
    this._executeBatchWrite();
  }

  /**
   * 获取存储统计信息
   */
  getStats() {
    try {
      const info = wx.getStorageInfoSync();
      const cacheStats = this.cache.getStats();
      
      return {
        storage: {
          keys: info.keys.length,
          currentSize: `${(info.currentSize || 0)}KB`,
          limitSize: `${(info.limitSize || 10240)}KB`,
          usage: info.limitSize ? `${((info.currentSize / info.limitSize) * 100).toFixed(1)}%` : 'N/A'
        },
        cache: cacheStats,
        operations: this.stats,
        pending: this.pendingWrites.size
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}

// 全局存储管理器实例
let globalStorageManager = null;

/**
 * 获取全局存储管理器实例
 */
function getGlobalStorageManager() {
  if (!globalStorageManager) {
    globalStorageManager = new StorageManager();
  }
  return globalStorageManager;
}

module.exports = {
  StorageManager,
  getGlobalStorageManager
}; 