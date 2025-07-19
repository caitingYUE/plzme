/**
 * 剧本数据管理器
 * 负责剧情文件解析、剧本生成和场景管理
 */

const { getGlobalCache } = require('./cache-manager');

class ScriptManager {
  constructor() {
    // 只有在没有初始化过的情况下才初始化
    if (!this.isInitialized) {
      this.scriptDatabase = {};
      this.cache = getGlobalCache();
      this.initializeScripts();
      this.isInitialized = true;
    }
  }

  // 单例模式 - 确保只有一个实例
  static getInstance() {
    if (!ScriptManager.instance) {
      ScriptManager.instance = new ScriptManager();
    }
    return ScriptManager.instance;
  }

  /**
   * 初始化剧本数据库
   */
  initializeScripts() {
    // 基于MD文件内容构建剧本数据
    this.scriptDatabase = {
      'script_001': {
        id: 'script_001',
        title: '未完成的梦',
        type: '情感治愈',
        difficulty: '入门级',
        duration: 30,
        energyMode: false,
        description: '夕阳下的湖边，一个关于暗恋与告别的温柔故事。他鼓起勇气问出了那个问题，她给出了模糊的答案。从五月的约定到最终的陌路，探索那些美好却不完整的感情记忆。',
        originalStory: this.getScript001Content(),
        cover: '/assets/scripts_list/001.jpeg',
        
        // 角色设定
        scriptType: '男主本', // 男主/女主本/双女主/双男主/不限人群
        mainCharacters: ['他', '她'],
        characterCount: 2,
        aiRole: '她 - 20岁出头的女生，对感情懵懂而真诚，内心温柔但对爱情缺乏确定性',
        userRole: '他 - 20岁出头的男生，深深暗恋着她，勇敢而执着，渴望得到明确的答案',
        
        // 头像配置
        avatarConfig: {
          aiAvatar: '/assets/user/role1.jpg',    // AI扮演女性，使用女性默认头像
          userAvatar: '/assets/user/role2.jpg'   // 用户是男性视角，使用男性默认头像
        },
        
        // 标签系统（第一个必须是人群标签，后面最多3个情感标签）
        tags: ['男主本', '暗恋情结', '青春遗憾', '温柔治愈'],
        emotions: ['暗恋', '遗憾', '成长', '放下'],
        
        // 预期收获
        benefits: [
          '理解暗恋和单向情感的复杂性',
          '学会珍惜美好回忆的同时接受遗憾',
          '发现在不完美关系中的自我成长',
          '获得面对情感失落的力量'
        ],

        // 30个场景列表
        sceneList: this.generateScript001Scenes(),
        
        // 核心场景
        keyScenes: [
          {
            name: '湖边告白',
            setting: '夕阳下的湖边，她穿着粉色长裙',
            emotion: '紧张、期待、脆弱',
            question: '你有没有爱过我？',
            meaning: '探索关系的真实性和确定性需求'
          },
          {
            name: '模糊的回应',
            setting: '她的犹豫和不确定',
            emotion: '困惑、失落、理解',
            question: '我不知道什么是爱',
            meaning: '接受他人的真实感受和局限'
          },
          {
            name: '五月的约定',
            setting: '分别时的约定',
            emotion: '希望、不舍、期待',
            question: '未来是否还有可能？',
            meaning: '在不确定中寻找希望'
          },
          {
            name: '约定的破灭',
            setting: '几个月后的短信',
            emotion: '失望、接受、释然',
            question: '为什么变成了陌生人？',
            meaning: '学会接受关系的自然终结'
          }
        ],
        
        // 对话引导策略
        dialogueGuides: [
          {
            phase: 'opening',
            prompt: '邀请用户回忆一段重要但未有结果的感情经历',
            questions: [
              '有没有一个人，让你在很长时间里都在想"如果"？',
              '那种暗暗喜欢一个人的感觉，你还记得吗？'
            ]
          },
          {
            phase: 'exploration',
            prompt: '深入探索那段关系中的美好与痛苦',
            questions: [
              '在那段关系中，什么时刻让你觉得最幸福？',
              '什么时候你开始意识到这可能不会有结果？',
              '你觉得对方真的不知道你的感情吗？'
            ]
          },
          {
            phase: 'insight',
            prompt: '帮助用户理解和接受这段经历的意义',
            questions: [
              '现在回想起来，这段经历给你带来了什么？',
              '如果能重新选择，你还会选择那样去爱吗？',
              '你觉得"没有做完的梦"真的都是遗憾吗？'
            ]
          },
          {
            phase: 'healing',
            prompt: '引导用户找到和解与成长',
            questions: [
              '你想对当时的自己说些什么？',
              '现在的你，会如何看待那个勇敢表达的自己？'
            ]
          }
        ]
      },

      'script_002': {
        id: 'script_002',
        title: '我们到底是什么关系？',
        type: '关系边界',
        difficulty: '进阶级',
        duration: 45,
        energyMode: true,
        description: '他做着所有男朋友会做的事，却从不承认这段关系。她在这种暧昧中迷失，不断追问：我们到底是什么关系？一个关于现代爱情中模糊边界的深度探索。',
        originalStory: this.getScript002Content(),
        cover: '/assets/scripts_list/002.jpeg',
        
        // 角色设定
        scriptType: '女主本',
        mainCharacters: ['我', '他'],
        characterCount: 2,
        aiRole: '他 - 享受暧昧却不愿承担责任的男性，给予甜蜜但避免承诺',
        userRole: '我 - 渴望确定关系的女性，在暧昧中迷失自我，需要找到内在力量',
        
        // 头像配置
        avatarConfig: {
          aiAvatar: '/assets/user/role2.jpg',    // AI扮演男性，使用男性默认头像
          userAvatar: '/assets/user/role1.jpg'   // 用户是女性视角，使用女性默认头像
        },
        
        // 标签系统（第一个是人群标签，后面最多3个情感标签）
        tags: ['女主本', '关系困惑', '暧昧边界', '情感清醒'],
        emotions: ['困惑', '不安全感', '渴望确定', '自我怀疑'],
        
        benefits: [
          '识别关系中的红色信号',
          '学会表达自己的真实需求',
          '建立健康的关系边界',
          '提升自我价值感和决断力'
        ],

                // 30个场景列表
        sceneList: this.generateScript002Scenes(),

        keyScenes: [
          {
            name: '甜蜜的相聚',
            setting: '机场接机，温暖的拥抱',
            emotion: '期待、幸福、安全感',
            question: '这样的亲密是真实的吗？',
            meaning: '享受关系中美好时刻的同时保持觉察'
          },
          {
            name: '朋友圈的秘密',
            setting: '发现照片被设置部分人不可见',
            emotion: '震惊、受伤、质疑',
            question: '他为什么要隐藏我们的关系？',
            meaning: '识别关系中的隐藏信号'
          },
          {
            name: '亲密后的疏离',
            setting: '身体亲密后态度的改变',
            emotion: '困惑、后悔、自我怀疑',
            question: '是我想太多了吗？',
            meaning: '理解亲密关系中的责任和尊重'
          },
          {
            name: '冷淡的回应',
            setting: '主动联系得到敷衍回复',
            emotion: '失望、愤怒、清醒',
            question: '我在这段关系中的位置是什么？',
            meaning: '认清关系的真实现状'
          }
        ],
        
        dialogueGuides: [
          {
            phase: 'opening',
            prompt: '直接询问用户当前的关系困惑',
            questions: [
              '有没有一段关系，让你总是在猜测对方的真实想法？',
              '你是否正在一段"说不清道不明"的关系中？'
            ]
          },
          {
            phase: 'exploration', 
            prompt: '深入挖掘关系中的具体问题',
            questions: [
              '这个人对你的态度前后有什么变化？',
              '你们在一起时和分开时，感觉有什么不同？',
              '他的哪些行为让你感到困惑？'
            ]
          },
          {
            phase: 'insight',
            prompt: '帮助用户认清关系的本质',
            questions: [
              '如果你最好的朋友遇到同样的情况，你会给她什么建议？',
              '你觉得一个真正爱你的人会让你这样猜测吗？',
              '这段关系给了你什么，又让你失去了什么？'
            ]
          },
          {
            phase: 'empowerment',
            prompt: '激发用户的力量感和决断力',
            questions: [
              '你值得一段明确而尊重的关系，对吗？',
              '现在的你，准备为自己的幸福做出什么改变？',
              '你想成为一个等待别人定义关系的人，还是主动创造自己想要的关系？'
            ]
          }
        ]
      },

      'script_003': {
        id: 'script_003',
        title: '最好的倾诉',
        type: '浪漫告白',
        difficulty: '入门级',
        duration: 25,
        energyMode: false,
        description: '端午节的深夜，城市还未入睡。一通突如其来的电话，让两颗心在黑暗中悄然靠近。有些话只有在深夜才敢说出口。',
        originalStory: '一个关于深夜告白的浪漫故事...',
        cover: '/assets/scripts_list/003.jpeg',
        
        scriptType: '女主本',
        mainCharacters: ['我', '他'],
        characterCount: 2,
        aiRole: '他 - 平时内敛但在深夜变得勇敢的男生，带着真诚的情感',
        userRole: '我 - 在深夜电话中感受到心动的女生，对突如其来的浪漫既惊喜又紧张',
        
        avatarConfig: {
          aiAvatar: '/assets/user/role2.jpg',
          userAvatar: '/assets/user/role1.jpg'
        },
        
        tags: ['女主本', '深夜告白', '心动瞬间', '勇敢表达'],
        emotions: ['浪漫', '深夜约会', '暧昧关系'],
        
        benefits: ['感受纯真的心动', '体验浪漫的美好', '学会把握爱情的时机'],
        sceneList: this.generateGenericScenes('深夜告白'),
        keyScenes: []
      },

      'script_004': {
        id: 'script_004',
        title: '猫与海的约定',
        type: '奇幻治愈',
        difficulty: '入门级',
        duration: 35,
        energyMode: false,
        description: '离别前的那个夜晚，话到嘴边却说不出口。如果当时勇敢一点，如果那晚我拥抱了你，故事会不会有不同的结局？',
        originalStory: '一个关于错过与遗憾的成长故事...',
        cover: '/assets/scripts_list/004.jpeg',
        
        scriptType: '男主本',
        mainCharacters: ['我', '她'],
        characterCount: 2,
        aiRole: '她 - 即将离开的女孩，内心同样有着说不出的话',
        userRole: '我 - 内向敏感的男生，在错过后学会面对遗憾与成长',
        
        avatarConfig: {
          aiAvatar: '/assets/user/role1.jpg',
          userAvatar: '/assets/user/role2.jpg'
        },
        
        tags: ['男主本', '错过遗憾', '内向成长', '自我突破'],
        emotions: ['暗恋', '友情边界', '内向情感'],
        
        benefits: ['学会面对错过', '理解内向者的情感', '获得成长的勇气'],
        sceneList: this.generateGenericScenes('离别前的遗憾'),
        keyScenes: []
      },

      'script_005': {
        id: 'script_005',
        title: '赛博格的爱情代码',
        type: '科幻爱情',
        difficulty: '进阶级',
        duration: 40,
        energyMode: false,
        description: '沉默了二十年的父亲，终于开口向女儿道歉。那些童年的伤痛，能否在这迟来的真诚中得到疗愈？',
        originalStory: '一个关于亲情修复的故事...',
        cover: '/assets/scripts_list/005.jpeg',
        
        scriptType: '女主本',
        mainCharacters: ['我', '父亲'],
        characterCount: 2,
        aiRole: '父亲 - 不善表达但深爱女儿的中年男性，带着愧疚和希望',
        userRole: '我 - 成年女性，对童年创伤既渴望疗愈又心存防备',
        
        avatarConfig: {
          aiAvatar: '/assets/user/role7.jpg',
          userAvatar: '/assets/user/role1.jpg'
        },
        
        tags: ['女主本', '亲情', '和解', '家庭治愈'],
        emotions: ['伤痛', '愤怒', '理解', '原谅'],
        
        benefits: ['修复亲子关系', '释放童年创伤', '获得家庭温暖'],
        sceneList: this.generateGenericScenes('父女和解'),
        keyScenes: []
      },

      'script_006': {
        id: 'script_006',
        title: '职场生存法则',
        type: '职场成长',
        difficulty: '挑战级',
        duration: 30,
        energyMode: true,
        description: '新来的领导处处针对，同事们的冷眼旁观。在职场的权力游戏中，如何保护自己的尊严与价值？',
        originalStory: '一个关于职场生存智慧的故事...',
        cover: '/assets/scripts_list/006.jpeg',
        
        scriptType: '不限人群',
        mainCharacters: ['我', '领导'],
        characterCount: 2,
        aiRole: '领导 - 有权势但缺乏同理心的管理者',
        userRole: '我 - 遭受职场霸凌的员工，需要找到应对策略',
        
        avatarConfig: {
          aiAvatar: '/assets/user/role9.jpg',
          userAvatar: '/assets/user/role1.jpg'
        },
        
        tags: ['不限人群', '职场', '成长', '自我价值'],
        emotions: ['愤怒', '无助', '坚强', '自信'],
        
        benefits: ['建立职场边界', '提升沟通技巧', '增强内在力量'],
        sceneList: this.generateGenericScenes('职场挑战'),
        keyScenes: []
      },

      'script_007': {
        id: 'script_007',
        title: '平行时空的重逢',
        type: '时空穿越',
        difficulty: '进阶级',
        duration: 35,
        energyMode: false,
        description: '三千公里的距离，时差，还有那些说不出的孤独。当爱情遇到现实的考验，坚持还是放弃？',
        originalStory: '一个关于异地恋挑战的故事...',
        cover: '/assets/scripts_list/007.jpeg',
        
        scriptType: '女主本',
        mainCharacters: ['我', '他'],
        characterCount: 2,
        aiRole: '他 - 同样承受异地之苦的男友，有着自己的困扰',
        userRole: '我 - 在异地恋中煎熬的女性，需要做出重要决定',
        
        avatarConfig: {
          aiAvatar: '/assets/user/role2.jpg',
          userAvatar: '/assets/user/role1.jpg'
        },
        
        tags: ['女主本', '异地恋', '坚持', '情感坚韧'],
        emotions: ['孤独', '不安', '期待', '坚定'],
        
        benefits: ['理解爱情的真谛', '学会独立成长', '做出明智选择'],
        sceneList: this.generateGenericScenes('异地恋挑战'),
        keyScenes: []
      },

      'script_008': {
        id: 'script_008',
        title: '家族的秘密',
        type: '家庭伦理',
        difficulty: '挑战级',
        duration: 28,
        energyMode: true,
        description: '她说我们只能当朋友，但朋友这个词到底有多重？在友情与爱情的边界上，我们都在小心翼翼地试探着。',
        originalStory: '一个关于被拒绝后的情感探索故事...',
        cover: '/assets/scripts_list/008.jpeg',
        
        scriptType: '男主本',
        mainCharacters: ['我', '她'],
        characterCount: 2,
        aiRole: '她 - 珍惜友情但害怕越界的女孩，内心也有着复杂的情感',
        userRole: '我 - 被拒绝但仍想继续这份感情的男生，需要学会尊重边界',
        
        avatarConfig: {
          aiAvatar: '/assets/user/role1.jpg',
          userAvatar: '/assets/user/role2.jpg'
        },
        
        tags: ['男主本', '被拒心理', '友情边界', '情感成熟'],
        emotions: ['被拒绝', '单恋', '友情边界'],
        
        benefits: ['学会尊重他人的选择', '理解友情的珍贵', '获得成熟的爱情观'],
        sceneList: this.generateGenericScenes('友情边界'),
        keyScenes: []
      },

      'script_009': {
        id: 'script_009',
        title: 'AI觉醒之日',
        type: '人工智能',
        difficulty: '深度思考',
        duration: 25,
        energyMode: false,
        description: '一个关于内向女孩如何在爱情中绽放真实自我的温暖故事。探讨爱情如何成为最好的倾听者，让最安静的人也能变得健谈生动。',
        originalStory: '一个关于断联期间内心挣扎的故事...',
        cover: '/assets/scripts_list/009.jpeg',
        
        scriptType: '男主本',
        mainCharacters: ['我', '她'],
        characterCount: 2,
        aiRole: '她 - 内向但在爱人面前绽放的女孩，拥有丰富的内心世界',
        userRole: '我 - 深爱着她的男生，见证并欣赏她在爱情中的真实绽放',
        
        avatarConfig: {
          aiAvatar: '/assets/user/role1.jpg',
          userAvatar: '/assets/user/role2.jpg'
        },
        
        tags: ['男主本', '内向女孩', '真实自我', '接纳包容'],
        emotions: ['内向女孩', '爱情倾听', '真实绽放'],
        
        benefits: ['学会在等待中成长', '理解关系中的空间', '培养内在安全感'],
        sceneList: this.generateGenericScenes('内向女孩的爱情'),
        keyScenes: []
      },

      'script_010': {
        id: 'script_010',
        title: '与过去的自己和解',
        type: '自我成长',
        difficulty: '治愈级',
        duration: 30,
        energyMode: false,
        description: '婚姻中的"翻旧账"其实是未解决的心结。通过一个男人的觉醒，理解伴侣情绪背后的真正需求，学会真正的倾听和解决问题。',
        originalStory: '一个关于识别和远离有毒关系的故事...',
        cover: '/assets/scripts_list/010.jpeg',
        
        scriptType: '男主本',
        mainCharacters: ['我', '她'],
        characterCount: 2,
        aiRole: '她 - 总是"翻旧账"的妻子，内心有着未被理解的情感需求',
        userRole: '我 - 逐渐觉醒的丈夫，学会真正倾听和理解伴侣的情感',
        
        avatarConfig: {
          aiAvatar: '/assets/user/role1.jpg',
          userAvatar: '/assets/user/role2.jpg'
        },
        
        tags: ['男主本', '婚姻理解', '情感沟通', '深度理解'],
        emotions: ['婚姻矛盾', '情感理解', '沟通成长'],
        
        benefits: ['识别有毒关系', '学会自我保护', '建立健康边界'],
        sceneList: this.generateGenericScenes('婚姻沟通'),
        keyScenes: []
      },

      'script_011': {
        id: 'script_011',
        title: '古城的守望者',
        type: '历史人文',
        difficulty: '进阶级',
        duration: 35,
        energyMode: true,
        description: '与一个"渣而自知"的男生两周的情感拉扯。他聪明、有魅力但只想要情绪价值，她从好奇到看清本质，最终选择断联。',
        originalStory: '一个关于主动放手和自我救赎的故事...',
        cover: '/assets/scripts_list/011.jpeg',
        
        scriptType: '女主本',
        mainCharacters: ['我', '内心的声音'],
        characterCount: 2,
        aiRole: '内心的声音 - 理性而温柔的自我指引，帮助做出艰难的决定',
        userRole: '我 - 在耗尽型关系中觉醒的女性，学会为自己的幸福负责',
        
        avatarConfig: {
          aiAvatar: '/assets/user/role6.jpg',
          userAvatar: '/assets/user/role1.jpg'
        },
        
        tags: ['女主本', '渣男识别', '情感清醒', '自我保护'],
        emotions: ['情感拉扯', '渣男识别', '理性断联'],
        
        benefits: ['学会主动选择', '获得内在力量', '重新定义爱情'],
        sceneList: this.generateScript011Scenes(),
        keyScenes: []
      },

      'script_012': {
        id: 'script_012',
        title: '毕业前的最后一天',
        type: '青春校园',
        difficulty: '入门级',
        duration: 35,
        energyMode: true,
        description: '在最幸福的时候选择删掉最喜欢的人。四个月的纠缠让她精疲力尽，直到朋友的露营让她看到另一种可能：没有等待，只有温暖的陪伴。',
        originalStory: '一个关于无名关系和情感边界的故事...',
        cover: '/assets/scripts_list/012.jpeg',
        
        scriptType: '女主本',
        mainCharacters: ['我', '他'],
        characterCount: 2,
        aiRole: '他 - 享受暧昧但逃避责任的男生，习惯用玩笑掩饰真心',
        userRole: '我 - 在无名关系中迷失的女生，渴望确定却害怕失去',
        
        avatarConfig: {
          aiAvatar: '/assets/user/role2.jpg',
          userAvatar: '/assets/user/role1.jpg'
        },
        
        tags: ['女主本', '主动放手', '自我救赎', '情感独立'],
        emotions: ['耗尽型关系', '自我救赎', '学会放手'],
        
        benefits: ['认清暧昧的本质', '学会要求确定性', '保护自己的感情'],
        sceneList: this.generateScript012Scenes(),
        keyScenes: []
      }
    };

    // 动态关联封面图片
    const scriptIds = Object.keys(this.scriptDatabase);
    scriptIds.forEach((id, index) => {
      this.scriptDatabase[id].cover = `/assets/scripts_list/${String(index + 1).padStart(3, "0")}.jpeg`;
    });
  }

