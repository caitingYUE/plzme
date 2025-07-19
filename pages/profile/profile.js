// pages/profile/profile.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    userInfo: null,
    isLoggedIn: false,
    defaultAvatar: '/assets/user/role1.jpg', // 女性默认头像
    
    // 用户统计
    userStats: {
      scriptsPlayed: 0,
      growthDays: 0,
      insights: 0
    },
    
    // 功能数据
    favoriteCount: 0,
    reportCount: 0,
    customScriptCount: 0,
    
    // 高能女主模式
    energyModeActive: false,
    showEnergyModal: false,
    energyModeCount: 0, // 剩余次数
    
    // 成长足迹
    recentGrowth: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('我的页面加载');
    this.initPage();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('我的页面准备就绪');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示时刷新数据
    this.checkLoginStatus();
    this.loadUserData();
    // 单独更新自定义剧本数量
    this.loadCustomScriptCount();
    // 设置TabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('我的页面隐藏');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log('我的页面卸载');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.refreshData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '发现内心的力量',
      desc: '在PlzMe找到属于你的成长之路',
      path: '/pages/index/index'
    };
  },

  onShareTimeline() {
    return {
      title: 'PlzMe - 我是我的人生主角',
      query: ''
    };
  },

  async initPage() {
    try {
      await this.loadUserData();
    } catch (error) {
      console.error('页面初始化失败:', error);
    }
  },

  async refreshData() {
    try {
      await this.loadUserData();
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    } catch (error) {
      wx.showToast({
        title: '刷新失败',
        icon: 'none'
      });
    } finally {
      wx.stopPullDownRefresh();
    }
  },

  checkLoginStatus() {
    const userInfo = app.getUserInfo();
    const isLoggedIn = app.isLoggedIn();
    
    this.setData({
      userInfo,
      isLoggedIn
    });

    // 检查高能模式状态
    const energyModeActive = app.globalData.energyBoostActive;
    const energyModeCount = wx.getStorageSync('energyModeCount') || 0;
    
    this.setData({
      energyModeActive,
      energyModeCount
    });
  },

  async loadUserData() {
    if (!this.data.isLoggedIn) return;
    
    try {
      // 并行加载数据
      await Promise.all([
        this.loadUserStats(),
        this.loadFavoriteCount(),
        this.loadReportCount(),
        this.loadCustomScriptCount(),
        this.loadRecentGrowth()
      ]);
    } catch (error) {
      console.error('加载用户数据失败:', error);
    }
  },

  async loadUserStats() {
    try {
      // 模拟API调用 - 后续替换为真实API
      const stats = await this.getUserStats();
      this.setData({
        userStats: stats
      });
    } catch (error) {
      console.error('加载用户统计失败:', error);
    }
  },

  async loadFavoriteCount() {
    try {
      const count = await this.getFavoriteCount();
      this.setData({
        favoriteCount: count
      });
    } catch (error) {
      console.error('加载收藏数量失败:', error);
    }
  },

  async loadReportCount() {
    try {
      const count = await this.getReportCount();
      this.setData({
        reportCount: count
      });
    } catch (error) {
      console.error('加载报告数量失败:', error);
    }
  },

  async loadCustomScriptCount() {
    try {
      const count = await this.getCustomScriptCount();
      this.setData({
        customScriptCount: count
      });
    } catch (error) {
      console.error('加载自定义剧本数量失败:', error);
    }
  },

  async loadRecentGrowth() {
    try {
      const growth = await this.getRecentGrowth();
      this.setData({
        recentGrowth: growth
      });
    } catch (error) {
      console.error('加载成长足迹失败:', error);
    }
  },

  // 高能女主模式
  activateEnergyMode() {
    if (!this.checkAuth()) return;
    
    wx.vibrateShort(); // 触觉反馈
    
    if (this.data.energyModeActive) {
      wx.showToast({
        title: `高能模式已激活，剩余${this.data.energyModeCount}次`,
        icon: 'none'
      });
      return;
    }
    
    this.setData({
      showEnergyModal: true
    });
  },

  confirmEnergyMode() {
    // 激活高能模式
    app.globalData.energyBoostActive = true;
    const energyCount = 10; // 10次对话
    
    wx.setStorageSync('energyModeCount', energyCount);
    wx.setStorageSync('energyModeStartTime', Date.now());
    
    this.setData({
      energyModeActive: true,
      energyModeCount: energyCount,
      showEnergyModal: false
    });
    
    wx.showToast({
      title: '高能女主模式已激活！',
      icon: 'success'
    });
    
    // 自动跳转到聊天页面
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/chat/chat?energyMode=true'
      });
    }, 1000);
  },

  hideEnergyModal() {
    this.setData({
      showEnergyModal: false
    });
  },

  preventClose() {
    // 阻止事件冒泡
  },

  // 页面跳转方法
  goToLogin() {
    wx.navigateTo({
      url: '/pages/auth/login'
    });
  },

  goToCustomScripts() {
    wx.navigateTo({
      url: '/pages/custom-scripts/custom-scripts'
    });
  },

  goToFavorites() {
    if (!this.checkAuth()) return;
    
    wx.navigateTo({
      url: '/pages/favorites/favorites'
    });
  },

  goToHistory() {
    if (!this.checkAuth()) return;
    
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  goToReports() {
    if (!this.checkAuth()) return;
    
    wx.navigateTo({
      url: '/pages/report/report'
    });
  },



  goToSettings() {
    wx.navigateTo({
      url: '/pages/settings/settings'
    });
  },

  goToHelp() {
    wx.navigateTo({
      url: '/pages/help/help'
    });
  },

  goToAbout() {
    wx.navigateTo({
      url: '/pages/about/about'
    });
  },

  viewAllGrowth() {
    if (!this.checkAuth()) return;
    
    wx.navigateTo({
      url: '/pages/growth/growth'
    });
  },

  // 权限检查
  checkAuth() {
    if (!app.isLoggedIn()) {
      wx.showModal({
        title: '需要登录',
        content: '请先登录才能使用此功能',
        confirmText: '去登录',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.goToLogin();
          }
        }
      });
      return false;
    }
    return true;
  },

  // 模拟API调用方法
  async getUserStats() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          scriptsPlayed: Math.floor(Math.random() * 50) + 10,
          growthDays: Math.floor(Math.random() * 365) + 30,
          insights: Math.floor(Math.random() * 100) + 20
        });
      }, 300);
    });
  },

  async getFavoriteCount() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.floor(Math.random() * 20) + 5);
      }, 200);
    });
  },

  async getReportCount() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.floor(Math.random() * 10) + 2);
      }, 200);
    });
  },

  async getCustomScriptCount() {
    try {
      const customScripts = wx.getStorageSync('customScripts') || [];
      return customScripts.length;
    } catch (error) {
      console.error('获取自定义剧本数量失败:', error);
      return 0;
    }
  },

  async getRecentGrowth() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockGrowth = [
          {
            id: 1,
            title: '完成《未完成的梦》剧本',
            description: '通过角色体验，更好地理解了内心的遗憾与成长',
            timeAgo: '2小时前'
          },
          {
            id: 2,
            title: '生成关系洞察报告',
            description: '分析了与朋友的关系模式，发现了新的相处方式',
            timeAgo: '1天前'
          },
          {
            id: 3,
            title: '使用内心独白工具',
            description: '与内心深处的自己进行了深度对话，获得了新的认知',
            timeAgo: '3天前'
          }
        ];
        resolve(mockGrowth);
      }, 400);
    });
  },
})