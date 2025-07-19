// pages/create-script/create-script.js
Page({
  data: {
    // 表单数据
    storyText: '',
    characterTraits: '', // 角色性格特点
    selectedRole: 'female', // 默认女主本
    selectedAvatar: 0,
    scriptImage: '',
    
    // 草稿相关
    hasDraft: false,
    canSave: false,
    
    // 头像选项
    availableAvatars: [
      '/assets/user/role1.jpg',
      '/assets/user/role2.jpg', 
      '/assets/user/role3.jpg',
      '/assets/user/role4.jpg',
      '/assets/user/role5.jpg',
      '/assets/user/role6.jpg'
    ],
    
    // 状态
    canGenerate: false,
    isGenerating: false,
    showProgress: false,
    progressStep: 0
  },

  onLoad(options) {
    this.updateCanGenerate();
    this.loadDraft();
  },

  /**
   * 输入剧情文本
   */
  onStoryInput(e) {
    const storyText = e.detail.value;
    this.setData({ storyText });
    this.updateCanGenerate();
    this.updateCanSave();
  },

  /**
   * 输入角色性格特点
   */
  onCharacterInput(e) {
    const characterTraits = e.detail.value;
    this.setData({ characterTraits });
    this.updateCanSave();
  },

  /**
   * 选择角色类型
   */
  selectRole(e) {
    const { role } = e.currentTarget.dataset;
    this.setData({ selectedRole: role });
    
    // 根据角色类型更新默认头像
    this.updateAvatarsByRole(role);
    this.updateCanSave();
  },

  /**
   * 选择头像
   */
  selectAvatar(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ selectedAvatar: index });
    this.updateCanSave();
  },

  /**
   * 选择配图
   */
  selectImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 允许选择原图和压缩图
      sourceType: ['album', 'camera'],
      success: (res) => {
        const filePath = res.tempFilePaths[0];
        this.processSelectedImage(filePath);
      }
    });
  },

  /**
   * 处理选择的图片
   */
  processSelectedImage(filePath) {
    wx.showLoading({
      title: '处理图片中...',
      mask: true
    });

    // 检查文件大小
    wx.getFileInfo({
      filePath: filePath,
      success: (fileInfo) => {
        if (fileInfo.size <= 500 * 1024) {
          // 图片已经小于500KB，直接使用
          wx.hideLoading();
          this.setData({ scriptImage: filePath });
          this.updateCanGenerate();
        } else {
          // 图片大于500KB，需要压缩
          this.compressImage(filePath);
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '获取图片信息失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 压缩图片
   */
  compressImage(filePath) {
    // 直接使用微信的压缩功能，更可靠
    this.useWeChatCompress(filePath);
  },



  /**
   * 使用微信的压缩功能
   */
  useWeChatCompress(filePath, quality = 80) {
    wx.compressImage({
      src: filePath,
      quality: quality, // 压缩质量
      success: (compressRes) => {
        wx.getFileInfo({
          filePath: compressRes.tempFilePath,
          success: (fileInfo) => {
            if (fileInfo.size <= 500 * 1024) {
              // 压缩成功，文件大小符合要求
              wx.hideLoading();
              this.setData({ scriptImage: compressRes.tempFilePath });
              this.updateCanGenerate();
              wx.showToast({
                title: '图片已自动压缩',
                icon: 'success'
              });
            } else if (quality > 20) {
              // 还是太大，进一步压缩
              this.useWeChatCompress(filePath, quality - 30);
            } else {
              // 已经是最低质量了，直接使用
              wx.hideLoading();
              this.setData({ scriptImage: compressRes.tempFilePath });
              this.updateCanGenerate();
              wx.showToast({
                title: '图片已尽力压缩',
                icon: 'none'
              });
            }
          },
          fail: () => {
            // 获取文件信息失败，直接使用压缩后的图片
            wx.hideLoading();
            this.setData({ scriptImage: compressRes.tempFilePath });
            this.updateCanGenerate();
          }
        });
      },
      fail: () => {
        // 压缩失败，使用原图
        wx.hideLoading();
        this.setData({ scriptImage: filePath });
        this.updateCanGenerate();
        wx.showToast({
          title: '图片处理完成',
          icon: 'success'
        });
      }
    });
  },

  /**
   * 更新头像选项（根据角色类型）
   */
  updateAvatarsByRole(role) {
    let avatars = [];
    
    switch (role) {
      case 'female':
        avatars = [
          '/assets/user/role1.jpg',
          '/assets/user/role2.jpg',
          '/assets/user/role3.jpg',
          '/assets/user/role4.jpg',
          '/assets/user/role5.jpg',
          '/assets/user/role6.jpg'
        ];
        break;
      case 'male':
        // 使用女性头像作为备选，实际项目中应该有男性头像
        avatars = [
          '/assets/user/role1.jpg',
          '/assets/user/role2.jpg',
          '/assets/user/role3.jpg',
          '/assets/user/role4.jpg',
          '/assets/user/role5.jpg',
          '/assets/user/role6.jpg'
        ];
        break;
      case 'double_male':
      case 'double_female':
        avatars = [
          '/assets/user/role1.jpg',
          '/assets/user/role2.jpg',
          '/assets/user/role3.jpg',
          '/assets/user/role4.jpg',
          '/assets/user/role5.jpg',
          '/assets/user/role6.jpg'
        ];
        break;
    }
    
    this.setData({ 
      availableAvatars: avatars,
      selectedAvatar: 0 // 重置为第一个
    });
  },

  /**
   * 更新是否可以生成
   */
  updateCanGenerate() {
    const { storyText } = this.data;
    const canGenerate = storyText.trim().length >= 10; // 至少10个字符
    this.setData({ canGenerate });
  },

  /**
   * 生成剧本
   */
  async generateScript() {
    if (!this.checkCanGenerate()) {
      return;
    }

    this.setData({ 
      isGenerating: true, 
      showProgress: true,
      progressStep: 0
    });

    try {
      // 步骤1：分析剧情内容
      this.setData({ progressStep: 1 });
      await this.delay(1000);

      // 步骤2：构建场景框架  
      this.setData({ progressStep: 2 });
      await this.delay(1000);

      // 步骤3：完善剧本细节
      this.setData({ progressStep: 3 });
      await this.delay(500);

      // 生成剧本数据
      const scriptData = await this.generateScriptData();
      
      // 保存到本地存储
      const savedScript = this.saveCustomScript(scriptData);
      
      // 生成成功后清除草稿
      this.clearDraftAfterGenerate();
      
      wx.showToast({
        title: '剧本生成成功！',
        icon: 'success'
      });

      // 延迟跳转到剧本详情页
      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/script-detail/script-detail?id=${savedScript.id}&custom=true`
        });
      }, 1500);

    } catch (error) {
      console.error('生成剧本失败:', error);
      wx.showToast({
        title: '生成失败，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({ 
        isGenerating: false, 
        showProgress: false 
      });
    }
  },

  /**
   * 检查是否可以生成
   */
  checkCanGenerate() {
    const { storyText, canGenerate } = this.data;
    
    if (!canGenerate) {
      wx.showToast({
        title: '请先输入剧情描述',
        icon: 'none'
      });
      return false;
    }

    if (storyText.trim().length < 10) {
      wx.showToast({
        title: '剧情描述至少需要10个字符',
        icon: 'none'
      });
      return false;
    }

    return true;
  },

  /**
   * 生成剧本数据
   */
  async generateScriptData() {
    const { storyText, characterTraits, selectedRole, selectedAvatar, availableAvatars, scriptImage } = this.data;
    
    // 生成唯一ID
    const scriptId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // 根据用户输入生成剧本标题
    const title = this.generateTitle(storyText);
    
    // 生成剧本描述
    const description = this.generateDescription(storyText);
    
    // 生成标签
    const tags = this.generateTags(storyText, selectedRole);
    
    // 生成类型
    const type = this.generateType(storyText);
    
    // 生成场景列表（包含性格特点）
    const scenes = this.generateScenes(storyText, selectedRole, characterTraits);
    
    return {
      id: scriptId,
      title,
      description,
      tags,
      type,
      cover: scriptImage || this.getDefaultCover(selectedRole),
      avatar: availableAvatars[selectedAvatar],
      role: selectedRole,
      scenes,
      isCustom: true,
      createTime: new Date(),
      userStory: storyText,
      userCharacterTraits: characterTraits || null
    };
  },

  /**
   * 生成剧本标题
   */
  generateTitle(storyText) {
    // 简单的标题生成逻辑，基于关键词
    const keywords = ['咖啡厅', '前任', '复合', '放下', '偶遇', '邂逅', '重逢', '告白', '暗恋'];
    
    for (const keyword of keywords) {
      if (storyText.includes(keyword)) {
        switch (keyword) {
          case '咖啡厅':
            return '咖啡厅的偶然相遇';
          case '前任':
            return '再见前任';
          case '复合':
            return '是否重新开始';
          case '暗恋':
            return '不能说的喜欢';
          case '偶遇':
          case '邂逅':
            return '意外的重逢';
          default:
            return '我们的故事';
        }
      }
    }
    
    return '定制剧本：' + storyText.substring(0, 8) + '...';
  },

  /**
   * 生成剧本描述
   */
  generateDescription(storyText) {
    if (storyText.length <= 30) {
      return storyText;
    }
    return storyText.substring(0, 27) + '...';
  },

  /**
   * 生成标签
   */
  generateTags(storyText, role) {
    const baseTags = ['定制剧本'];
    
    // 根据角色添加标签
    switch (role) {
      case 'female':
        baseTags.push('女主视角');
        break;
      case 'male':
        baseTags.push('男主视角');
        break;
      case 'double_male':
        baseTags.push('双男主');
        break;
      case 'double_female':
        baseTags.push('双女主');
        break;
    }
    
    // 根据内容添加情感标签
    if (storyText.includes('前任') || storyText.includes('分手')) {
      baseTags.push('前任');
    }
    if (storyText.includes('暗恋') || storyText.includes('喜欢')) {
      baseTags.push('暗恋');
    }
    if (storyText.includes('告白') || storyText.includes('表白')) {
      baseTags.push('告白');
    }
    
    return baseTags;
  },

  /**
   * 生成类型
   */
  generateType(storyText) {
    if (storyText.includes('前任') || storyText.includes('分手')) {
      return '情感纠葛';
    }
    if (storyText.includes('暗恋') || storyText.includes('喜欢')) {
      return '暗恋心动';
    }
    if (storyText.includes('告白') || storyText.includes('表白')) {
      return '勇敢告白';
    }
    if (storyText.includes('朋友') || storyText.includes('同事')) {
      return '关系边界';
    }
    
    return '情感探索';
  },

  /**
   * 生成场景列表
   */
  generateScenes(storyText, role, characterTraits) {
    // 根据故事复杂度生成5-10个场景
    const storyComplexity = Math.min(Math.floor(storyText.length / 30), 5); // 根据文本长度判断复杂度
    const sceneCount = 5 + storyComplexity; // 5-10个场景
    
    // 如果用户提供了性格特点，将其融入场景描述
    const personalityNote = characterTraits ? `(性格特点: ${characterTraits})` : '';
    
    // 基础场景模板
    const allScenes = [
      {
        id: 0,
        name: '初遇时刻',
        description: '故事的开始，设定基本情境',
        time: '下午3点',
        location: '咖啡厅',
        characters: role === 'double_male' ? ['你', '他', '朋友'] : role === 'double_female' ? ['你', '她', '闺蜜'] : ['你', 'TA'],
        action: '偶然相遇',
        background: storyText.substring(0, 20) + '...' + personalityNote
      },
      {
        id: 1,
        name: '对话开始',
        description: '初步交流，试探彼此想法',
        time: '几分钟后',
        location: '咖啡厅角落',
        characters: role === 'double_male' ? ['你', '他'] : role === 'double_female' ? ['你', '她'] : ['你', 'TA'],
        action: '深入交谈',
        background: '氛围逐渐升温，内心波澜涌动'
      },
      {
        id: 2,
        name: '情感波动',
        description: '情感开始变化，出现转折',
        time: '傍晚6点',
        location: '街头',
        characters: role === 'double_male' ? ['你', '他'] : role === 'double_female' ? ['你', '她'] : ['你', 'TA'],
        action: '情感表达',
        background: '内心的纠结与挣扎逐渐显现'
      },
      {
        id: 3,
        name: '关键抉择',
        description: '面临重要选择的关键时刻',
        time: '夜晚8点',
        location: '公园小径',
        characters: role === 'double_male' ? ['你', '他'] : role === 'double_female' ? ['你', '她'] : ['你', 'TA'],
        action: '重要决定',
        background: '必须做出选择的紧张时刻'
      },
      {
        id: 4,
        name: '内心独白',
        description: '独自思考，内心挣扎',
        time: '夜晚9点',
        location: '回家路上',
        characters: ['你'],
        action: '内心独白',
        background: '回顾刚才的对话，内心五味杂陈'
      },
      {
        id: 5,
        name: '朋友建议',
        description: '向朋友倾诉，寻求建议',
        time: '第二天上午',
        location: '朋友家',
        characters: role === 'double_male' ? ['你', '朋友'] : role === 'double_female' ? ['你', '闺蜜'] : ['你', '朋友'],
        action: '倾诉烦恼',
        background: '向信任的人分享内心的困扰'
      },
      {
        id: 6,
        name: '意外相遇',
        description: '再次偶然相遇，情况有所不同',
        time: '下午2点',
        location: '商场',
        characters: role === 'double_male' ? ['你', '他'] : role === 'double_female' ? ['你', '她'] : ['你', 'TA'],
        action: '再次相遇',
        background: '命运的安排让你们再次相遇'
      },
      {
        id: 7,
        name: '深度交流',
        description: '更深入的对话，敞开心扉',
        time: '傍晚5点',
        location: '河边步道',
        characters: role === 'double_male' ? ['你', '他'] : role === 'double_female' ? ['你', '她'] : ['你', 'TA'],
        action: '深度对话',
        background: '彼此都放下了防备，开始真诚交流'
      },
      {
        id: 8,
        name: '关键转折',
        description: '故事的转折点，关系发生变化',
        time: '夜晚7点',
        location: '安静的餐厅',
        characters: role === 'double_male' ? ['你', '他'] : role === 'double_female' ? ['你', '她'] : ['你', 'TA'],
        action: '关系转变',
        background: '一个重要的时刻改变了一切'
      },
      {
        id: 9,
        name: '最终决定',
        description: '故事的结局，做出最终选择',
        time: '深夜10点',
        location: '各自回家的路上',
        characters: role === 'double_male' ? ['你', '他'] : role === 'double_female' ? ['你', '她'] : ['你', 'TA'],
        action: '最终选择',
        background: '故事落下帷幕，未来充满可能'
      }
    ];

    // 根据场景数量返回对应的场景
    return allScenes.slice(0, sceneCount);
  },

  /**
   * 获取默认封面
   */
  getDefaultCover(role) {
    // 使用现有的assets图片路径，避免路径错误
    const defaultCovers = {
      'female': '/assets/scripts_list/001.jpeg',
      'male': '/assets/scripts_list/002.jpeg', 
      'double_male': '/assets/scripts_list/003.jpeg',
      'double_female': '/assets/scripts_list/004.jpeg'
    };
    
    return defaultCovers[role] || '/assets/scripts_list/001.jpeg';
  },

  /**
   * 保存自定义剧本
   */
  saveCustomScript(scriptData) {
    try {
      // 获取已有的自定义剧本
      const customScripts = wx.getStorageSync('customScripts') || [];
      
      // 添加新剧本
      customScripts.unshift(scriptData);
      
      // 限制最多保存20个自定义剧本
      if (customScripts.length > 20) {
        customScripts.splice(20);
      }
      
      // 保存到本地存储
      wx.setStorageSync('customScripts', customScripts);
      
      return scriptData;
    } catch (error) {
      console.error('保存自定义剧本失败:', error);
      throw error;
    }
  },

  /**
   * 延迟函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * 加载草稿
   */
  loadDraft() {
    try {
      const draft = wx.getStorageSync('script_draft');
      if (draft) {
        const { storyText, characterTraits, selectedRole, selectedAvatar, scriptImage } = draft;
        
        this.setData({
          storyText: storyText || '',
          characterTraits: characterTraits || '',
          selectedRole: selectedRole || 'female',
          selectedAvatar: selectedAvatar || 0,
          scriptImage: scriptImage || '',
          hasDraft: true
        });
        
        // 根据恢复的角色更新头像选项
        if (selectedRole) {
          this.updateAvatarsByRole(selectedRole);
        }
        
        this.updateCanGenerate();
        this.updateCanSave();
        
        console.log('草稿已恢复');
      }
    } catch (error) {
      console.error('加载草稿失败:', error);
    }
  },

  /**
   * 保存草稿
   */
  saveDraft() {
    const { storyText, characterTraits, selectedRole, selectedAvatar, scriptImage } = this.data;
    
    if (!this.data.canSave) {
      return;
    }

    try {
      const draft = {
        storyText,
        characterTraits,
        selectedRole,
        selectedAvatar,
        scriptImage,
        saveTime: new Date().toISOString()
      };
      
      wx.setStorageSync('script_draft', draft);
      
      wx.showToast({
        title: '草稿已保存',
        icon: 'success'
      });
      
      this.setData({ hasDraft: true });
      
      // 保存到自定义剧本列表（标记为草稿）
      this.saveDraftToCustomScripts(draft);
      
    } catch (error) {
      console.error('保存草稿失败:', error);
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  },

  /**
   * 保存草稿到自定义剧本列表
   */
  saveDraftToCustomScripts(draft) {
    try {
      const customScripts = wx.getStorageSync('customScripts') || [];
      
      // 检查是否已存在草稿
      const existingDraftIndex = customScripts.findIndex(script => script.isDraft === true);
      
      const draftScript = {
        id: 'draft_' + Date.now(),
        title: draft.storyText ? draft.storyText.substring(0, 20) + '...' : '未命名草稿',
        description: draft.storyText || '草稿内容',
        cover: draft.scriptImage || this.getDefaultCover(draft.selectedRole),
        avatar: this.data.availableAvatars[draft.selectedAvatar || 0],
        role: draft.selectedRole || 'female',
        type: '草稿',
        tags: ['草稿', '未完成'],
        scenes: [],
        isCustom: true,
        isDraft: true,
        createTime: new Date(),
        userStory: draft.storyText,
        userCharacterTraits: draft.characterTraits,
        draftData: draft
      };
      
      if (existingDraftIndex >= 0) {
        // 更新现有草稿
        customScripts[existingDraftIndex] = draftScript;
      } else {
        // 添加新草稿
        customScripts.unshift(draftScript);
      }
      
      wx.setStorageSync('customScripts', customScripts);
      
    } catch (error) {
      console.error('保存草稿到自定义剧本失败:', error);
    }
  },

  /**
   * 清除草稿
   */
  clearDraft() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除当前草稿吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            // 清除本地存储的草稿
            wx.removeStorageSync('script_draft');
            
            // 从自定义剧本列表中移除草稿
            const customScripts = wx.getStorageSync('customScripts') || [];
            const filteredScripts = customScripts.filter(script => !script.isDraft);
            wx.setStorageSync('customScripts', filteredScripts);
            
            // 重置表单
            this.setData({
              storyText: '',
              characterTraits: '',
              selectedRole: 'female',
              selectedAvatar: 0,
              scriptImage: '',
              hasDraft: false
            });
            
            this.updateCanGenerate();
            this.updateCanSave();
            
            wx.showToast({
              title: '草稿已清除',
              icon: 'success'
            });
            
          } catch (error) {
            console.error('清除草稿失败:', error);
            wx.showToast({
              title: '清除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  /**
   * 更新保存按钮状态
   */
  updateCanSave() {
    const { storyText } = this.data;
    const canSave = storyText.trim().length > 0;
    this.setData({ canSave });
  },

  /**
   * 生成成功后清除草稿
   */
  clearDraftAfterGenerate() {
    try {
      // 清除本地存储的草稿
      wx.removeStorageSync('script_draft');
      
      // 从自定义剧本列表中移除草稿
      const customScripts = wx.getStorageSync('customScripts') || [];
      const filteredScripts = customScripts.filter(script => !script.isDraft);
      wx.setStorageSync('customScripts', filteredScripts);
      
      console.log('草稿已清除（生成成功）');
      
    } catch (error) {
      console.error('清除草稿失败:', error);
    }
  }
}); 