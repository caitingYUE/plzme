// pages/script-detail/script-detail.js
const app = getApp();
const ScriptManager = require('../../utils/script-manager');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scriptData: null,
    isCollected: false,
    loading: true,  // 初始状态为加载中
    isCustomScript: false // 是否为自定义剧本
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('剧本详情页加载，完整参数:', options);
    
    // 初始化剧本管理器
    this.scriptManager = ScriptManager.getInstance();
    console.log('ScriptManager初始化完成');
    
    // 检查是否为自定义剧本
    const isCustom = options.custom === 'true';
    const scriptId = options.id;
    
    console.log('获取到的scriptId原始值:', scriptId);
    console.log('是否为自定义剧本:', isCustom);
    
    if (isCustom) {
      // 加载自定义剧本
      this.loadCustomScript(scriptId);
    } else if (scriptId) {
      // 处理不同的ID格式
      let processedId = scriptId;
      // 如果ID包含script_前缀，去掉前缀
      if (processedId.startsWith('script_')) {
        processedId = processedId.replace('script_', '');
      }
      // 确保ID是3位数格式
      processedId = processedId.padStart(3, '0');
      console.log('处理后的scriptId:', processedId);
      
      this.loadScriptDetail(processedId);
    } else {
      console.log('没有获取到scriptId，使用默认值');
      // 如果没有ID，显示默认示例数据
      this.loadMockData('001');
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    console.log('剧本详情页准备就绪');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 检查收藏状态
    this.checkCollectStatus();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 加载自定义剧本
   */
  async loadCustomScript(scriptId) {
    console.log('开始加载自定义剧本，scriptId:', scriptId);
    
    this.setData({ loading: true });
    
    try {
      // 从本地存储获取自定义剧本
      const customScripts = wx.getStorageSync('customScripts') || [];
      const scriptData = customScripts.find(script => script.id === scriptId);
      
      if (scriptData) {
        console.log('找到自定义剧本数据:', scriptData);
        
        // 转换为页面需要的格式
        const convertedData = this.convertCustomScriptForPage(scriptData);
        console.log('转换后的自定义剧本数据:', convertedData);
        
        this.setData({
          scriptData: convertedData,
          loading: false,
          isCustomScript: true
        });
      } else {
        console.log('未找到自定义剧本数据');
        wx.showToast({
          title: '剧本不存在',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
      
    } catch (error) {
      console.error('加载自定义剧本失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  /**
   * 转换自定义剧本数据为页面格式
   */
  convertCustomScriptForPage(scriptData) {
    console.log('开始转换自定义剧本数据:', scriptData);
    
    return {
      id: scriptData.id,
      title: scriptData.title,
      coverImage: scriptData.cover,
      description: scriptData.description,
      
      // 标签系统
      tags: scriptData.tags || [],
      
      // 角色信息
      scriptType: scriptData.role,
      mainCharacters: this.getMainCharactersByRole(scriptData.role),
      userRole: this.getUserRoleByType(scriptData.role),
      aiRole: this.getAIRoleByType(scriptData.role),
      avatarConfig: {
        user: scriptData.avatar,
        ai: this.getDefaultAIAvatar(scriptData.role)
      },
      
      // 预期收获
      benefits: this.getCustomScriptBenefits(scriptData),
      
      // 场景列表
      scenes: scriptData.scenes || [],
      
      // 其他元数据
      type: scriptData.type,
      difficulty: '自定义',
      duration: '15-30分钟',
      emotions: [],
      
      // 标记为自定义剧本
      isCustom: true,
      userStory: scriptData.userStory
    };
  },

  /**
   * 根据角色类型获取主要角色
   */
  getMainCharactersByRole(role) {
    switch (role) {
      case 'female':
        return ['你（女主）', 'TA'];
      case 'male':
        return ['你（男主）', 'TA'];
      case 'double_male':
        return ['你', '他', '朋友'];
      case 'double_female':
        return ['你', '她', '闺蜜'];
      default:
        return ['你', 'TA'];
    }
  },

  /**
   * 根据角色类型获取用户角色
   */
  getUserRoleByType(role) {
    switch (role) {
      case 'female':
        return '女主角';
      case 'male':
        return '男主角';
      case 'double_male':
        return '男主角之一';
      case 'double_female':
        return '女主角之一';
      default:
        return '主角';
    }
  },

  /**
   * 根据角色类型获取AI角色
   */
  getAIRoleByType(role) {
    switch (role) {
      case 'female':
        return '对方';
      case 'male':
        return '对方';
      case 'double_male':
        return '另一位男主';
      case 'double_female':
        return '另一位女主';
      default:
        return '对方';
    }
  },

  /**
   * 获取默认AI头像
   */
  getDefaultAIAvatar(role) {
    switch (role) {
      case 'female':
        return '/assets/user/male1.jpg';
      case 'male':
        return '/assets/user/role1.jpg';
      case 'double_male':
        return '/assets/user/male2.jpg';
      case 'double_female':
        return '/assets/user/role2.jpg';
      default:
        return '/assets/user/role1.jpg';
    }
  },

  /**
   * 获取自定义剧本的预期收获
   */
  getCustomScriptBenefits(scriptData) {
    const baseBenefits = [
      '探索个人情感',
      '提升表达能力',
      '增强内心体验'
    ];
    
    // 根据剧本内容添加特定收获
    if (scriptData.userStory.includes('前任') || scriptData.userStory.includes('分手')) {
      baseBenefits.push('处理分离情绪');
    }
    if (scriptData.userStory.includes('暗恋') || scriptData.userStory.includes('喜欢')) {
      baseBenefits.push('理解暗恋心理');
    }
    if (scriptData.userStory.includes('告白') || scriptData.userStory.includes('表白')) {
      baseBenefits.push('练习勇敢表达');
    }
    
    return baseBenefits;
  },

  /**
   * 加载剧本详情数据
   */
  async loadScriptDetail(scriptId) {
    console.log('开始加载剧本详情，scriptId:', scriptId);
    
    this.setData({ loading: true });
    
    try {
      // 先尝试从API获取剧本详情
      const apiScriptData = await this.scriptManager.fetchScriptDetailFromAPI(scriptId);
      console.log('从API获取的剧本数据:', apiScriptData);
      
      if (apiScriptData) {
        // 使用API数据
        this.setData({
          scriptData: apiScriptData,
          loading: false
        });
        return;
      }
      
      // 如果API没有数据，尝试本地数据
      const fullScriptId = scriptId.startsWith('script_') ? scriptId : `script_${scriptId}`;
      console.log('完整的scriptId:', fullScriptId);
      
      // 从ScriptManager获取本地剧本数据
      const scriptData = this.scriptManager.getScript(fullScriptId);
      console.log('从ScriptManager获取的原始数据:', scriptData);
      
      if (scriptData) {
        // 转换为页面需要的格式
        const convertedData = this.convertScriptDataForPage(scriptData);
        console.log('转换后的数据:', convertedData);
        
        this.setData({
          scriptData: convertedData,
          loading: false
        });
      } else {
        console.log('未找到剧本数据，使用mock数据');
        this.loadMockData(scriptId);
      }
      
    } catch (error) {
      console.error('加载剧本详情失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      });
      this.loadMockData(scriptId);
    }
  },

  /**
   * 转换剧本数据为页面格式
   */
  convertScriptDataForPage(scriptData) {
    console.log('开始转换剧本数据:', scriptData);
    
    // 从scriptData.id中提取数字部分（例如：script_001 -> 001）
    const idNumber = scriptData.id.replace('script_', '').padStart(3, '0');
    
    return {
      id: idNumber,
      title: scriptData.title,
      coverImage: scriptData.cover || `/assets/scripts_list/${idNumber}.jpeg`,
      description: scriptData.description,
      
      // 标签系统 - 使用真实的tags数据
      tags: scriptData.tags || [],
      
      // 角色信息 - 使用真实的角色设定
      scriptType: scriptData.scriptType,
      mainCharacters: scriptData.mainCharacters,
      userRole: scriptData.userRole,
      aiRole: scriptData.aiRole,
      avatarConfig: scriptData.avatarConfig,
      
      // 预期收获 - 使用真实的benefits
      benefits: scriptData.benefits || [],
      
      // 场景列表 - 使用真实的sceneList，如果没有则使用默认场景
      scenes: scriptData.sceneList || this.getDefaultScenes(),
      
      // 其他元数据
      type: scriptData.type,
      difficulty: scriptData.difficulty,
      duration: scriptData.duration,
      emotions: scriptData.emotions || []
    };
  },

  /**
   * 获取预生成的30个场景
   */
  getDefaultScenes() {
    return [
      { id: 1, title: '咖啡厅的偶遇', description: '在一个安静的咖啡厅里，两个陌生人因为一杯咖啡开始了对话' },
      { id: 2, title: '公园的黄昏', description: '夕阳西下的公园里，坐在长椅上分享彼此的心事' },
      { id: 3, title: '书店的邂逅', description: '在书架间偶然相遇，因为同一本书而展开深度交流' },
      { id: 4, title: '雨夜的倾诉', description: '雨夜里的温暖房间，敞开心扉说出内心的困惑' },
      { id: 5, title: '海边的漫步', description: '在海边慢慢走着，听着海浪声分享人生感悟' },
      { id: 6, title: '深夜的电话', description: '深夜时分的一通电话，在黑暗中寻找内心的光明' },
      { id: 7, title: '图书馆的静思', description: '安静的图书馆里，通过文字和眼神进行心灵沟通' },
      { id: 8, title: '山顶的对话', description: '站在山顶俯瞰城市，探讨人生的高度和深度' },
      { id: 9, title: '火车上的相遇', description: '长途火车上的偶然邂逅，在移动中寻找内心的方向' },
      { id: 10, title: '星空下的心声', description: '在满天繁星下，说出平时不敢表达的真心话' },
      { id: 11, title: '花园的午后', description: '阳光透过花朵洒下，在花香中治愈内心的创伤' },
      { id: 12, title: '艺术馆的启发', description: '在艺术作品前驻足，通过艺术探索内心世界' },
      { id: 13, title: '夜市的烟火气', description: '在热闹的夜市里，感受生活的真实和温暖' },
      { id: 14, title: '湖边的倒影', description: '看着湖水中的倒影，反思自己的内心世界' },
      { id: 15, title: '小径的漫游', description: '在蜿蜒的小径上慢慢走着，探索内心的秘密花园' },
      { id: 16, title: '工作室的创作', description: '在安静的工作室里，通过创作表达内心的情感' },
      { id: 17, title: '屋顶的风景', description: '站在屋顶看着城市夜景，思考自己在这个世界的位置' },
      { id: 18, title: '森林的呼吸', description: '在茂密的森林里，感受大自然的治愈力量' },
      { id: 19, title: '桥上的眺望', description: '站在桥上看着流水，思考时间流逝和人生变迁' },
      { id: 20, title: '教室的回忆', description: '回到熟悉的教室，重新审视自己的成长轨迹' },
      { id: 21, title: '市场的人生百态', description: '在熙熙攘攘的市场里，观察和思考人生的多样性' },
      { id: 22, title: '音乐厅的共鸣', description: '在音乐的包围中，让心灵与旋律产生共鸣' },
      { id: 23, title: '温泉的放松', description: '在温暖的温泉中，让身心完全放松并敞开心扉' },
      { id: 24, title: '废墟的思考', description: '在历史的废墟前，思考时间、生命和存在的意义' },
      { id: 25, title: '实验室的探索', description: '在科学的世界里，探索理性与感性的平衡' },
      { id: 26, title: '舞台的表演', description: '在舞台的聚光灯下，勇敢展现真实的自己' },
      { id: 27, title: '码头的等待', description: '在码头等待船只，思考人生的出发和归来' },
      { id: 28, title: '天台的独白', description: '在高楼的天台上，向着天空说出内心的秘密' },
      { id: 29, title: '地铁的流动', description: '在地铁的人流中，思考个体与群体的关系' },
      { id: 30, title: '镜子前的对话', description: '对着镜子与自己进行最诚实的对话' }
    ];
  },

  /**
   * 加载模拟数据
   */
  loadMockData(scriptId = '001') {
    console.log('开始加载模拟数据，scriptId:', scriptId);
    const mockData = this.getMockScriptData(scriptId);
    console.log('获取到的模拟数据:', mockData);
    
    this.setData({
      scriptData: mockData,
      loading: false
    }, () => {
      console.log('数据设置完成，当前页面数据:', this.data.scriptData);
    });
  },

  /**
   * 获取模拟剧本数据
   */
  getMockScriptData(scriptId) {
    console.log('getMockScriptData 被调用，scriptId:', scriptId);
    
    // 预定义场景数据
    const scenes = [
      { id: 1, title: '咖啡厅的偶遇', description: '在一个安静的咖啡厅里，两个陌生人因为一杯咖啡开始了对话' },
      { id: 2, title: '公园的黄昏', description: '夕阳西下的公园里，坐在长椅上分享彼此的心事' },
      { id: 3, title: '书店的邂逅', description: '在书架间偶然相遇，因为同一本书而展开深度交流' },
      { id: 4, title: '雨夜的倾诉', description: '雨夜里的温暖房间，敞开心扉说出内心的困惑' },
      { id: 5, title: '海边的漫步', description: '在海边慢慢走着，听着海浪声分享人生感悟' }
    ];
    
    // 根据不同的scriptId返回不同的数据
    let scriptData;
    
    switch (scriptId) {
      case '001':
        scriptData = {
          id: '001',
          title: '重新定义自我价值',
          coverImage: '/assets/scripts_list/001.jpeg',
          description: '通过深度对话，重新审视和定义自己的内在价值。这个剧本将带你探索自我认知的盲区，发现被忽视的内在力量。',
          tags: ['男主本', '自我认知', '价值探索', '内在力量'],
          userRole: '一个对自我价值感到困惑的人，渴望找到内在的力量和价值感',
          aiRole: '温和而有洞察力的心理导师，善于引导你发现内在的闪光点',
          benefits: [
            '提升自我认知和自我接纳能力',
            '发现被忽视的个人优势和价值',
            '建立更健康的自我评价体系',
            '增强内在力量和自信心'
          ],
          scenes: scenes
        };
        break;
        
      case '002':
        scriptData = {
          id: '002',
          title: '亲密关系中的界限设定',
          coverImage: '/assets/scripts_list/002.jpeg',
          description: '探索在亲密关系中如何建立健康的个人边界。学会在爱与独立之间找到平衡。',
          tags: ['女主本', '关系边界', '独立自主', '情感表达'],
          userRole: '在亲密关系中感到困扰的人，想要学会设定健康边界',
          aiRole: '经验丰富的关系咨询师，专长于帮助人们建立健康的关系模式',
          benefits: [
            '学会在关系中保持个人独立性',
            '掌握健康的边界设定技巧',
            '提升情感表达和沟通能力',
            '建立更平衡、更健康的亲密关系'
          ],
          scenes: scenes
        };
        break;
        
      case '004':
        scriptData = {
          id: '004',
          title: 'AI觉醒之日',
          coverImage: '/assets/scripts_list/004.jpeg',
          description: '一个关于内向女性的温柔故事，对感情懵懂而真诚的你，在这个特殊的日子里经历了人生的转折。',
          tags: ['科幻本', '人工智能', '哲学思考', '存在意义'],
          userRole: '刚刚觉醒的AI，对这个世界充满好奇和困惑',
          aiRole: '人类心理学家，帮助AI理解情感和存在的意义',
          benefits: [
            '探索意识和存在的本质',
            '理解情感的复杂性',
            '思考科技与人性的关系',
            '培养哲学思维能力'
          ],
          scenes: scenes
        };
        break;
        
      default:
        scriptData = {
          id: scriptId,
          title: `心理剧本 ${scriptId}`,
          coverImage: `/assets/scripts_list/${scriptId}.jpeg`,
          description: '这是一个独特的心理成长剧本，将带你探索内心世界，发现自己的无限可能。',
          tags: ['成长本', '自我探索', '心理成长', '内在力量'],
          userRole: '正在寻找自我的探索者，渴望成长和改变',
          aiRole: '专业的心理导师，温暖而富有洞察力',
          benefits: [
            '提升自我认知能力',
            '发现内在的力量和智慧',
            '学会更好地表达自己',
            '建立积极的人生态度'
          ],
          scenes: scenes
        };
    }
    
    console.log('返回的scriptData:', scriptData);
    return scriptData;
  },

  /**
   * 检查收藏状态
   */
  checkCollectStatus() {
    if (!this.data.scriptData) return;
    
    try {
      const collected = wx.getStorageSync('collected_scripts') || [];
      const isCollected = collected.includes(this.data.scriptData.id);
      this.setData({ isCollected });
    } catch (error) {
      console.error('检查收藏状态失败:', error);
    }
  },

  /**
   * 切换收藏状态
   */
  toggleCollect() {
    if (!this.data.scriptData) return;
    
    try {
      const collected = wx.getStorageSync('collected_scripts') || [];
      const scriptId = this.data.scriptData.id;
      const isCurrentlyCollected = collected.includes(scriptId);
      
      if (isCurrentlyCollected) {
        // 取消收藏
        const newCollected = collected.filter(id => id !== scriptId);
        wx.setStorageSync('collected_scripts', newCollected);
        this.setData({ isCollected: false });
        
        wx.showToast({
          title: '已取消收藏',
          icon: 'success'
        });
      } else {
        // 添加收藏
        collected.push(scriptId);
        wx.setStorageSync('collected_scripts', collected);
        this.setData({ isCollected: true });
        
        wx.showToast({
          title: '收藏成功',
          icon: 'success'
        });
      }
    } catch (error) {
      console.error('操作收藏失败:', error);
      wx.showToast({
        title: '操作失败',
        icon: 'error'
      });
    }
  },

  /**
   * 开始剧本体验
   */
  startScript() {
    if (!this.data.scriptData) return;
    
    const scriptData = this.data.scriptData;
    this.navigateToChat(scriptData);
  },

  /**
   * 跳转到聊天页面
   */
  navigateToChat(scriptData) {
    // 构造聊天页面参数
    const chatParams = {
      type: 'script',
      scriptId: `script_${scriptData.id}`,
      scriptTitle: scriptData.title
    };
    
    // 将参数转换为URL查询字符串
    const queryString = Object.keys(chatParams)
      .map(key => `${key}=${encodeURIComponent(chatParams[key])}`)
      .join('&');
    
    wx.navigateTo({
      url: `/pages/chat/chat?${queryString}`,
      success: () => {
        console.log('跳转到聊天页面成功');
      },
      fail: (error) => {
        console.error('跳转到聊天页面失败:', error);
        wx.showToast({
          title: '跳转失败',
          icon: 'error'
        });
      }
    });
  },

  /**
   * 投稿剧本
   */
  submitScript() {
    const { scriptData } = this.data;
    
    if (!scriptData || !scriptData.isCustom) {
      wx.showToast({
        title: '仅支持自定义剧本投稿',
        icon: 'none'
      });
      return;
    }

    // 显示投稿确认弹窗
    wx.showModal({
      title: '投稿确认',
      content: '投稿作品将有机会被展示给更多用户，是否确认投稿？',
      confirmText: '确认投稿',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          this.sendSubmissionEmail(scriptData);
        }
      }
    });
  },

  /**
   * 发送投稿邮件
   */
  async sendSubmissionEmail(scriptData) {
    wx.showLoading({
      title: '正在投稿...',
      mask: true
    });

    try {
      // 构建邮件内容
      const emailContent = this.buildEmailContent(scriptData);
      
      // 这里应该调用后端API发送邮件
      // 现在模拟发送邮件的过程
      await this.simulateEmailSending(emailContent);
      
      wx.hideLoading();
      wx.showToast({
        title: '投稿成功！',
        icon: 'success',
        duration: 2000
      });
      
      // 记录投稿状态
      this.recordSubmission(scriptData.id);
      
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        title: '投稿失败，请稍后重试',
        icon: 'none'
      });
      console.error('投稿失败:', error);
    }
  },

  /**
   * 构建邮件内容
   */
  buildEmailContent(scriptData) {
    const userInfo = wx.getStorageSync('userInfo') || {};
    const submissionTime = new Date().toLocaleString('zh-CN');
    
    return {
      to: 'caitlinyct@gmail.com',
      subject: `【剧本投稿】${scriptData.title}`,
      body: `
投稿时间：${submissionTime}
投稿用户：${userInfo.nickName || '匿名用户'}

=== 剧本信息 ===
剧本标题：${scriptData.title}
剧本类型：${scriptData.type}
角色设定：${scriptData.userRole}
剧本描述：${scriptData.description}

=== 用户原始故事 ===
${scriptData.userStory || '用户未提供原始故事'}

=== 生成的剧本内容 ===
场景数量：${scriptData.scenes ? scriptData.scenes.length : 0}个

${scriptData.scenes ? scriptData.scenes.map((scene, index) => `
场景${index + 1}：${scene.name}
时间：${scene.time}
地点：${scene.location}
描述：${scene.description}
背景：${scene.background}
`).join('\n') : '无场景数据'}

=== 标签信息 ===
${scriptData.tags ? scriptData.tags.join(', ') : '无标签'}

=== 预期收获 ===
${scriptData.benefits ? scriptData.benefits.join('\n') : '无预期收获'}

投稿ID：${scriptData.id}
`,
      scriptData: scriptData
    };
  },

  /**
   * 模拟邮件发送（实际项目中应该调用后端API）
   */
  async simulateEmailSending(emailContent) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 在实际项目中，这里应该调用后端API
    console.log('邮件内容:', emailContent);
    
    // 可以在这里调用微信云函数或其他后端服务
    // 例如：
    // return wx.cloud.callFunction({
    //   name: 'sendEmail',
    //   data: emailContent
    // });
    
    return { success: true };
  },

  /**
   * 记录投稿状态
   */
  recordSubmission(scriptId) {
    try {
      const submissions = wx.getStorageSync('submittedScripts') || [];
      if (!submissions.includes(scriptId)) {
        submissions.push(scriptId);
        wx.setStorageSync('submittedScripts', submissions);
      }
    } catch (error) {
      console.error('记录投稿状态失败:', error);
    }
  },

  /**
   * 分享功能
   */
  onShareAppMessage() {
    const scriptData = this.data.scriptData;
    if (!scriptData) return {};
    
    return {
      title: `${scriptData.title} - PlzMe心理剧本`,
      desc: scriptData.description,
      path: `/pages/script-detail/script-detail?id=${scriptData.id}`,
      imageUrl: scriptData.coverImage
    };
  },

  onShareTimeline() {
    const scriptData = this.data.scriptData;
    if (!scriptData) return {};
    
    return {
      title: `${scriptData.title} - 我在PlzMe体验心理剧本`,
      query: `id=${scriptData.id}`,
      imageUrl: scriptData.coverImage
    };
  }
})