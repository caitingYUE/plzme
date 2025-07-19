// pages/scripts/scripts.js
const app = getApp();
const ScriptManager = require('../../utils/script-manager');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 加载状态
    loading: true,
    
    // 全部剧本数据
    allScripts: [],
    
    // 分类展示的剧本
    featuredScripts: [],      // 精选剧本
    newScripts: [],           // 新增剧本
    relationshipScripts: [],  // 我们是什么关系
    crushScripts: [],         // 朦胧的情愫
    secretScripts: [],        // 不能说的秘密
    heartbeatScripts: []      // 心跳的声音
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.scriptManager = ScriptManager.getInstance();
    this.initPage();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

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
    // 新布局不需要分页加载
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '发现精彩心理剧本',
      desc: '在角色扮演中探索内心世界',
      path: '/pages/scripts/scripts'
    };
  },

  onShareTimeline() {
    return {
      title: 'PlzMe 心理剧本库',
      query: ''
    };
  },

  /**
   * 随机打乱数组顺序
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  async initPage() {
    await this.loadAllScripts();
    this.categorizeScripts();
  },

  async refreshData() {
    try {
      this.setData({ loading: true });
      await this.loadAllScripts();
      this.categorizeScripts();
      
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
      this.setData({ loading: false });
    }
  },

  async loadAllScripts() {
    try {
      console.log('开始加载剧本数据...');
      // 通过API获取剧本数据
      const scriptManager = this.scriptManager;
      const rawScripts = await scriptManager.fetchAllScriptsFromAPI();
      console.log('从API获取到的原始数据:', rawScripts);

      // 转换为页面需要的格式并添加模拟数据（如评分、播放量等）
      const allScripts = rawScripts.map((script, index) => ({
        ...script,
        rating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0
        playCount: Math.floor(Math.random() * 5000) + 100,
        likes: Math.floor(Math.random() * 1000) + 50,
        comments: Math.floor(Math.random() * 500) + 20,
        isNew: index < 4, // 前4个标记为新剧本
        createTime: script.createTime || new Date(Date.now() - index * 7 * 24 * 60 * 60 * 1000)
      }));

      console.log('转换后的剧本数据:', allScripts);
      console.log('第一个剧本的cover字段:', allScripts[0]?.cover);

      // 随机打乱剧本顺序
      const shuffledScripts = this.shuffleArray(allScripts);

      this.setData({ allScripts: shuffledScripts });
      console.log('剧本数据设置完成，总数:', shuffledScripts.length);
    } catch (error) {
      console.error('加载剧本失败:', error);
      this.setData({ allScripts: [] });
    }
  },

  /**
   * 将剧本分类到不同类别
   */
  categorizeScripts() {
    const { allScripts } = this.data;
    
    // 精选剧本 - 评分最高的前3个，数量减少
    const featuredScripts = [...allScripts]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
    
    // 新增剧本 - 最新的剧本，随机打乱
    const newScripts = this.shuffleArray(allScripts.filter(script => script.isNew));
    
    // 按新的场景分类，使用更宽松的匹配条件让每个分类都有内容，并随机打乱
    // 我们是什么关系 - 关系边界、困惑、朋友相关
    const relationshipKeywords = ['关系', '边界', '什么', '朋友', '同事', '暧昧', '分手'];
    const relationshipScripts = this.shuffleArray(allScripts.filter(script => 
      relationshipKeywords.some(keyword => 
        (script.title && script.title.includes(keyword)) || 
        (script.description && script.description.includes(keyword))
      ) ||
      script.type === '关系边界' ||
      (Array.isArray(script.emotions) && script.emotions.includes('困惑'))
    ).slice(0, 6));
    
    // 朦胧的情愫 - 暗恋、心动、青涩、初恋相关
    const crushKeywords = ['暗恋', '心动', '情愫', '青春', '初恋', '悸动', '喜欢'];
    const crushScripts = this.shuffleArray(allScripts.filter(script => 
      crushKeywords.some(keyword => 
        (script.title && script.title.includes(keyword)) || 
        (script.description && script.description.includes(keyword))
      ) ||
      (Array.isArray(script.emotions) && script.emotions.includes('暗恋'))
    ).slice(0, 6));
    
    // 不能说的秘密 - 秘密、隐藏、不能说、心事相关
    const secretKeywords = ['秘密', '不能', '隐藏', '说不出', '未完成', '心事', '憋屈'];
    const secretScripts = this.shuffleArray(allScripts.filter(script => 
      secretKeywords.some(keyword => 
        (script.title && script.title.includes(keyword)) || 
        (script.description && script.description.includes(keyword))
      )
    ).slice(0, 6));
    
    // 心跳的声音 - 心跳、紧张、激动、告白、表白相关
    const heartbeatKeywords = ['心跳', '告白', '紧张', '激动', '声音', '表白', '勇气'];
    const heartbeatScripts = this.shuffleArray(allScripts.filter(script => 
      heartbeatKeywords.some(keyword => 
        (script.title && script.title.includes(keyword)) || 
        (script.description && script.description.includes(keyword))
      ) ||
      (Array.isArray(script.emotions) && script.emotions.includes('紧张'))
    ).slice(0, 6));
    
    // 如果某个分类内容不足，从其他剧本中补充
    const usedIds = new Set([
      ...featuredScripts.map(s => s.id),
      ...newScripts.map(s => s.id),
      ...relationshipScripts.map(s => s.id),
      ...crushScripts.map(s => s.id),
      ...secretScripts.map(s => s.id),
      ...heartbeatScripts.map(s => s.id)
    ]);
    
    const remainingScripts = allScripts.filter(script => !usedIds.has(script.id));
    
    // 为不足6个的分类补充内容，并随机打乱
    const fillCategory = (category, targetCount = 6) => {
      if (category.length < targetCount) {
        const needed = targetCount - category.length;
        const additional = this.shuffleArray(remainingScripts).slice(0, needed);
        additional.forEach(script => usedIds.add(script.id));
        return this.shuffleArray([...category, ...additional]);
      }
      return this.shuffleArray(category);
    };
    
    const finalRelationshipScripts = fillCategory(relationshipScripts);
    const finalCrushScripts = fillCategory(crushScripts);
    const finalSecretScripts = fillCategory(secretScripts);
    const finalHeartbeatScripts = fillCategory(heartbeatScripts);
    
    // 更新页面数据
    this.setData({
      featuredScripts,
      newScripts,
      relationshipScripts: finalRelationshipScripts,
      crushScripts: finalCrushScripts,
      secretScripts: finalSecretScripts,
      heartbeatScripts: finalHeartbeatScripts,
      loading: false
    });
  },

  /**
   * 查看更多
   */
  viewMore(e) {
    const { category } = e.currentTarget.dataset;
    console.log('查看更多:', category);
    // TODO: 跳转到分类详情页
  },

  /**
   * 跳转到剧本详情页
   */
  goToScript(e) {
    const { id } = e.currentTarget.dataset;
    if (!id) {
      wx.showToast({
        title: '剧本信息错误',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: `/pages/script-detail/script-detail?id=${id}`
    });
  },

  /**
   * 跳转到创建剧本页面
   */
  goToCreateScript() {
    wx.navigateTo({
      url: '/pages/create-script/create-script'
    });
  }

});