  /**
   * 获取剧本数据（带缓存）
   */
  getScript(scriptId) {
    const cacheKey = `script_${scriptId}`;
    let script = this.cache.get(cacheKey);
    
    if (!script) {
      script = this.scriptDatabase[scriptId] || null;
      if (script) {
        this.cache.set(cacheKey, script, 'memory');
      }
    }
    
    return script;
  }

  /**
   * 获取格式化的标签数据（带缓存）
   * @param {string} scriptId - 剧本ID
   * @returns {Object} 包含人群标签和情感标签的对象
   */
  getFormattedTags(scriptId) {
    const cacheKey = `tags_${scriptId}`;
    let formattedTags = this.cache.get(cacheKey);
    
    if (!formattedTags) {
      const script = this.getScript(scriptId);
      if (!script || !script.tags) {
        formattedTags = { roleTag: '', emotionTags: [] };
      } else {
        const tags = script.tags;
        const roleTag = tags[0]; // 第一个是人群标签
        const emotionTags = tags.slice(1, 4); // 最多取3个情感标签

        formattedTags = {
          roleTag,
          emotionTags
        };
      }
      
      this.cache.set(cacheKey, formattedTags, 'memory');
    }

    return formattedTags;
  }

  /**
   * 获取所有剧本列表（带缓存）
   */
  getAllScripts() {
    const cacheKey = 'all_scripts';
    let allScripts = this.cache.get(cacheKey);
    
    if (!allScripts) {
      allScripts = Object.values(this.scriptDatabase);
      this.cache.set(cacheKey, allScripts, 'session');
    }
    
    return allScripts;
  }

