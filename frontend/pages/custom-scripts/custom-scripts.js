Page({
  data: {
    customScripts: [],
    loading: true,
    showDeleteModal: false,
    deleteScript: null
  },

  onLoad(options) {
    this.loadCustomScripts();
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadCustomScripts();
  },

  onPullDownRefresh() {
    this.loadCustomScripts().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载自定义剧本列表
   */
  async loadCustomScripts() {
    this.setData({ loading: true });
    
    try {
      const customScripts = wx.getStorageSync('customScripts') || [];
      
      // 按创建时间倒序排列并处理显示文本
      const sortedScripts = customScripts.sort((a, b) => {
        return new Date(b.createTime) - new Date(a.createTime);
      }).map(script => ({
        ...script,
        roleText: this.getRoleText(script.role),
        timeText: this.formatTime(script.createTime)
      }));
      
      this.setData({
        customScripts: sortedScripts,
        loading: false
      });
      
    } catch (error) {
      console.error('加载自定义剧本失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 跳转到剧本详情页
   */
  goToScriptDetail(e) {
    const { script } = e.currentTarget.dataset;
    if (!script) return;
    
    wx.navigateTo({
      url: `/pages/script-detail/script-detail?id=${script.id}&custom=true`
    });
  },

  /**
   * 编辑剧本
   */
  editScript(e) {
    const { script } = e.currentTarget.dataset;
    if (!script) return;
    
    if (script.isDraft) {
      // 如果是草稿，恢复草稿数据并跳转到创建页面
      try {
        wx.setStorageSync('script_draft', script.draftData);
        wx.navigateTo({
          url: '/pages/create-script/create-script'
        });
      } catch (error) {
        console.error('恢复草稿失败:', error);
        wx.showToast({
          title: '恢复失败',
          icon: 'none'
        });
      }
    } else {
      // 完整剧本的编辑功能暂不实现
      wx.showToast({
        title: '完整剧本编辑功能即将上线',
        icon: 'none'
      });
    }
  },

  /**
   * 删除剧本
   */
  deleteScript(e) {
    const { script } = e.currentTarget.dataset;
    if (!script) return;
    
    this.setData({
      showDeleteModal: true,
      deleteScript: script
    });
  },

  /**
   * 取消删除
   */
  cancelDelete() {
    this.setData({
      showDeleteModal: false,
      deleteScript: null
    });
  },

  /**
   * 确认删除
   */
  confirmDelete() {
    if (!this.data.deleteScript) return;
    
    try {
      const customScripts = wx.getStorageSync('customScripts') || [];
      const filteredScripts = customScripts.filter(
        script => script.id !== this.data.deleteScript.id
      );
      
      wx.setStorageSync('customScripts', filteredScripts);
      
      this.setData({
        customScripts: filteredScripts,
        showDeleteModal: false,
        deleteScript: null
      });
      
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      });
      
    } catch (error) {
      console.error('删除剧本失败:', error);
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      });
    }
  },

  /**
   * 跳转到创建剧本页面
   */
  goToCreateScript() {
    wx.navigateTo({
      url: '/pages/create-script/create-script'
    });
  },

  /**
   * 获取角色类型文本
   */
  getRoleText(role) {
    const roleMap = {
      'female': '女主本',
      'male': '男主本',
      'double_male': '双男主',
      'double_female': '双女主'
    };
    return roleMap[role] || '未知';
  },

  /**
   * 格式化时间
   */
  formatTime(timeStr) {
    if (!timeStr) return '';
    
    const time = new Date(timeStr);
    const now = new Date();
    const diff = now - time;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (days > 0) {
      return `${days}天前`;
    } else if (hours > 0) {
      return `${hours}小时前`;
    } else if (minutes > 0) {
      return `${minutes}分钟前`;
    } else {
      return '刚刚';
    }
  }
}); 