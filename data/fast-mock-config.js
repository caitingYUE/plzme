/**
 * 快速Mock数据配置文件
 * 专门优化响应速度，预加载常用数据
 */

const { getGlobalOptimizer } = require('../utils/performance-optimizer');

class FastMockConfig {
  constructor() {
    this.optimizer = getGlobalOptimizer();
    this.enableInstantResponse = true;
    this.preloadedScenes = new Map();
    this.preloadedDialogues = new Map();
    this.init();
  }

  /**
   * 初始化快速Mock配置
   */
  init() {
    console.log('🚀 初始化快速Mock配置...');
    this.preloadCommonScenes();
    this.preloadCommonDialogues();
    this.setupFastRoutes();
    console.log('✅ 快速Mock配置初始化完成');
  }

  /**
   * 预加载常用场景 - 基于《我们现在是什么关系》剧本
   */
  preloadCommonScenes() {
    const commonScenes = [
      {
        id: 1,
        title: '微信聊天 - 晚安时刻',
        fastData: {
          aiMessage: '宝贝，睡了吗？今天好累啊，刚加完班。😴',
          choices: [
            { 
              id: 'A', 
              title: '温和试探 - 提旧事',
              text: '还没睡呢，辛苦啦~ 对了，忽然想起去年圣诞那张牵手照拍得真好，好怀念呀。你当时发朋友圈，是不是只给我看的呀？😊',
              potentialImpact: '可能引导他回忆/解释，也可能让他警觉你在翻旧账',
              response: '啊？为什么突然问这个...😅 那个...我不太记得当时的设置了，应该是所有人都能看的吧？可能你看到的比较早？'
            },
            { 
              id: 'B', 
              title: '直接质问 - 带情绪',
              text: '刚看到手机相册。那张圣诞牵手照，你当时发朋友圈是设了仅我可见吧？为什么？🫤',
              potentialImpact: '直接引爆冲突点，可能引发防御或争吵',
              response: '额...你怎么会这样想？我没有设置什么特殊权限啊...可能是系统问题？别想太多了。'
            },
            { 
              id: 'C', 
              title: '回避问题 - 转移话题',
              text: '还没呢。加班这么晚啊，吃饭了吗？我给你点个外卖？❤️',
              potentialImpact: '暂时回避冲突，但内心焦虑未解决，可能积累怨气',
              response: '不用啦宝贝，在公司楼下随便吃了碗面。今天PPT改到吐，客户真是...😮‍💨 你真好，还想着我。早点休息？明天一早还有个会。'
            }
          ]
        }
      },
      {
        id: 2,
        title: '异地恋的试探',
        fastData: {
          aiMessage: '我也没事做...好久没见你了，要不我明天飞过去找你？我们去看新上的那部电影？',
          choices: [
            { 
              id: 'A', 
              title: '热情回应',
              text: '好啊！我来接你，明天下午我没事。',
              potentialImpact: '表现出对见面的期待，加深感情',
              response: '太好了！那我订票，你发个定位给我。真的好想见你。'
            },
            { 
              id: 'B', 
              title: '犹豫推脱',
              text: '啊？明天吗？这么突然...😅 这周真的太累了宝贝，下周还有个重要汇报要准备...',
              potentialImpact: '可能让对方感受到冷淡和不被重视',
              response: '(撤回了一条消息) 我是说...怕你来了我也没法好好陪你🤗 要不...等下周末？我提前安排好时间？🥺'
            },
            { 
              id: 'C', 
              title: '直接拒绝',
              text: '抱歉宝贝，明天真的不行，公司有紧急项目。',
              potentialImpact: '明确拒绝，可能引发关系危机',
              response: '又是工作...我们已经好久没见面了。什么时候才能有时间给我？'
            }
          ]
        }
      },
      {
        id: 3,
        title: '关系定义的摊牌',
        fastData: {
          aiMessage: '在干嘛呢？刚开完会喘口气~ ☕',
          choices: [
            { 
              id: 'A', 
              title: '委婉表达',
              text: '以后还是别用【宝贝】这样的词来称呼吧，我们又没有确定关系，这样我会很容易误会。',
              potentialImpact: '直接触及关系核心问题，可能促使对方表态',
              response: '啊？怎么突然说这个... (正在输入超过1分钟) 我们...不是一直很好吗？😅 别多想啊！等见面我们好好聊！'
            },
            { 
              id: 'B', 
              title: '直接质问',
              text: '我们到底是什么关系？你总是叫我宝贝，但从来不说我是不是你女朋友。',
              potentialImpact: '强势要求答案，可能引发激烈对话',
              response: '这个...我觉得我们现在这样挺好的啊...为什么一定要贴标签呢？我对你的感情你应该能感受到的。'
            },
            { 
              id: 'C', 
              title: '情感表达',
              text: '我想清楚了，我们只适合作为普通朋友，那些模糊不清的话也不要再跟我说了。',
              potentialImpact: '主动结束暧昧关系，保护自己',
              response: '等等...别这样。我...我真的...(攥紧袖口) 你给我点时间，我会想清楚的。'
            }
          ]
        }
      }
    ];

    commonScenes.forEach(scene => {
      this.preloadedScenes.set(scene.id, scene.fastData);
    });

    console.log(`📦 预加载了${commonScenes.length}个常用场景`);
  }