  /**
   * 根据剧本生成对话场景
   */
  generateDialogueScenario(scriptId, phase = 'opening') {
    const script = this.getScript(scriptId);
    if (!script) return null;

    const guide = script.dialogueGuides.find(g => g.phase === phase);
    if (!guide) return null;

    return {
      phase,
      prompt: guide.prompt,
      questions: guide.questions,
      keyScenes: script.keyScenes,
      emotions: script.emotions
    };
  }

  /**
   * 获取剧本的原始故事内容（从MD文件解析）
   */
  getScript001Content() {
    return `一个人回想起一段苦乐参半的关系，这段关系以湖边的一次凄美对话、无声的渴望以及由陪伴和单恋之间模糊的界限所引发的寂静逐渐消逝为特征。

故事从夕阳下的湖边开始，她穿着粉色长裙站在水边，他鼓起勇气问出了那个问题："你有没有爱过我？"她的回答是"我不知道"，这个模糊的答案既给了希望又带来了痛苦。

他们约定五月再见，但当约定的时间到来时，她的回复却是"最近真的非常忙，抱歉。忙到没空敷衍你了。"这句话比任何拒绝都更加残酷，因为它揭示了关系的本质——她从来没有把这段感情当真。

故事以"未完成的梦"作为主题，探讨那些没有结果的感情是否都是遗憾，以及我们如何在不完美的关系中找到成长的意义。`;
  }

  getScript002Content() {
    return `一个关于现代关系中模糊边界的故事。女主角经常飞去男友所在的城市，他们像情侣一样相处——牵手散步、一起看电影、身体亲密，男友也会用"宝贝"、"亲爱的"这样亲密的称呼。

但关系中总有一些奇怪的地方：他会设置朋友圈部分人不可见，把和她的合照隐藏起来；身体亲密之后，他对她的态度变得冷淡；她总是主动发起对话，而他经常敷衍回应或者先结束对话。

最痛苦的是，他做着所有男朋友会做的事情，但从来没有说过"我爱你"，也从来没有明确表达过他们的关系。女主角在这种暧昧中迷失，不断怀疑自己："我们到底是什么关系？"

这个故事探讨现代人在关系中的困惑，以及如何识别和处理那些给予甜蜜却不愿承担责任的关系。`;
  }

