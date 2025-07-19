// pages/index/index.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activities: [
      {
        id: 1,
        title: "女性力量成长工作坊",
        date: "12月15日 周六",
        location: "杭州·西湖",
        participants: 12,
        maxParticipants: 15,
        participantsPercent: 80,
        status: "open",
        statusText: "报名中",
        coverImage: "/assets/index/workshop.png"
      },
      {
        id: 2,
        title: "情感表达艺术疗愈小组",
        date: "12月22日 周六",
        location: "上海·静安",
        participants: 8,
        maxParticipants: 10,
        participantsPercent: 80,
        status: "open",
        statusText: "报名中",
        coverImage: "/assets/index/group.png"
      }
    ],
    
    // 用户信息
    userInfo: null,
    isLoggedIn: false,
    
    // 页面状态
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('首页加载');
    this.initPage();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('首页准备就绪');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示页面时检查登录状态
    this.checkLoginStatus();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('首页隐藏');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log('首页卸载');
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
      title: 'PlzMe - 我是我的人生主角',
      desc: '通过AI心理剧探索内心世界，在角色扮演中获得成长与疗愈',
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
      wx.showLoading({ title: '加载中...' });
      
      // 并行加载数据
      await Promise.all([
        this.loadActivities(),
        this.loadUserProfile()
      ]);
      
    } catch (error) {
      console.error('页面初始化失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  async refreshData() {
    try {
      await this.loadActivities();
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
    this.setData({
      userInfo,
      isLoggedIn: app.isLoggedIn()
    });
  },



  async loadActivities() {
    try {
      // 模拟API调用 - 后续替换为真实API
      // const activities = await this.getActivities();
      // this.setData({ activities });
      
      // 计算参与率
      const activities = this.data.activities.map(activity => ({
        ...activity,
        participantsPercent: Math.round((activity.participants / activity.maxParticipants) * 100)
      }));
      
      this.setData({ activities });
    } catch (error) {
      console.error('加载活动失败:', error);
    }
  },

  async loadUserProfile() {
    if (!app.isLoggedIn()) return;
    
    try {
      // 后续实现用户信息加载
      const userInfo = app.getUserInfo();
      this.setData({ userInfo });
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  },

  // 页面交互方法
  goToAIMentor() {
    if (!this.checkAuth()) return;
    
    wx.navigateTo({
      url: '/pages/chat/chat?type=mentor'
    });
  },

  viewEmotionCard() {
    wx.showModal({
      title: '情绪探索卡',
      content: '今日情绪关键词：平静\n\n建议你今天给自己一些安静的时间，感受内心的声音。不必急于解决所有问题，有时候静下来本身就是一种答案。',
      confirmText: '开始探索',
      cancelText: '稍后再看',
      success: (res) => {
        if (res.confirm) {
          this.startEmotionExploration();
        }
      }
    });
  },

  viewRelationCard() {
    wx.showModal({
      title: '关系洞察卡',
      content: '今日关系提示：边界\n\n健康的关系需要合适的边界。学会说"不"不是自私，而是自爱。爱自己，才能更好地爱别人。',
      confirmText: '了解更多',
      cancelText: '稍后再看',
      success: (res) => {
        if (res.confirm) {
          this.startRelationExploration();
        }
      }
    });
  },

  startEmotionExploration() {
    if (!this.checkAuth()) return;
    
    wx.navigateTo({
      url: '/pages/chat/chat?type=emotion&tool=inner_monologue'
    });
  },

  startRelationExploration() {
    if (!this.checkAuth()) return;
    
    wx.navigateTo({
      url: '/pages/chat/chat?type=relation&tool=relationship_report'
    });
  },

  goToActivity(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/activity/activity?id=${id}`
    });
  },

  viewAllActivities() {
    wx.switchTab({
      url: '/pages/index/index'
    });
    
    // 滚动到活动区域
    setTimeout(() => {
      wx.pageScrollTo({
        selector: '.activity-section',
        duration: 300
      });
    }, 100);
  },

  startExploring() {
    wx.switchTab({
      url: '/pages/scripts/scripts'
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

  goToLogin() {
    wx.navigateTo({
      url: '/pages/auth/login'
    });
  },

  // API调用方法（后续实现）
  async getActivities() {
    return new Promise((resolve) => {
      // 模拟网络请求
      setTimeout(() => {
        resolve(this.data.activities);
      }, 500);
    });
  },
})