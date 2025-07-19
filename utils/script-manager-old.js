/**
 * 剧本数据管理器
 * 负责剧情文件解析、剧本生成和场景管理
 */

class ScriptManager {
  constructor() {
    this.scriptDatabase = {};
    this.initializeScripts();
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
        sceneList: [],
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
        sceneList: [],
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
        sceneList: [],
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
        sceneList: [],
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
        sceneList: [],
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
        sceneList: [],
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
        sceneList: [],
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
        sceneList: [],
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
        sceneList: [],
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
        sceneList: [],
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
   * 获取剧本数据
   */
  getScript(scriptId) {
    return this.scriptDatabase[scriptId] || null;
  }

  /**
   * 获取格式化的标签数据
   * @param {string} scriptId - 剧本ID
   * @returns {Object} 包含人群标签和情感标签的对象
   */
  getFormattedTags(scriptId) {
    const script = this.getScript(scriptId);
    if (!script || !script.tags) {
      return { roleTag: '', emotionTags: [] };
    }

    const tags = script.tags;
    const roleTag = tags[0]; // 第一个是人群标签
    const emotionTags = tags.slice(1, 4); // 最多取3个情感标签

    return {
      roleTag,
      emotionTags
    };
  }

  /**
   * 获取所有剧本列表
   */
  getAllScripts() {
    return Object.values(this.scriptDatabase);
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
   * 生成剧本001的30个场景
   */
  generateScript001Scenes() {
    return [
      { name: '初次相遇', description: '在某个平凡的午后，他们的目光第一次相遇' },
      { name: '心动时刻', description: '她的一个微笑让他心跳加速，暗恋的种子悄然种下' },
      { name: '默默关注', description: '他开始留意她的一切，记住她喜欢的每一个细节' },
      { name: '偶然交集', description: '一次巧合的机会，他们有了简短的对话' },
      { name: '朋友圈窥探', description: '他反复查看她的朋友圈，猜测她的心情' },
      { name: '小心翼翼', description: '他小心翼翼地维持着朋友的距离，不敢表露心意' },
      { name: '陪伴时光', description: '他总是默默出现在她需要的时候，给予温暖的陪伴' },
      { name: '深夜谈心', description: '深夜的长谈让他们的关系更进一步' },
      { name: '暧昧边缘', description: '他们在友情和爱情的边界线上小心试探' },
      { name: '内心煎熬', description: '他在告白和沉默之间痛苦挣扎' },
      { name: '鼓起勇气', description: '经过无数次的内心斗争，他决定说出心里话' },
      { name: '湖边约会', description: '他约她到湖边，准备进行那次重要的对话' },
      { name: '夕阳西下', description: '金色的夕阳为这个重要时刻染上温柔的色彩' },
      { name: '紧张告白', description: '他颤抖着问出了那个藏在心底很久的问题' },
      { name: '沉默回应', description: '她的沉默让空气凝固，时间仿佛停止' },
      { name: '模糊答案', description: '"我不知道"这个答案既给了希望又带来失落' },
      { name: '感激表达', description: '她表达了感激但也透露了内心的迷茫' },
      { name: '五月约定', description: '他们约定五月再见，给彼此一些时间思考' },
      { name: '分别时刻', description: '带着复杂的心情，他们暂时告别' },
      { name: '等待期间', description: '漫长的等待中，他重复回味着她的每一句话' },
      { name: '社交媒体', description: '他默默关注着她的动态，却不敢点赞评论' },
      { name: '内心独白', description: '他在心中反复琢磨她话语的真正含义' },
      { name: '五月来临', description: '约定的时间到了，他怀着忐忑的心情发出信息' },
      { name: '已读未回', description: '信息显示已读但没有回复，让他心情跌入谷底' },
      { name: '残酷真相', description: '她最终的回复揭示了关系的本质' },
      { name: '现实接受', description: '面对现实，他开始学会接受这个结果' },
      { name: '自我反思', description: '他思考这段经历对自己的意义' },
      { name: '放下过程', description: '虽然痛苦，但他开始学会放下' },
      { name: '成长领悟', description: '在痛苦中，他获得了关于爱情和人生的领悟' },
      { name: '重新开始', description: '带着这段美好而痛苦的回忆，他重新开始生活' }
    ];
  }

  /**
   * 生成剧本002的30个场景
   */
  generateScript002Scenes() {
    return [
      { name: '机场相遇', description: '她飞到他的城市，机场的拥抱温暖而熟悉' },
      { name: '甜蜜同居', description: '在他的公寓里，他们像情侣一样相处' },
      { name: '亲密称呼', description: '他叫她"宝贝"，让她以为关系很确定' },
      { name: '朋友圈合照', description: '他们一起拍照，她以为会发朋友圈昭告天下' },
      { name: '隐藏设置', description: '她发现合照被设置部分人不可见，心情复杂' },
      { name: '公司楼下', description: '她在他实习公司楼下等他下班，体验日常' },
      { name: '压马路', description: '他们牵手在街上漫步，享受平凡的幸福' },
      { name: '电影约会', description: '电影院里分享爆米花的温馨时光' },
      { name: '圣诞大巴', description: '圣诞节在大巴车上的甜蜜合影' },
      { name: '身体亲密', description: '关系进一步发展，她以为这意味着确定' },
      { name: '态度转变', description: '亲密后他的态度开始微妙变化' },
      { name: '回复变慢', description: '他回复消息的速度明显变慢了' },
      { name: '主动联系', description: '总是她主动发起对话，感到疲惫' },
      { name: '敷衍回应', description: '他的回复越来越敷衍，让她困惑' },
      { name: '对话终结', description: '对话总是他先结束，她感到被忽视' },
      { name: '三天沉默', description: '三天没有联系，她开始质疑关系' },
      { name: '内心挣扎', description: '她纠结是否应该主动联系他' },
      { name: '自我怀疑', description: '她开始怀疑是不是自己想太多了' },
      { name: '朋友建议', description: '朋友提醒她这段关系的不正常' },
      { name: '模式识别', description: '她开始意识到这种相处模式的问题' },
      { name: '关系审视', description: '重新审视他们之间的互动模式' },
      { name: '红旗信号', description: '识别出关系中的各种红色信号' },
      { name: '内心对话', description: '她与内心的自己进行深度对话' },
      { name: '价值认知', description: '重新认识自己在关系中的价值' },
      { name: '边界意识', description: '开始建立健康的关系边界意识' },
      { name: '决断时刻', description: '面临是否继续这段关系的重要选择' },
      { name: '自我救赎', description: '选择为自己的幸福负责' },
      { name: '关系终结', description: '勇敢地结束这段模糊的关系' },
      { name: '成长蜕变', description: '在痛苦中获得关于爱情的新认知' },
      { name: '重塑自我', description: '重新定义自己在感情中的标准和底线' }
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
}

// 创建全局实例
const scriptManager = new ScriptManager();

module.exports = ScriptManager;

// 导出全局实例
if (typeof getApp !== 'undefined') {
  getApp().globalData = getApp().globalData || {};
  getApp().globalData.scriptManager = scriptManager;
} 