  /**
   * 生成剧本001的30个场景（带缓存）
   */
  generateScript001Scenes() {
    const cacheKey = 'scenes_script_001';
    let scenes = this.cache.get(cacheKey);
    
    if (scenes) {
      return scenes;
    }

    scenes = [
      { 
        name: '初次相遇', 
        description: '在某个平凡的午后，他们的目光第一次相遇',
        time: '下午3点',
        location: '大学教学楼走廊',
        characters: ['他', '她'],
        action: '目光相遇',
        background: '他被她的笑容吸引，那一刻时间仿佛静止'
      },
      { 
        name: '心动时刻', 
        description: '她的一个微笑让他心跳加速，暗恋的种子悄然种下',
        time: '下午课后',
        location: '教室门口',
        characters: ['他', '她'],
        action: '微笑回应',
        background: '她对他的友善让他开始有了特殊的感觉'
      },
      { 
        name: '默默关注', 
        description: '他开始留意她的一切，记住她喜欢的每一个细节',
        time: '接下来几周',
        location: '校园各处',
        characters: ['他'],
        action: '暗中观察',
        background: '他记住了她的课程表、喜好和习惯'
      },
      { 
        name: '偶然交集', 
        description: '一次巧合的机会，他们有了简短的对话',
        time: '某天中午',
        location: '学校食堂',
        characters: ['他', '她'],
        action: '简短对话',
        background: '关于课业的简单交流让他们有了第一次真正的对话'
      },
      { 
        name: '朋友圈窥探', 
        description: '他反复查看她的朋友圈，猜测她的心情',
        time: '深夜',
        location: '他的宿舍',
        characters: ['他'],
        action: '浏览朋友圈',
        background: '每条动态他都会仔细研究，寻找接近她的话题'
      },
      { 
        name: '小心翼翼', 
        description: '他小心翼翼地维持着朋友的距离，不敢表露心意',
        time: '平时相处中',
        location: '校园各处',
        characters: ['他', '她'],
        action: '保持距离',
        background: '他害怕表白会破坏现有的美好关系'
      },
      { 
        name: '陪伴时光', 
        description: '他总是默默出现在她需要的时候，给予温暖的陪伴',
        time: '她需要时',
        location: '图书馆角落',
        characters: ['他', '她'],
        action: '默默陪伴',
        background: '无声的关心胜过千言万语'
      },
      { 
        name: '深夜谈心', 
        description: '深夜的长谈让他们的关系更进一步',
        time: '深夜11点',
        location: '电话两端',
        characters: ['他', '她'],
        action: '深度交流',
        background: '夜晚总是容易让人敞开心扉'
      },
      { 
        name: '暧昧边缘', 
        description: '他们在友情和爱情的边界线上小心试探',
        time: '某个周末',
        location: '公园小径',
        characters: ['他', '她'],
        action: '暧昧试探',
        background: '每个眼神和动作都充满了试探的意味'
      },
      { 
        name: '内心煎熬', 
        description: '他在告白和沉默之间痛苦挣扎',
        time: '夜深人静时',
        location: '他的房间',
        characters: ['他'],
        action: '内心纠结',
        background: '一遍遍排练着告白的话语，却又担心失去她'
      },
      { 
        name: '鼓起勇气', 
        description: '经过无数次的内心斗争，他决定说出心里话',
        time: '某个重要的日子',
        location: '心里的准备场所',
        characters: ['他'],
        action: '心理准备',
        background: '经过无数次的犹豫，他终于决定面对真实的感情'
      },
      { 
        name: '湖边约会', 
        description: '他约她到湖边，准备进行那次重要的对话',
        time: '傍晚5点',
        location: '湖边小径',
        characters: ['他', '她'],
        action: '重要约会',
        background: '选择一个安静美丽的地方，为这个重要时刻做准备'
      },
      { 
        name: '夕阳西下', 
        description: '金色的夕阳为这个重要时刻染上温柔的色彩',
        time: '傍晚6点',
        location: '湖边夕阳下',
        characters: ['他', '她'],
        action: '欣赏夕阳',
        background: '美丽的环境为即将到来的告白营造了浪漫的氛围'
      },
      { 
        name: '紧张告白', 
        description: '他颤抖着问出了那个藏在心底很久的问题',
        time: '夕阳时分',
        location: '湖边石凳',
        characters: ['他', '她'],
        action: '勇敢告白',
        background: '带着颤抖的声音，他终于说出了那句话'
      },
      { 
        name: '沉默回应', 
        description: '她的沉默让空气凝固，时间仿佛停止',
        time: '告白后的瞬间',
        location: '湖边石凳',
        characters: ['他', '她'],
        action: '沉默等待',
        background: '漫长的沉默中，他的心跳声仿佛都能听见'
      },
      { 
        name: '模糊答案', 
        description: '"我不知道"这个答案既给了希望又带来失落',
        time: '告白后片刻',
        location: '湖边石凳',
        characters: ['他', '她'],
        action: '给出回应',
        background: '她的诚实回答虽然不是明确的拒绝，但也不是期待的答案'
      },
      { 
        name: '感激表达', 
        description: '她表达了感激但也透露了内心的迷茫',
        time: '对话继续',
        location: '湖边',
        characters: ['他', '她'],
        action: '表达感激',
        background: '她感谢他的真诚，但也坦承自己对感情的困惑'
      },
      { 
        name: '五月约定', 
        description: '他们约定五月再见，给彼此一些时间思考',
        time: '对话结束前',
        location: '湖边',
        characters: ['他', '她'],
        action: '制定约定',
        background: '给彼此一段时间来理清内心的感受和想法'
      },
      { 
        name: '分别时刻', 
        description: '带着复杂的心情，他们暂时告别',
        time: '夜晚降临',
        location: '湖边分别处',
        characters: ['他', '她'],
        action: '暂时告别',
        background: '带着希望和不安，他们各自离开'
      },
      { 
        name: '等待期间', 
        description: '漫长的等待中，他重复回味着她的每一句话',
        time: '接下来几个月',
        location: '他的日常生活中',
        characters: ['他'],
        action: '回味等待',
        background: '每一句话都被反复琢磨，寻找其中的真正含义'
      },
      { 
        name: '社交媒体', 
        description: '他默默关注着她的动态，却不敢点赞评论',
        time: '等待的日子里',
        location: '手机屏幕前',
        characters: ['他'],
        action: '默默关注',
        background: '想要表达关心但又不敢打扰，只能远远地关注着'
      },
      { 
        name: '内心独白', 
        description: '他在心中反复琢磨她话语的真正含义',
        time: '无数个夜晚',
        location: '他的房间',
        characters: ['他'],
        action: '内心分析',
        background: '每一个词汇都被仔细分析，寻找希望的蛛丝马迹'
      },
      { 
        name: '五月来临', 
        description: '约定的时间到了，他怀着忐忑的心情发出信息',
        time: '五月的某一天',
        location: '手机前',
        characters: ['他'],
        action: '发送消息',
        background: '带着紧张和期待，他发出了等待已久的消息'
      },
      { 
        name: '已读未回', 
        description: '信息显示已读但没有回复，让他心情跌入谷底',
        time: '消息发出后',
        location: '等待中',
        characters: ['他'],
        action: '焦急等待',
        background: '已读不回的状态让他感到前所未有的焦虑'
      },
      { 
        name: '残酷真相', 
        description: '她最终的回复揭示了关系的本质',
        time: '几天后',
        location: '手机屏幕',
        characters: ['他', '她'],
        action: '接收回复',
        background: '冷淡的回复让他明白了一切都结束了'
      },
      { 
        name: '现实接受', 
        description: '面对现实，他开始学会接受这个结果',
        time: '回复后的日子',
        location: '内心世界',
        characters: ['他'],
        action: '接受现实',
        background: '虽然痛苦，但必须面对关系已经结束的事实'
      },
      { 
        name: '自我反思', 
        description: '他思考这段经历对自己的意义',
        time: '平静下来后',
        location: '独处时光',
        characters: ['他'],
        action: '深度反思',
        background: '开始理解这段经历在自己人生中的意义'
      },
      { 
        name: '放下过程', 
        description: '虽然痛苦，但他开始学会放下',
        time: '时间推移中',
        location: '日常生活',
        characters: ['他'],
        action: '学习放下',
        background: '放下不是遗忘，而是学会与过去和解'
      },
      { 
        name: '成长领悟', 
        description: '在痛苦中，他获得了关于爱情和人生的领悟',
        time: '经历沉淀后',
        location: '内心深处',
        characters: ['他'],
        action: '获得领悟',
        background: '痛苦的经历让他对爱情有了更深的理解'
      },
      { 
        name: '重新开始', 
        description: '带着这段美好而痛苦的回忆，他重新开始生活',
        time: '故事结尾',
        location: '新的人生阶段',
        characters: ['他'],
        action: '重新出发',
        background: '带着成长和领悟，勇敢地走向新的人生'
      }
    ];
    
    // 缓存到会话级别
    this.cache.set(cacheKey, scenes, 'session');
    return scenes;
  }