  /**
   * 预加载常用对话 - 情感关系主题
   */
  preloadCommonDialogues() {
    const commonDialogues = [
      {
        trigger: ['关系', '我们', '什么关系'],
        responses: [
          '我们...不是一直很好吗？为什么一定要给关系贴标签呢？',
          '我觉得我们现在这样挺好的啊，你不这样认为吗？',
          '我对你的感情你应该能感受到的，不是吗？'
        ]
      },
      {
        trigger: ['朋友圈', '看到', '权限'],
        responses: [
          '我没有设置什么特殊权限啊...可能是系统问题？',
          '奇怪，我发朋友圈从来不设权限的，可能是网络延迟？',
          '你怎么会这样想？我对你还会有所保留吗？'
        ]
      },
      {
        trigger: ['见面', '过来', '飞过去'],
        responses: [
          '最近工作真的很忙，下周末怎么样？我提前安排好时间。',
          '我也想见你，但这周确实有很多事情要处理...',
          '你突然要过来，我怕没法好好陪你。'
        ]
      },
      {
        trigger: ['累', '忙', '工作'],
        responses: [
          '你真好，还想着我。工作确实有点忙，但还好啦。',
          '最近项目比较紧，不过看到你的消息就不累了。',
          '是有点累，但和你聊天就好多了。'
        ]
      },
      {
        trigger: ['宝贝', '亲爱的', '称呼'],
        responses: [
          '我一直都这样叫你啊...你不喜欢吗？',
          '这个称呼不是很自然吗？我们关系不是挺好的嘛。',
          '我叫你宝贝有什么问题吗？这不是很正常的吗？'
        ]
      },
      {
        trigger: ['分手', '结束', '算了'],
        responses: [
          '等等...别这样。你给我点时间，让我想想。',
          '我们好好的，为什么要说这种话？',
          '你是不是误会了什么？我们谈谈好吗？'
        ]
      }
    ];

    commonDialogues.forEach((dialogue, index) => {
      this.preloadedDialogues.set(`dialogue_${index}`, dialogue);
    });

    console.log(`💬 预加载了${commonDialogues.length}组常用对话`);
  }

  /**
   * 设置快速路由
   */
  setupFastRoutes() {
    this.fastRoutes = {
      '/api/scenes/:id': (sceneId) => this.getFastSceneData(sceneId),
      '/api/chat': (params) => this.getFastChatResponse(params),
      '/api/choices': (params) => this.getFastChoiceResponse(params),
      '/api/scripts': () => this.getFastScriptList()
    };
  }

  /**
   * 获取快速场景数据
   */
  getFastSceneData(sceneId) {
    const numericId = parseInt(sceneId);
    
    // 1. 优先从预加载缓存获取
    if (this.preloadedScenes.has(numericId)) {
      return {
        success: true,
        data: {
          id: numericId,
          ...this.preloadedScenes.get(numericId)
        },
        responseTime: 5,
        fromCache: true,
        fastMode: true
      };
    }

    // 2. 生成快速场景数据
    return {
      success: true,
      data: {
        id: numericId,
        title: `场景 ${numericId}`,
        aiMessage: this.generateFastMessage(numericId),
        choices: this.generateFastChoices(numericId)
      },
      responseTime: 10,
      fromCache: false,
      fastMode: true
    };
  }

  /**
   * 获取快速聊天响应
   */
  getFastChatResponse(params) {
    const { message, sceneId, context } = params;
    
    // 1. 检查预加载的对话模板
    for (const [key, dialogue] of this.preloadedDialogues) {
      const isMatch = dialogue.trigger.some(trigger => 
        message.toLowerCase().includes(trigger.toLowerCase())
      );
      
      if (isMatch) {
        const responses = dialogue.responses;
        const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
        
        return {
          success: true,
          content: selectedResponse,
          message: selectedResponse,
          responseTime: 15,
          fromCache: true,
          fastMode: true,
          matched: key
        };
      }
    }

    // 2. 生成智能快速响应
    return {
      success: true,
      content: this.generateSmartResponse(message, context),
      message: this.generateSmartResponse(message, context),
      responseTime: 25,
      fromCache: false,
      fastMode: true
    };
  }

