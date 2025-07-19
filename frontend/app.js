App({
  globalData: {
    userInfo: null,
    token: null,
    apiURL: 'http://127.0.0.1:5001',  // 更新为新端口
    version: '1.0.0',
    
    // DeepSeek API配置
    deepSeekApiKey: 'sk-cf7a0273c7c3461fb7b5eb520b2ffb54', // 请在这里填入你的DeepSeek API密钥
    
    // 当前对话相关
    currentConversation: null,
    energyBoostActive: false,
    
    // 用户偏好
    theme: 'dark',
    language: 'zh'
  },

  onLaunch() {
    // 清理可能的样式缓存问题
    this.clearStyleCache();
    
    // 初始化应用
    console.log('PlzMe 小程序启动');
    this.initApp();
    
    // 版本更新检查
    this.updateManager = wx.getUpdateManager();
    this.updateManager.onCheckForUpdate((res) => {
      console.log('检查更新结果:', res.hasUpdate);
    });

    this.updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: (res) => {
          if (res.confirm) {
            this.updateManager.applyUpdate();
          }
        }
      });
    });

    this.updateManager.onUpdateFailed(() => {
      console.log('新版本下载失败');
    });

    // 获取设备信息
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res;
        console.log('设备信息:', res);
      }
    });

    // 检查授权状态
    this.checkAuthorization();
  },

  /**
   * 清理样式缓存，解决紫色背景问题
   */
  clearStyleCache() {
    try {
      // 强制清理页面样式缓存
      console.log('🧹 开始清理样式缓存...');
      
      // 强制重新应用白色背景
      setTimeout(() => {
        const pages = getCurrentPages();
        if (pages.length > 0) {
          const currentPage = pages[pages.length - 1];
          if (currentPage.setData) {
            currentPage.setData({
              '_forceWhiteBg': true
            });
          }
        }
      }, 100);
      
      console.log('✅ 样式缓存清理完成');
    } catch (error) {
      console.error('清理样式缓存失败:', error);
    }
  },

  async initApp() {
    try {
      // 检查登录状态
      await this.checkAuth();
      
      // 初始化配置
      await this.loadSystemConfig();
      
      // 检查版本更新
      this.checkForUpdates();
    } catch (error) {
      console.error('应用初始化失败:', error);
    }
  },

  async checkAuth() {
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      try {
        // 验证token有效性
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
          this.globalData.userInfo = userInfo;
        }
      } catch (error) {
        console.log('Token验证失败，清除本地数据');
        wx.removeStorageSync('token');
        wx.removeStorageSync('userInfo');
        this.globalData.token = null;
        this.globalData.userInfo = null;
      }
    }
  },

  async loadSystemConfig() {
    try {
      // 从本地存储加载用户配置
      const theme = wx.getStorageSync('theme') || 'dark';
      const language = wx.getStorageSync('language') || 'zh';
      
      this.globalData.theme = theme;
      this.globalData.language = language;
    } catch (error) {
      console.error('加载系统配置失败:', error);
    }
  },

  checkForUpdates() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          console.log('发现新版本');
        }
      });

      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });

      updateManager.onUpdateFailed(() => {
        console.error('新版本下载失败');
      });
    }
  },

  // 用户登录
  async login(userInfo) {
    this.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);
    
    if (userInfo.token) {
      this.globalData.token = userInfo.token;
      wx.setStorageSync('token', userInfo.token);
    }
  },

  // 用户登出
  logout() {
    this.globalData.userInfo = null;
    this.globalData.token = null;
    this.globalData.currentConversation = null;
    
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('token');
    
    // 跳转到首页
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  // 获取用户信息
  getUserInfo() {
    return this.globalData.userInfo;
  },

  // 检查是否登录
  isLoggedIn() {
    return !!(this.globalData.userInfo && this.globalData.token);
  },

  /**
   * 检查授权状态
   */
  checkAuthorization() {
    // 检查用户授权状态
    wx.getSetting({
      success: (res) => {
        console.log('用户授权状态:', res.authSetting);
      }
    });
  }
}); 