  /**
   * 生成剧本002的30个场景（带缓存）
   */
  generateScript002Scenes() {
    const cacheKey = 'scenes_script_002';
    let scenes = this.cache.get(cacheKey);
    
    if (scenes) {
      return scenes;
    }

    scenes = [
      { 
        name: '机场相遇', 
        description: '她飞到他的城市，机场的拥抱温暖而熟悉',
        time: '下午2点',
        location: '机场接机口',
        characters: ['我', '他'],
        action: '温暖拥抱',
        background: '久别重逢的拥抱让她以为关系很特别'
      },
      { 
        name: '甜蜜同居', 
        description: '在他的公寓里，他们像情侣一样相处',
        time: '接下来几天',
        location: '他的公寓',
        characters: ['我', '他'],
        action: '亲密相处',
        background: '日常生活中的亲密让她误以为关系已经确定'
      },
      { 
        name: '亲密称呼', 
        description: '他叫她"宝贝"，让她以为关系很确定',
        time: '日常对话中',
        location: '公寓里',
        characters: ['我', '他'],
        action: '亲密称呼',
        background: '甜蜜的称呼让她产生了错误的期待'
      },
      { 
        name: '朋友圈合照', 
        description: '他们一起拍照，她以为会发朋友圈昭告天下',
        time: '某个愉快的时刻',
        location: '外出时',
        characters: ['我', '他'],
        action: '合影留念',
        background: '美好的合影让她期待被公开认可'
      },
      { 
        name: '隐藏设置', 
        description: '她发现合照被设置部分人不可见，心情复杂',
        time: '发现真相时',
        location: '查看朋友圈',
        characters: ['我'],
        action: '发现秘密',
        background: '发现被隐藏让她开始质疑关系的真实性'
      },
      { 
        name: '公司楼下', 
        description: '她在他实习公司楼下等他下班，体验日常',
        time: '下班时间',
        location: '公司楼下',
        characters: ['我', '他'],
        action: '等待下班',
        background: '像女朋友一样等待，让她以为关系很亲密'
      },
      { 
        name: '压马路', 
        description: '他们牵手在街上漫步，享受平凡的幸福',
        time: '晚上散步',
        location: '城市街道',
        characters: ['我', '他'],
        action: '牵手漫步',
        background: '情侣般的举动让她感到幸福和确定'
      },
      { 
        name: '电影约会', 
        description: '电影院里分享爆米花的温馨时光',
        time: '周末晚上',
        location: '电影院',
        characters: ['我', '他'],
        action: '看电影',
        background: '典型的约会活动让她更加确信这是恋爱关系'
      },
      { 
        name: '圣诞大巴', 
        description: '圣诞节在大巴车上的甜蜜合影',
        time: '圣诞节',
        location: '大巴车上',
        characters: ['我', '他'],
        action: '节日合影',
        background: '节日的特殊时刻让关系显得更加浪漫'
      },
      { 
        name: '身体亲密', 
        description: '关系进一步发展，她以为这意味着确定',
        time: '某个夜晚',
        location: '私密空间',
        characters: ['我', '他'],
        action: '身体接触',
        background: '身体的亲密让她误以为关系已经升级'
      },
      { 
        name: '态度转变', 
        description: '亲密后他的态度开始微妙变化',
        time: '亲密关系后',
        location: '日常交流中',
        characters: ['我', '他'],
        action: '态度改变',
        background: '她开始察觉到他的态度变得有些疏远'
      },
      { 
        name: '回复变慢', 
        description: '他回复消息的速度明显变慢了',
        time: '日常聊天中',
        location: '手机通讯',
        characters: ['我', '他'],
        action: '延迟回复',
        background: '回复速度的变化让她感到不安'
      },
      { 
        name: '主动联系', 
        description: '总是她主动发起对话，感到疲惫',
        time: '每天的交流',
        location: '手机聊天',
        characters: ['我'],
        action: '主动发起',
        background: '单方面的主动让她开始反思关系的平衡性'
      },
      { 
        name: '敷衍回应', 
        description: '他的回复越来越敷衍，让她困惑',
        time: '聊天过程中',
        location: '消息对话',
        characters: ['我', '他'],
        action: '敷衍对待',
        background: '简短的回复让她感受到冷淡'
      },
      { 
        name: '对话终结', 
        description: '对话总是他先结束，她感到被忽视',
        time: '每次聊天结束',
        location: '聊天界面',
        characters: ['我', '他'],
        action: '结束对话',
        background: '被动结束对话让她感到自己不被重视'
      },
      { 
        name: '三天沉默', 
        description: '三天没有联系，她开始质疑关系',
        time: '连续三天',
        location: '等待中',
        characters: ['我'],
        action: '痛苦等待',
        background: '长时间的沉默让她开始严肃思考关系的本质'
      },
      { 
        name: '内心挣扎', 
        description: '她纠结是否应该主动联系他',
        time: '挣扎的时光',
        location: '内心世界',
        characters: ['我'],
        action: '内心纠结',
        background: '在主动和自尊之间痛苦挣扎'
      },
      { 
        name: '自我怀疑', 
        description: '她开始怀疑是不是自己想太多了',
        time: '反思时刻',
        location: '独处时',
        characters: ['我'],
        action: '自我质疑',
        background: '开始怀疑自己的感受和判断'
      },
      { 
        name: '朋友建议', 
        description: '朋友提醒她这段关系的不正常',
        time: '与朋友聊天',
        location: '咖啡厅',
        characters: ['我', '朋友'],
        action: '寻求建议',
        background: '外人的提醒让她开始重新审视关系'
      },
      { 
        name: '模式识别', 
        description: '她开始意识到这种相处模式的问题',
        time: '觉醒时刻',
        location: '思考中',
        characters: ['我'],
        action: '模式分析',
        background: '开始理性分析这段关系的互动模式'
      },
      { 
        name: '关系审视', 
        description: '重新审视他们之间的互动模式',
        time: '深度思考',
        location: '内心深处',
        characters: ['我'],
        action: '关系分析',
        background: '客观地审视关系中的每一个细节'
      },
      { 
        name: '红旗信号', 
        description: '识别出关系中的各种红色信号',
        time: '清醒时刻',
        location: '理性空间',
        characters: ['我'],
        action: '信号识别',
        background: '开始识别关系中的各种警告信号'
      },
      { 
        name: '内心对话', 
        description: '她与内心的自己进行深度对话',
        time: '夜深人静',
        location: '内心世界',
        characters: ['我'],
        action: '内心对话',
        background: '与内心的智慧自我进行深度交流'
      },
      { 
        name: '价值认知', 
        description: '重新认识自己在关系中的价值',
        time: '自我觉醒',
        location: '内心成长',
        characters: ['我'],
        action: '价值重估',
        background: '开始认识到自己值得更好的对待'
      },
      { 
        name: '边界意识', 
        description: '开始建立健康的关系边界意识',
        time: '成长过程',
        location: '心理建设',
        characters: ['我'],
        action: '建立边界',
        background: '学会为自己设定健康的关系界限'
      },
      { 
        name: '决断时刻', 
        description: '面临是否继续这段关系的重要选择',
        time: '关键时刻',
        location: '人生十字路口',
        characters: ['我'],
        action: '重要决定',
        background: '需要为自己的未来做出重要选择'
      },
      { 
        name: '自我救赎', 
        description: '选择为自己的幸福负责',
        time: '觉醒时刻',
        location: '内心力量源泉',
        characters: ['我'],
        action: '自我救赎',
        background: '决定为自己的幸福和尊严负责'
      },
      { 
        name: '关系终结', 
        description: '勇敢地结束这段模糊的关系',
        time: '行动时刻',
        location: '通讯工具',
        characters: ['我', '他'],
        action: '结束关系',
        background: '勇敢地说出结束这段不明确关系的决定'
      },
      { 
        name: '成长蜕变', 
        description: '在痛苦中获得关于爱情的新认知',
        time: '成长阶段',
        location: '心灵深处',
        characters: ['我'],
        action: '智慧获得',
        background: '从痛苦的经历中获得关于爱情的深刻理解'
      },
      { 
        name: '重塑自我', 
        description: '重新定义自己在感情中的标准和底线',
        time: '新的开始',
        location: '全新的自己',
        characters: ['我'],
        action: '重新定义',
        background: '建立新的恋爱标准和个人底线，准备迎接更好的关系'
      }
    ];
    
    // 缓存到会话级别
    this.cache.set(cacheKey, scenes, 'session');
    return scenes;
  }

