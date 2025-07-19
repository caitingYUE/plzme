Page({
  data: {
    isLoading: false
  },

  onLoad() {
    // 页面加载时的初始化
    this.initLaunchPage();
  },

  onShow() {
    // 每次显示页面时重置状态
    this.setData({
      isLoading: false
    });
  },

  /**
   * 初始化启动页面
   */
  initLaunchPage() {
    // 预加载资源或检查用户状态
    try {
      // 检查是否是首次打开
      const isFirstTime = !wx.getStorageSync('hasLaunched');
      
      if (!isFirstTime) {
        // 如果不是首次打开，可以考虑直接跳转到首页
        // 或者显示简化版启动页
        console.log('用户已经使用过应用');
      }
    } catch (error) {
      console.error('初始化启动页面失败:', error);
    }
  },

  /**
   * 进入应用主页面
   */
  enterApp() {
    // 防止重复点击
    if (this.data.isLoading) {
      return;
    }

    this.setData({
      isLoading: true
    });

    try {
      // 标记用户已经打开过应用
      wx.setStorageSync('hasLaunched', true);
      wx.setStorageSync('firstLaunchTime', new Date().getTime());

      // 添加轻微延迟，增强用户体验
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index',
          success: () => {
            console.log('成功跳转到首页');
          },
          fail: (error) => {
            console.error('跳转到首页失败:', error);
            this.setData({
              isLoading: false
            });
            
            // 显示错误提示
            wx.showToast({
              title: '页面跳转失败',
              icon: 'error',
              duration: 2000
            });
          }
        });
      }, 800);

    } catch (error) {
      console.error('进入应用失败:', error);
      this.setData({
        isLoading: false
      });
      
      wx.showToast({
        title: '启动失败，请重试',
        icon: 'error',
        duration: 2000
      });
    }
  },

  /**
   * 处理页面分享
   */
  onShareAppMessage() {
    return {
      title: 'PlzMe - 我是我的人生主角',
      desc: '通过AI心理剧探索内心世界，在角色扮演中获得成长与疗愈',
      path: '/pages/launch/launch'
    };
  },

  /**
   * 处理分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: 'PlzMe - 专为女性设计的深夜疗愈空间',
      query: 'from=timeline'
    };
  }
}); 