  /**
   * 获取快速选择响应
   */
  getFastChoiceResponse(params) {
    const { choice, sceneId, choiceText } = params;
    
    const responses = [
      `你选择了"${choiceText}"，这是一个很有意思的选择。`,
      `我理解你为什么会选择"${choiceText}"。`,
      `"${choiceText}"这个选择反映了你内心的想法。`,
      `让我们看看选择"${choiceText}"会带来什么结果。`
    ];

    const selectedResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      success: true,
      content: selectedResponse,
      nextScene: parseInt(sceneId) + 1,
      responseTime: 8,
      fromCache: false,
      fastMode: true
    };
  }

  /**
   * 获取快速剧本列表
   */
  getFastScriptList() {
    const scripts = [
      {
        id: 'script_001',
        title: '初次相遇',
        description: '关于第一印象的心理探索',
        duration: 30,
        difficulty: '入门',
        cover: '/assets/scripts_list/001.jpeg'
      },
      {
        id: 'script_002',
        title: '我们到底是什么关系？',
        description: '探索关系边界的深度剧本',
        duration: 45,
        difficulty: '进阶',
        cover: '/assets/scripts_list/002.jpeg'
      },
      {
        id: 'script_003',
        title: '内心的声音',
        description: '与自我对话的心理旅程',
        duration: 35,
        difficulty: '中级',
        cover: '/assets/scripts_list/003.jpeg'
      }
    ];

    return {
      success: true,
      data: scripts,
      responseTime: 12,
      fromCache: true,
      fastMode: true
    };
  }

  /**
   * 生成快速消息
   */
  generateFastMessage(sceneId) {
    const messages = [
      '让我们继续这个话题，你现在的感受如何？',
      '我能感受到你内心的复杂情感，想聊聊吗？',
      '每个人的体验都不同，你的想法对我很重要。',
      '这是一个安全的空间，你可以放心表达真实的感受。',
      '我们慢慢来，不用急着做决定。'
    ];

    return messages[sceneId % messages.length];
  }

  /**
   * 生成快速选择
   */
  generateFastChoices(sceneId) {
    const choiceTemplates = [
      [
        { id: 'A', text: '我同意', response: '很好，我们继续深入探讨。' },
        { id: 'B', text: '我需要想想', response: '没关系，慢慢想，我等你。' },
        { id: 'C', text: '换个话题吧', response: '当然可以，你想聊什么？' }
      ],
      [
        { id: 'A', text: '是的，确实如此', response: '我理解你的想法。' },
        { id: 'B', text: '不完全是这样', response: '能详细说说你的看法吗？' },
        { id: 'C', text: '我不确定', response: '不确定也没关系，我们慢慢探索。' }
      ]
    ];

    return choiceTemplates[sceneId % choiceTemplates.length];
  }

  /**
   * 生成智能响应
   */
  generateSmartResponse(message, context) {
    const msgLower = message.toLowerCase();
    
    // 情感关键词匹配
    if (msgLower.includes('难过') || msgLower.includes('伤心')) {
      return '我能感受到你的伤心，这种感受很真实。要不要和我聊聊发生了什么？';
    } else if (msgLower.includes('高兴') || msgLower.includes('开心')) {
      return '看到你开心我也很高兴！是什么让你感到快乐呢？';
    } else if (msgLower.includes('生气') || msgLower.includes('愤怒')) {
      return '我理解你的愤怒，生气往往代表着在意。能说说让你生气的原因吗？';
    } else if (msgLower.includes('害怕') || msgLower.includes('恐惧')) {
      return '害怕是保护我们的本能反应。这里很安全，我们可以慢慢聊聊你的担忧。';
    } else {
      return '我听到了你的话，你的感受对我很重要。能再多分享一些你的想法吗？';
    }
  }

  /**
   * 启用/禁用即时响应
   */
  toggleInstantResponse(enabled = true) {
    this.enableInstantResponse = enabled;
    console.log(`${enabled ? '✅' : '❌'} 即时响应模式${enabled ? '已启用' : '已禁用'}`);
  }

  /**
   * 获取性能统计
   */
  getPerformanceStats() {
    return {
      preloadedScenes: this.preloadedScenes.size,
      preloadedDialogues: this.preloadedDialogues.size,
      fastRoutesCount: Object.keys(this.fastRoutes).length,
      instantResponseEnabled: this.enableInstantResponse,
      averageResponseTime: '< 50ms',
      cacheHitRate: '90%+'
    };
  }
}

// 创建全局快速Mock配置实例
let globalFastMockConfig = null;

function getGlobalFastMockConfig() {
  if (!globalFastMockConfig) {
    globalFastMockConfig = new FastMockConfig();
  }
  return globalFastMockConfig;
}

module.exports = {
  FastMockConfig,
  getGlobalFastMockConfig
}; 