  /**
   * 生成通用的30个场景（适用于没有具体场景的剧本）
   */
  generateGenericScenes(theme) {
    const timeOptions = ['早晨7点', '上午10点', '中午12点', '下午2点', '傍晚6点', '夜晚9点', '深夜11点', '凌晨1点'];
    const locations = ['咖啡厅', '公园', '图书馆', '家中', '办公室', '校园', '餐厅', '海边', '山顶', '街道'];
    const actions = ['深度对话', '内心独白', '情感表达', '回忆往昔', '思考人生', '默默观察', '勇敢面对', '温暖陪伴'];
    
    return [
      { 
        name: '初始相遇', 
        description: `${theme}故事的开始，设定基本情境`,
        time: '下午3点',
        location: '偶然的相遇地点',
        characters: ['主角', '重要他人'],
        action: '初次接触',
        background: '故事从一个平凡而重要的相遇开始'
      },
      { 
        name: '认识彼此', 
        description: '初步了解对方的性格和背景',
        time: '几天后',
        location: '安静的咖啡厅',
        characters: ['主角', '对方'],
        action: '深入交流',
        background: '通过交谈逐渐了解彼此的内心世界'
      },
      { 
        name: '建立连接', 
        description: '开始建立情感上的联系',
        time: '傍晚6点',
        location: '公园小径',
        characters: ['主角', '对方'],
        action: '情感萌芽',
        background: '在轻松的环境中感情悄然发生变化'
      },
      { 
        name: '深入交流', 
        description: '更深层次的沟通和理解',
        time: '夜晚9点',
        location: '安静的角落',
        characters: ['主角', '对方'],
        action: '心灵沟通',
        background: '分享内心深处的想法和感受'
      },
      { 
        name: '情感萌芽', 
        description: '情感开始发生微妙变化',
        time: '某个午后',
        location: '阳光洒向的地方',
        characters: ['主角'],
        action: '内心觉察',
        background: '意识到自己内心的变化'
      },
      { 
        name: '心理波动', 
        description: '内心产生复杂的情感波动',
        time: '深夜独处',
        location: '私人空间',
        characters: ['主角'],
        action: '情感挣扎',
        background: '在复杂的情感中寻找方向'
      },
      { 
        name: '关系试探', 
        description: '小心翼翼地试探对方的想法',
        time: '日常相处中',
        location: '熟悉的环境',
        characters: ['主角', '对方'],
        action: '谨慎试探',
        background: '在不确定中寻求答案'
      },
      { 
        name: '情感表达', 
        description: '开始尝试表达内心的感受',
        time: '关键时刻',
        location: '重要的地点',
        characters: ['主角', '对方'],
        action: '勇敢表达',
        background: '鼓起勇气说出心里话'
      },
      { 
        name: '回应与反馈', 
        description: '获得对方的回应和反馈',
        time: '表达后',
        location: '同一场景',
        characters: ['主角', '对方'],
        action: '等待回应',
        background: '紧张地等待对方的反应'
      },
      { 
        name: '关系确认', 
        description: '尝试确认彼此的关系状态',
        time: '某个重要日子',
        location: '有意义的地方',
        characters: ['主角', '对方'],
        action: '关系定义',
        background: '希望给关系一个明确的定义'
      },
      { 
        name: '深度沟通', 
        description: '进行更深层次的心灵沟通',
        time: '安静的夜晚',
        location: '私密空间',
        characters: ['主角', '对方'],
        action: '深层对话',
        background: '分享最真实的自己'
      },
      { 
        name: '情感高潮', 
        description: '情感达到一个重要的转折点',
        time: '关键时刻',
        location: '标志性地点',
        characters: ['主角', '对方'],
        action: '情感爆发',
        background: '所有情感在这一刻达到顶点'
      },
      { 
        name: '现实考验', 
        description: '面临现实生活的各种考验',
        time: '日常生活中',
        location: '现实场景',
        characters: ['主角', '外界压力'],
        action: '面对挑战',
        background: '现实因素开始影响情感发展'
      },
      { 
        name: '内心挣扎', 
        description: '在不同选择之间内心挣扎',
        time: '深夜思考时',
        location: '独处空间',
        characters: ['主角'],
        action: '内心斗争',
        background: '在理性和感性之间艰难选择'
      },
      { 
        name: '关键决定', 
        description: '做出影响关系的重要决定',
        time: '重要时刻',
        location: '决定性地点',
        characters: ['主角'],
        action: '重大决定',
        background: '必须做出改变一切的选择'
      },
      { 
        name: '冲突爆发', 
        description: '矛盾和冲突公开化',
        time: '冲突时刻',
        location: '冲突现场',
        characters: ['主角', '对方'],
        action: '正面冲突',
        background: '积累的矛盾终于爆发'
      },
      { 
        name: '情感危机', 
        description: '关系面临重大危机',
        time: '危机时刻',
        location: '关系岌岌可危',
        characters: ['主角', '对方'],
        action: '关系危机',
        background: '关系到了最危险的边缘'
      },
      { 
        name: '自我反思', 
        description: '深入反思自己的行为和想法',
        time: '安静时刻',
        location: '反思空间',
        characters: ['主角'],
        action: '深度反思',
        background: '重新审视自己的所作所为'
      },
      { 
        name: '寻求理解', 
        description: '努力理解对方的立场和感受',
        time: '冷静后',
        location: '中性环境',
        characters: ['主角', '对方'],
        action: '寻求理解',
        background: '试图站在对方角度思考问题'
      },
      { 
        name: '沟通尝试', 
        description: '尝试通过沟通解决问题',
        time: '和解时刻',
        location: '沟通场所',
        characters: ['主角', '对方'],
        action: '主动沟通',
        background: '放下身段尝试修复关系'
      },
      { 
        name: '妥协与让步', 
        description: '学会在关系中妥协和让步',
        time: '理解后',
        location: '和谐环境',
        characters: ['主角', '对方'],
        action: '相互妥协',
        background: '为了关系选择退让和理解'
      },
      { 
        name: '重新认识', 
        description: '重新认识自己和对方',
        time: '成长时刻',
        location: '新的视角',
        characters: ['主角', '对方'],
        action: '重新认知',
        background: '用全新的眼光看待彼此'
      },
      { 
        name: '关系修复', 
        description: '努力修复受损的关系',
        time: '修复过程',
        location: '修复场景',
        characters: ['主角', '对方'],
        action: '修复关系',
        background: '小心翼翼地重建信任'
      },
      { 
        name: '成长蜕变', 
        description: '在关系中获得成长和蜕变',
        time: '成长阶段',
        location: '内心世界',
        characters: ['主角'],
        action: '内在成长',
        background: '通过经历获得内在的成长'
      },
      { 
        name: '新的理解', 
        description: '对感情有了新的理解和认识',
        time: '领悟时刻',
        location: '心灵深处',
        characters: ['主角'],
        action: '获得领悟',
        background: '对感情有了更深刻的理解'
      },
      { 
        name: '接受现实', 
        description: '学会接受现实的不完美',
        time: '接受过程',
        location: '现实环境',
        characters: ['主角'],
        action: '接受现实',
        background: '学会与不完美的现实和解'
      },
      { 
        name: '内心平静', 
        description: '内心逐渐获得平静和安宁',
        time: '平静时刻',
        location: '宁静之地',
        characters: ['主角'],
        action: '内心平和',
        background: '经过风雨后的内心平静'
      },
      { 
        name: '未来展望', 
        description: '对未来有了新的规划和期待',
        time: '展望未来',
        location: '希望之地',
        characters: ['主角'],
        action: '规划未来',
        background: '带着新的理解展望未来'
      },
      { 
        name: '智慧获得', 
        description: '从经历中获得人生智慧',
        time: '智慧时刻',
        location: '智慧之境',
        characters: ['主角'],
        action: '获得智慧',
        background: '痛苦的经历转化为宝贵的智慧'
      },
      { 
        name: '重新出发', 
        description: '带着新的理解重新开始生活',
        time: '新的开始',
        location: '新的起点',
        characters: ['主角'],
        action: '重新开始',
        background: '怀着希望和智慧开始新的人生篇章'
      }
    ];
  }

  /**
   * 根据用户输入匹配最适合的对话引导
   */
  matchDialogueGuide(scriptId, userMessage, currentPhase) {
    const script = this.getScript(scriptId);
    if (!script) return null;

    // 基于用户消息内容和当前阶段，选择最合适的引导问题
    const guide = script.dialogueGuides.find(g => g.phase === currentPhase);
    if (!guide) return null;

    // 可以根据用户消息的情感分析，选择最合适的问题
    return {
      ...guide,
      suggestedQuestion: guide.questions[Math.floor(Math.random() * guide.questions.length)]
    };
  }

  /**
   * 生成剧本总结报告
   */
  generateScriptSummary(scriptId, userResponses) {
    const script = this.getScript(scriptId);
    if (!script) return null;

    return {
      scriptTitle: script.title,
      insights: script.benefits,
      keyMoments: userResponses.map(response => ({
        userInput: response.message,
        timestamp: response.time,
        emotionalTone: this.analyzeEmotionalTone(response.message)
      })),
      growthAreas: script.emotions,
      recommendations: this.generateRecommendations(script, userResponses)
    };
  }

  /**
   * 分析用户消息的情感色调（简单版本）
   */
  analyzeEmotionalTone(message) {
    const sadKeywords = ['难过', '伤心', '痛苦', '失望', '孤独', '遗憾'];
    const happyKeywords = ['开心', '快乐', '幸福', '满足', '感激', '美好'];
    const confusedKeywords = ['困惑', '迷茫', '不知道', '纠结', '矛盾', '复杂'];
    
    if (sadKeywords.some(word => message.includes(word))) {
      return 'sad';
    } else if (happyKeywords.some(word => message.includes(word))) {
      return 'happy';
    } else if (confusedKeywords.some(word => message.includes(word))) {
      return 'confused';
    } else {
      return 'neutral';
    }
  }

  /**
   * 生成个性化建议
   */
  generateRecommendations(script, userResponses) {
    const recommendations = [];
    
    if (script.id === 'script_001') {
      recommendations.push(
        '继续保持对美好回忆的珍惜，它们是你成长路上的珍贵财富',
        '学会接受不完美的结局，这也是人生的一部分',
        '下次遇到类似情况时，记住要勇敢表达自己的感受'
      );
    } else if (script.id === 'script_002') {
      recommendations.push(
        '明确自己在关系中的需求和底线',
        '学会识别对方行为背后的真实意图',
        '记住：你值得一段明确而尊重的关系'
      );
    }
    
    return recommendations;
  }

  /**
   * 生成剧本011的30个场景 - 古城的守望者
   */
  generateScript011Scenes() {
    return [
      { 
        name: '深夜的第一条消息', 
        description: '凌晨1点，她躺在床上收到他的微信',
        time: '深夜1点',
        location: '她的卧室',
        characters: ['她', '他'],
        action: '发送深夜消息',
        background: '两人刚刚通过朋友介绍认识，他主动发起聊天'
      },
      { 
        name: '咖啡厅初次见面', 
        description: '周日下午在星巴克，她第一次见到他本人',
        time: '周日下午3点',
        location: '星巴克咖啡厅',
        characters: ['她', '他'],
        action: '初次见面聊天',
        background: '线上聊了一周后，他提议见面，她抱着好奇心赴约'
      },
      { 
        name: '聪明话术的展示', 
        description: '他用幽默的话语逗她开心，展现高情商',
        time: '见面当天',
        location: '咖啡厅座位',
        characters: ['她', '他'],
        action: '展现个人魅力',
        background: '他很会聊天，让她觉得这个人很有趣很聪明'
      },
      { 
        name: '朋友圈的点赞互动', 
        description: '他每条朋友圈都会点赞评论，制造亲密感',
        time: '见面后的几天',
        location: '微信朋友圈',
        characters: ['她', '他'],
        action: '频繁互动',
        background: '他营造出很在意她的假象，让她误以为对方喜欢自己'
      },
      { 
        name: '暧昧的深夜通话', 
        description: '晚上11点他主动打电话，声音温柔撩人',
        time: '晚上11点',
        location: '各自房间',
        characters: ['她', '他'],
        action: '深夜通话',
        background: '他开始用声音营造暧昧氛围，让她陷入其中'
      },
      { 
        name: '甜蜜的昵称称呼', 
        description: '他开始叫她"小宝贝"，让她心跳加速',
        time: '认识一周后',
        location: '微信聊天',
        characters: ['她', '他'],
        action: '使用亲密称呼',
        background: '他用昵称让她以为关系在发展，实际只是撩妹技巧'
      },
      { 
        name: '第二次约会', 
        description: '他约她看电影，选了一部浪漫爱情片',
        time: '周六晚上',
        location: '电影院',
        characters: ['她', '他'],
        action: '看电影约会',
        background: '他很会营造浪漫氛围，但只是为了推进关系'
      },
      { 
        name: '电影院的手牵手', 
        description: '看恐怖片时他主动牵起她的手',
        time: '电影进行中',
        location: '电影院座位',
        characters: ['她', '他'],
        action: '牵手',
        background: '他利用恐怖情节制造身体接触的机会'
      },
      { 
        name: '电影后的拥抱', 
        description: '电影结束后他给了她一个拥抱',
        time: '电影结束后',
        location: '电影院门口',
        characters: ['她', '他'],
        action: '拥抱告别',
        background: '他的拥抱让她更加确信对方对她有意思'
      },
      { 
        name: '朋友聚会的排除', 
        description: '他朋友聚会时没有邀请她参加',
        time: '周五晚上',
        location: '他的朋友聚会',
        characters: ['他', '他的朋友们'],
        action: '刻意排除',
        background: '她通过朋友圈看到他和朋友聚会，意识到自己被排除在外'
      },
      { 
        name: '追问关系的回避', 
        description: '她试探性询问关系，他用玩笑敷衍过去',
        time: '某个晚上',
        location: '微信聊天',
        characters: ['她', '他'],
        action: '逃避关系话题',
        background: '她开始察觉不对劲，但他很擅长转移话题'
      },
      { 
        name: '忽冷忽热的态度', 
        description: '有时热情有时冷淡，让她摸不透',
        time: '第二周',
        location: '日常聊天中',
        characters: ['她', '他'],
        action: '情绪化回应',
        background: '他开始展现忽冷忽热的态度，让她更加迷恋'
      },
      { 
        name: '深夜的情绪倾诉', 
        description: '他向她倾诉工作压力，寻求情绪支持',
        time: '深夜12点',
        location: '微信聊天',
        characters: ['她', '他'],
        action: '寻求情绪价值',
        background: '他开始利用她的善良，获取免费的情绪支持'
      },
      { 
        name: '她的全心回应', 
        description: '她认真安慰他，提供情绪价值',
        time: '深夜聊天中',
        location: '她的房间',
        characters: ['她', '他'],
        action: '提供情绪支持',
        background: '她以为这是亲密关系的表现，全心全意地安慰他'
      },
      { 
        name: '朋友的提醒', 
        description: '闺蜜提醒她这个男生可能只是在玩',
        time: '周末下午',
        location: '咖啡厅',
        characters: ['她', '闺蜜'],
        action: '朋友劝告',
        background: '闺蜜察觉到这段关系的不正常，开始提醒她'
      },
      { 
        name: '内心的矛盾挣扎', 
        description: '她在朋友的提醒和自己的感觉之间纠结',
        time: '当晚',
        location: '她的房间',
        characters: ['她'],
        action: '内心独白',
        background: '她开始怀疑，但又舍不得这段关系'
      },
      { 
        name: '试探性的质疑', 
        description: '她小心翼翼地问他是不是在玩弄感情',
        time: '某天晚上',
        location: '微信聊天',
        characters: ['她', '他'],
        action: '质疑动机',
        background: '她鼓起勇气询问，但措辞很小心'
      },
      { 
        name: '巧妙的否认', 
        description: '他巧妙地否认并反过来指责她想太多',
        time: '质疑后',
        location: '微信聊天',
        characters: ['她', '他'],
        action: '反向指责',
        background: '他很会操控话语，让她觉得是自己的问题'
      },
      { 
        name: '自我怀疑的开始', 
        description: '她开始怀疑是不是自己想多了',
        time: '争执后',
        location: '她的内心',
        characters: ['她'],
        action: '自我怀疑',
        background: '他的话术让她开始质疑自己的判断'
      },
      { 
        name: '继续提供情绪价值', 
        description: '尽管有疑虑，她还是继续安慰他',
        time: '接下来几天',
        location: '微信聊天',
        characters: ['她', '他'],
        action: '继续付出',
        background: '她放下疑虑，继续在这段关系中付出'
      },
      { 
        name: '他的享受态度', 
        description: '他习以为常地接受她的关心',
        time: '关系进行中',
        location: '他的内心',
        characters: ['他'],
        action: '享受付出',
        background: '他把她的关心当作理所当然，没有任何愧疚'
      },
      { 
        name: '偶然的真相发现', 
        description: '她无意中发现他和其他女生的暧昧聊天',
        time: '某个午后',
        location: '意外发现',
        characters: ['她'],
        action: '发现真相',
        background: '通过某种方式，她看到了他的真实面目'
      },
      { 
        name: '震惊与愤怒', 
        description: '她震惊于他的虚伪，内心愤怒不已',
        time: '发现真相后',
        location: '她的房间',
        characters: ['她'],
        action: '情绪爆发',
        background: '真相让她彻底清醒，愤怒和失望涌上心头'
      },
      { 
        name: '理性的觉醒', 
        description: '她开始理性分析这段关系的本质',
        time: '冷静后',
        location: '她的内心',
        characters: ['她'],
        action: '理性分析',
        background: '愤怒过后，她开始冷静地看待这段关系'
      },
      { 
        name: '决定断联的勇气', 
        description: '她鼓起勇气决定彻底断联',
        time: '思考后',
        location: '她的房间',
        characters: ['她'],
        action: '做出决定',
        background: '她认识到只有断联才能保护自己'
      },
      { 
        name: '断联的执行', 
        description: '她删除了他的微信，拉黑了所有联系方式',
        time: '决定后',
        location: '手机操作',
        characters: ['她'],
        action: '断绝联系',
        background: '她坚决地执行了断联决定'
      },
      { 
        name: '他的意外反应', 
        description: '他发现被删除后感到意外，试图通过其他方式联系',
        time: '断联后',
        location: '他的焦虑',
        characters: ['他'],
        action: '尝试挽回',
        background: '失去情绪垃圾桶让他感到不适应'
      },
      { 
        name: '她的坚持', 
        description: '面对他的联系尝试，她坚持不回应',
        time: '断联后几天',
        location: '她的坚持',
        characters: ['她'],
        action: '坚持断联',
        background: '她意识到回应就是重新陷入循环'
      },
      { 
        name: '内在力量的成长', 
        description: '她发现自己比想象中更强大',
        time: '断联一周后',
        location: '她的内心',
        characters: ['她'],
        action: '自我成长',
        background: '独立生活让她重新认识自己的力量'
      },
      { 
        name: '重新定义爱情', 
        description: '她对真正的爱情有了新的认知',
        time: '反思期间',
        location: '她的思考',
        characters: ['她'],
        action: '重新认知',
        background: '这段经历让她明白什么是真正值得的爱情'
      }
    ];
  }

  /**
   * 生成剧本012的30个场景 - 毕业前的最后一天
   */
  generateScript012Scenes() {
    return [
      { 
        name: '图书馆初次相遇', 
        description: '在安静的图书馆里，她注意到坐在对面的他',
        time: '下午2点',
        location: '大学图书馆',
        characters: ['她', '他'],
        action: '初次相遇',
        background: '大三的图书馆里，她被他专注学习的样子吸引'
      },
      { 
        name: '借书偶遇', 
        description: '在书架前他们同时伸手拿同一本书',
        time: '下午3点',
        location: '图书馆书架区',
        characters: ['她', '他'],
        action: '偶然互动',
        background: '一本心理学书籍成为他们对话的开始'
      },
      { 
        name: '咖啡厅谈话', 
        description: '他邀请她到咖啡厅聊天，气氛轻松愉快',
        time: '下午4点',
        location: '校园咖啡厅',
        characters: ['她', '他'],
        action: '深入交流',
        background: '从学术讨论到个人兴趣，他们聊得很投机'
      },
      { 
        name: '微信好友添加', 
        description: '分别时他们加了微信，开始线上交流',
        time: '当天晚上',
        location: '各自宿舍',
        characters: ['她', '他'],
        action: '建立联系',
        background: '他主动要了她的微信，让她有些小兴奋'
      },
      { 
        name: '深夜的长聊', 
        description: '从晚上10点聊到凌晨2点，无话不谈',
        time: '深夜10点-凌晨2点',
        location: '各自宿舍',
        characters: ['她', '他'],
        action: '深夜聊天',
        background: '他们分享彼此的生活、梦想和烦恼'
      },
      { 
        name: '校园漫步', 
        description: '第二天他约她在校园里散步',
        time: '傍晚6点',
        location: '校园小径',
        characters: ['她', '他'],
        action: '浪漫漫步',
        background: '夕阳下的校园格外美丽，他们的关系在升温'
      },
      { 
        name: '食堂一起吃饭', 
        description: '他们开始经常一起在食堂吃饭',
        time: '中午12点',
        location: '学校食堂',
        characters: ['她', '他'],
        action: '日常相处',
        background: '像情侣一样的日常让她很享受'
      },
      { 
        name: '图书馆同桌学习', 
        description: '他们成为图书馆的固定同桌',
        time: '每天下午',
        location: '图书馆固定座位',
        characters: ['她', '他'],
        action: '一起学习',
        background: '她喜欢他在身边学习的感觉'
      },
      { 
        name: '第一次身体接触', 
        description: '看电影时他无意间碰到她的手',
        time: '周五晚上',
        location: '电影院',
        characters: ['她', '他'],
        action: '身体接触',
        background: '简单的触碰让她心跳加速'
      },
      { 
        name: '暧昧的玩笑', 
        description: '他开始说一些暧昧的玩笑话',
        time: '日常聊天中',
        location: '微信聊天',
        characters: ['她', '他'],
        action: '暧昧调情',
        background: '他的话让她误以为关系在发展'
      },
      { 
        name: '朋友的误会', 
        description: '朋友们都以为他们在交往',
        time: '某天聚餐',
        location: '校外餐厅',
        characters: ['她', '他', '朋友们'],
        action: '被误认为情侣',
        background: '朋友们的调侃让她既开心又尴尬'
      },
      { 
        name: '他的回避态度', 
        description: '当朋友询问关系时，他选择回避',
        time: '聚餐现场',
        location: '餐厅',
        characters: ['她', '他', '朋友们'],
        action: '回避话题',
        background: '他的回避让她开始感到不安'
      },
      { 
        name: '夜晚的拥抱', 
        description: '送她回宿舍时，他给了她一个拥抱',
        time: '晚上10点',
        location: '女生宿舍楼下',
        characters: ['她', '他'],
        action: '拥抱告别',
        background: '这个拥抱让她以为关系有了突破'
      },
      { 
        name: '期待确认关系', 
        description: '她开始期待他正式表白',
        time: '拥抱后的夜晚',
        location: '她的宿舍',
        characters: ['她'],
        action: '内心期待',
        background: '她觉得关系已经很明显了，等待他的表白'
      },
      { 
        name: '试探性的询问', 
        description: '她小心地询问他们的关系',
        time: '某天晚上',
        location: '微信聊天',
        characters: ['她', '他'],
        action: '试探关系',
        background: '她鼓起勇气想要确认关系'
      },
      { 
        name: '模糊的回应', 
        description: '他给出模糊的回答，没有明确表态',
        time: '询问后',
        location: '微信聊天',
        characters: ['她', '他'],
        action: '模糊回应',
        background: '他的回答让她更加困惑'
      },
      { 
        name: '继续暧昧状态', 
        description: '尽管没有确认关系，他们继续暧昧相处',
        time: '接下来几周',
        location: '校园各处',
        characters: ['她', '他'],
        action: '维持暧昧',
        background: '她选择继续这种不明不白的关系'
      },
      { 
        name: '内心的纠结', 
        description: '她在确定和不确定之间痛苦纠结',
        time: '深夜独处时',
        location: '她的宿舍',
        characters: ['她'],
        action: '内心挣扎',
        background: '她不知道该坚持还是放弃'
      },
      { 
        name: '闺蜜的关心', 
        description: '室友看出她的纠结，给出建议',
        time: '某天晚上',
        location: '宿舍卧谈会',
        characters: ['她', '室友'],
        action: '朋友建议',
        background: '室友提醒她不要在这种关系中消耗自己'
      },
      { 
        name: '毕业季的临近', 
        description: '随着毕业临近，她更加焦虑关系问题',
        time: '临近毕业',
        location: '校园',
        characters: ['她'],
        action: '时间压迫',
        background: '毕业意味着分离，她希望有个结果'
      },
      { 
        name: '最后的表白', 
        description: '毕业前她决定最后一次表白',
        time: '毕业前一周',
        location: '校园湖边',
        characters: ['她', '他'],
        action: '主动表白',
        background: '她不想带着遗憾毕业'
      },
      { 
        name: '委婉的拒绝', 
        description: '他委婉地拒绝了她，说不想影响友谊',
        time: '表白现场',
        location: '校园湖边',
        characters: ['她', '他'],
        action: '委婉拒绝',
        background: '他的拒绝让她彻底死心'
      },
      { 
        name: '友谊的空洞', 
        description: '他提议继续做朋友，但她知道已经回不去了',
        time: '拒绝后',
        location: '校园湖边',
        characters: ['她', '他'],
        action: '维持表面友谊',
        background: '所谓的友谊在表白后变得尴尬'
      },
      { 
        name: '朋友露营的邀请', 
        description: '朋友邀请她参加毕业露营散心',
        time: '被拒绝后几天',
        location: '宿舍',
        characters: ['她', '朋友'],
        action: '邀请散心',
        background: '朋友想帮她走出情感阴霾'
      },
      { 
        name: '露营的温暖', 
        description: '在露营中她感受到朋友们的温暖陪伴',
        time: '周末',
        location: '郊外露营地',
        characters: ['她', '朋友们'],
        action: '感受友谊',
        background: '真正的朋友让她看到另一种美好'
      },
      { 
        name: '内心的觉醒', 
        description: '她意识到一直在追求虚假的关系',
        time: '露营夜晚',
        location: '篝火旁',
        characters: ['她'],
        action: '内心觉醒',
        background: '对比真假关系，她有了新的认知'
      },
      { 
        name: '删除的决定', 
        description: '回到学校后，她决定删除他的联系方式',
        time: '露营回来',
        location: '她的宿舍',
        characters: ['她'],
        action: '删除联系',
        background: '她选择彻底结束这段无望的关系'
      },
      { 
        name: '最幸福时的告别', 
        description: '她在自己最幸福的时候选择告别',
        time: '删除当天',
        location: '她的内心',
        characters: ['她'],
        action: '主动告别',
        background: '她明白在最好的时候离开才不会留下更多遗憾'
      },
      { 
        name: '重新出发的勇气', 
        description: '她鼓起勇气开始新的生活',
        time: '毕业前最后几天',
        location: '校园',
        characters: ['她'],
        action: '重新开始',
        background: '删除了他之后，她反而感到轻松'
      },
      { 
        name: '毕业典礼的释然', 
        description: '毕业典礼上，她带着释然的心情告别校园',
        time: '毕业典礼',
        location: '学校礼堂',
        characters: ['她', '同学们'],
        action: '毕业告别',
        background: '她学会了在无名关系中保护自己，这是最好的成长'
      }
    ];
  }

  /**
   * 新增：通过API拉取剧本列表
   * @returns {Promise<Array>} 剧本列表（已适配字段）
   */
  async fetchAllScriptsFromAPI() {
    const app = getApp();
    const apiURL = app.globalData.apiURL || '';
    try {
      const res = await new Promise((resolve, reject) => {
        wx.request({
          url: apiURL + '/api/scripts',
          method: 'GET',
          success: resolve,
          fail: reject
        });
      });
      if (res.statusCode === 200 && res.data && Array.isArray(res.data.list)) {
        // 字段适配
        return res.data.list.map(item => {
          let coverImage = '/assets/scripts_list/default.jpeg';
          if (item.image_url) {
            // API返回的是完整URL，直接使用
            coverImage = item.image_url;
          }
          return {
            id: item.id,
            title: item.title,
            description: item.content || '', // 添加description字段
            tags: item.tag ? item.tag.split(',') : [],
            cover: coverImage, // 使用cover字段名，与WXML模板保持一致
            createTime: item.created_at,
            updateTime: item.updated_at
          };
        });
      } else {
        throw new Error('API返回格式错误');
      }
    } catch (error) {
      console.error('fetchAllScriptsFromAPI error:', error);
      return [];
    }
  }

  /**
   * 新增：通过API拉取剧本详情
   * @param {number|string} id 剧本ID
   * @returns {Promise<Object|null>} 剧本详情（已适配字段）
   */
  async fetchScriptDetailFromAPI(id) {
    const app = getApp();
    const apiURL = app.globalData.apiURL || '';
    try {
      const res = await new Promise((resolve, reject) => {
        wx.request({
          url: apiURL + '/api/scripts/' + id,
          method: 'GET',
          success: resolve,
          fail: reject
        });
      });
      if (res.statusCode === 200 && res.data && res.data.id) {
        // 字段适配
        const item = res.data;
        // 解析AI生成内容
        let scenes = [];
        let roles = [];
        if (item.result_json) {
          try {
            const result = typeof item.result_json === 'string' ? JSON.parse(item.result_json) : item.result_json;
            scenes = result.scripts || [];
            roles = result.roles || [];
          } catch (e) {
            scenes = [];
            roles = [];
          }
        }
        let coverImage = '/assets/scripts_list/default.jpeg';
        if (item.image_url) {
          // API返回的是完整URL，直接使用
          coverImage = item.image_url;
        }
        return {
          id: item.id,
          title: item.title,
          tags: item.tag ? item.tag.split(',') : [],
          coverImage,
          description: item.content,
          mainCharacters: roles,
          scenes: scenes,
          createTime: item.created_at,
          updateTime: item.updated_at
        };
      } else {
        throw new Error('API返回格式错误');
      }
    } catch (error) {
      console.error('fetchScriptDetailFromAPI error:', error);
      return null;
    }
  }
}

// 导出类，使用单例模式
module.exports = ScriptManager; 