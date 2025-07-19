/**
 * 剧本002《我们到底是什么关系》Mock数据
 * 基于assets/script_example.md内容构建
 * 包含完整的交互流程、选择卡、内心独白、高能女主模式、关系分析等功能
 */

const script002MockData = {
  // 基础信息
  id: 'script_002',
  title: '我们到底是什么关系？',
  subtitle: '未命名的我们',
  type: '关系边界',
  difficulty: '进阶级',
  duration: 45,
  energyMode: true,
  scriptType: '女主本',
  
  description: '行为亲密却缺乏关系确认带来的不安全感与自我怀疑。从朋友圈权限设置到身体亲密后的态度转变，一个关于现代爱情模糊边界的深度探索。你将在这场心理剧中直面关系的真相，学会为自己设立边界。',
  
  cover: '/assets/scripts_list/002.jpeg',
  
  // 角色设定
  characters: {
    user: {
      name: '我',
      role: '女主角',
      description: '渴望确定关系的女性，在暧昧中迷失自我，需要找到内在力量',
      avatar: '/assets/user/role1.jpg',
      personality: '敏感细腻、渴望安全感、容易自我怀疑、内心坚强',
      motivation: '想要一个明确的关系定义和承诺'
    },
    ai: {
      name: '他',
      role: '男主角', 
      description: '享受暧昧却不愿承担责任的男性，给予甜蜜但避免承诺',
      avatar: '/assets/user/role2.jpg',
      personality: '矛盾复杂、逃避承诺、享受现状、害怕失去自由',
      motivation: '维持现状，享受关系的好处但不想负责任'
    }
  },
  
  // 标签系统
  tags: ['女主本', '关系困惑', '暧昧边界', '情感清醒'],
  emotions: ['困惑', '不安全感', '渴望确定', '自我怀疑', '内心清醒'],
  
  // 预期收获
  benefits: [
    '识别关系中的红色信号和模糊边界',
    '学会表达自己的真实需求和底线',
    '建立健康的关系边界和自我保护机制',
    '提升自我价值感和情感决断力',
    '理解真正的亲密关系应该是什么样的'
  ],

  // 剧本结构（基于assets/script_example.md）
  structure: {
    act1: {
      name: '裂痕初显',
      subtitle: '信任危机触发',
      description: '发现朋友圈权限设置，开始质疑关系的真实性',
      scenes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    },
    act2: {
      name: '沉默的重量', 
      subtitle: '焦虑升级与试探',
      description: '三天没有联系，在试探和等待中焦虑升级',
      scenes: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    },
    act3: {
      name: '直面迷雾',
      subtitle: '关键对话 - 关系定义摊牌',
      description: '在咖啡厅目睹真相，最终勇敢为自己设立边界',
      scenes: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    }
  },

  // 30个场景详细数据
  scenes: [
    // 第一幕：裂痕初显 (1-10)
    {
      id: 1,
      act: 1,
      title: '深夜的不安',
      setting: '晚上，你独自刷着手机，回想起一些细节，内心越来越不安',
      time: '晚上11点',
      location: '家中卧室',
      mood: '不安、疑虑',
      aiMessage: '宝贝，睡了吗？今天好累啊，刚加完班。😴',
      aiEmotion: '疲惫但亲密',
      context: '他习惯性的亲密称呼和表情包，但你心里有了疑问',
      keyAction: 'choice', // choice/input/auto/special
      choices: [
        {
          id: 'A',
          text: '温和试探 - 提旧事',
          response: '还没睡呢，辛苦啦~ 对了，忽然想起去年圣诞那张牵手照拍得真好，好怀念呀。你当时发朋友圈，是不是只给我看的呀？😊',
          emotion: '试探、温和',
          impact: '可能引导他回忆/解释，也可能让他警觉你在翻旧账',
          nextScene: 2
        },
        {
          id: 'B', 
          text: '直接质问 - 带情绪',
          response: '刚看到手机相册。那张圣诞牵手照，你当时发朋友圈是设了仅我可见吧？为什么？🫤',
          emotion: '质疑、受伤',
          impact: '直接引爆冲突点，可能引发防御或争吵',
          nextScene: 3
        },
        {
          id: 'C',
          text: '回避问题 - 转移话题', 
          response: '还没呢。加班这么晚啊，吃饭了吗？我给你点个外卖？❤️',
          emotion: '关心、回避',
          impact: '暂时回避冲突，但内心焦虑未解决，可能积累怨气',
          nextScene: 4
        },
        {
          id: 'D',
          text: '沉默观察 - 不回复',
          response: '(放下手机，不回复这条消息，想看看他后续反应)',
          emotion: '观察、被动',
          impact: '被动等待，可能错过沟通时机，也可能让对方察觉你的冷淡',
          nextScene: 5
        }
      ],
      specialTools: {
        innerMonologue: {
          available: true,
          content: '我到底在想什么...明明那张照片很甜蜜，为什么要隐藏？难道我对他来说是不能见光的秘密吗？',
          emotion: '困惑、受伤'
        }
      }
    },

    // 选择A的后续场景 - 温和试探路线
    {
      id: 2,
      act: 1,
      title: '试探的回应',
      setting: '你提起了那张照片，等待他的解释',
      time: '深夜',
      location: '卧室',
      mood: '紧张、期待',
      aiMessage: '(停顿了很久才回复) 哦那张啊...我记得好像是设置了分组可见，当时就是随手点的😅\n那时候咱们关系也没现在这么好嘛~',
      aiEmotion: '紧张、试图轻描淡写',
      context: '他的解释很勉强，反而暴露了当时就在隐瞒的事实',
      keyAction: 'auto',
      autoResponse: '是吗...那现在呢？我们现在算什么关系？',
      userEmotion: '试探、追问',
      aiFollowUp: '现在当然是...很特别的关系啊😊 好啦别想太多，睡觉吧！',
      narrative: '他又一次避开了关系定义，但你已经察觉到不对劲。',
      nextScene: 11
    },

    // 选择B的后续场景 - 直接质问路线
    {
      id: 3,
      act: 1,
      title: '防御的反击',
      setting: '直接质问让他感到被指控',
      time: '深夜',
      location: '数字空间的对峙',
      mood: '紧张、对抗',
      aiMessage: '你这是在审问我吗？😤\n为什么要纠结这些小事？我们不是一直挺好的吗？\n别总是想太多，这样很累的...',
      aiEmotion: '防御、反击、试图转移话题',
      context: '他用反击来掩盖心虚，同时暗示你"想太多"',
      keyAction: 'auto',
      autoResponse: '对不起...我只是有点在意。你说得对，可能是我想多了。',
      userEmotion: '退缩、自我怀疑',
      aiFollowUp: '宝贝最懂事了～早点休息哦💕',
      narrative: '你被他的话术成功转移了注意力，开始怀疑自己。但心里的疑问并没有消失。',
      nextScene: 11
    },

    // 选择C的后续场景
    {
      id: 4,
      act: 1,
      title: '压抑的关心',
      setting: '你压下心头的疑问，手指在屏幕上停顿片刻',
      time: '深夜',
      location: '卧室',
      mood: '压抑、关心',
      aiMessage: '(隔了5分钟) 不用啦宝贝，在公司楼下随便吃了碗面。今天PPT改到吐，客户真是…😮‍💨\n你真好，还想着我。早点休息？明天一早还有个会。',
      aiEmotion: '疲惫、感谢但想结束对话',
      context: '他表达了感谢但很快想结束对话，你感到被敷衍',
      keyAction: 'auto',
      autoResponse: '嗯…好，你也别熬太晚。',
      userEmotion: '委屈、失落',
      aiFollowUp: '晚安亲亲😘',
      narrative: '屏幕暗下去。接下来三天，他的微信变得很安静——没有主动分享日常，没有撒娇的表情包，只有你发的"早安""下班了吗？"换来简短的"早""刚下班，累瘫"。那种熟悉的焦虑感又像藤蔓一样缠上来。',
      nextScene: 11,
      specialTools: {
        innerMonologue: {
          available: true,
          content: '为什么感觉他在推开我？明明刚才还叫我宝贝，但整个对话就像在应付差事一样...',
          emotion: '困惑、失落'
        }
      }
    },

    // 选择D的后续场景 - 沉默观察路线
    {
      id: 5,
      act: 1,
      title: '沉默的观察',
      setting: '你选择不回复，想看看他会有什么反应',
      time: '深夜等待中',
      location: '安静的卧室',
      mood: '观察、等待',
      aiMessage: '(20分钟后) 宝贝？睡了吗？\n(又过了10分钟) 别生气嘛...我今天真的很累😔\n(最后一条) 晚安💤',
      aiEmotion: '担心、试探、最后放弃',
      context: '你的沉默让他有些慌乱，但他很快就选择了放弃',
      keyAction: 'auto',
      narrative: '第二天早上你看到他的消息，心情很复杂。他确实会担心你，但这种担心来得快去得也快。接下来的几天，你们的对话变得越来越少。',
      nextScene: 11
    },

    // 补充第一幕的其他场景 (6-10)
    {
      id: 6,
      act: 1,
      title: '甜蜜的回忆',
      setting: '回想起你们相处的美好时光',
      time: '某个午后',
      location: '记忆中的咖啡厅',
      mood: '怀念、温暖',
      aiMessage: '(这是一段温暖的回忆)\n你翻看着手机里的照片，那些和他一起的美好时光历历在目。机场的拥抱、街头的牵手、电影院的甜蜜...',
      narrative: '但为什么现在感觉不一样了？那些曾经让你感到幸福的时刻，现在却带着一丝说不清的不安。',
      keyAction: 'auto',
      nextScene: 7,
      isNarrativeScene: true
    },

    {
      id: 7,
      act: 1,
      title: '朋友的提醒',
      setting: '和好友聊天时的意外提醒',
      time: '周末下午',
      location: '咖啡厅',
      mood: '困惑、被提醒',
      aiMessage: '朋友："他从来没在朋友圈提过你呢，你们真的在一起了吗？"\n你："这...我们...算是吧..."\n朋友："算是？什么叫算是？要么在一起要么没在一起啊。"',
      narrative: '朋友的话像针一样扎在心里。她说得对，什么叫"算是"？连你自己都不确定。',
      keyAction: 'auto',
      nextScene: 8,
      specialTools: {
        innerMonologue: {
          available: true,
          content: '朋友说得对...他确实从来没有在公开场合承认过我们的关系。我是不是一直在自作多情？',
          emotion: '质疑、不安'
        }
      }
    },

    {
      id: 8,
      act: 1,
      title: '微妙的距离感',
      setting: '开始察觉到他行为中的微妙变化',
      time: '日常观察中',
      location: '数字交流空间',
      mood: '敏感、察觉',
      aiMessage: '(内心的观察)\n他的回复："嗯" "好的" "忙着呢"\n以前的他："宝贝想我了吗？" "今天遇到了好玩的事..." "想抱抱你"',
      narrative: '你开始注意到这些微妙的变化：回复越来越简短，很少主动分享生活，约会时总说要早点回去...这些变化是什么时候开始的？',
      keyAction: 'auto',
      nextScene: 9,
      isNarrativeScene: true
    },

    {
      id: 9,
      act: 1,
      title: '自我怀疑的开始',
      setting: '开始怀疑自己的感受和判断',
      time: '夜深人静时',
      location: '内心世界',
      mood: '自我怀疑、困惑',
      aiMessage: '(内心的挣扎)\n理性告诉你：他的行为确实有问题\n感性告诉你：也许是你想太多了\n恐惧告诉你：如果追问可能连现在的关系都没有了',
      narrative: '也许是我太敏感了？也许这就是异地恋的正常状态？也许我应该更体谅他的忙碌？但是心里的不安却越来越强烈...',
      keyAction: 'auto',
      nextScene: 10,
      isNarrativeScene: true
    },

    {
      id: 10,
      act: 1,
      title: '裂痕的加深',
      setting: '关系中的不安全感越来越明显',
      time: '第一幕结束前',
      location: '情感的十字路口',
      mood: '不安、迷茫',
      aiMessage: '(时间推移的画面)\n一个月后...\n表面：你们还在联系\n实际：他越来越疏远，你越来越不安\n结果：一种说不清的距离感',
      narrative: '是时候做些什么了...不能再这样下去了。',
      keyAction: 'auto',
      nextScene: 11,
      isNarrativeScene: true
    },

    // 第二幕：沉默的重量 (11-20)
    {
      id: 11,
      act: 2,
      title: '周五的等待',
      setting: '周五晚上，窗外有隐约的欢笑声。你盯着手机，和"他"的对话停留在昨天你问的"周末有什么安排吗？"，他还没回复。冰箱上还贴着你们上周看电影的票根。',
      time: '周五晚上8点',
      location: '家中客厅',
      mood: '焦虑、等待',
      aiMessage: '刚开完复盘会，这周简直不是人过的！😫\n你呢？周末打算干嘛？',
      aiEmotion: '终于回复但语气轻松',
      context: '他终于回复了，但你已经等了一天',
      keyAction: 'choice',
      choices: [
        {
          id: 'A',
          text: '主动邀约 - 测试态度',
          response: '我也没事做…好久没见你了，要不我明天飞过去找你？我们去看新上的那部电影？',
          emotion: '主动、期待',
          impact: '直接推进见面，可能得到热情回应或暴露他的回避',
          nextScene: 12
        },
        {
          id: 'B',
          text: '表达不满 - 带委屈',
          response: '原来你还记得有我这个人啊？三天没消息，我以为你失踪了呢。😒',
          emotion: '委屈、不满',
          impact: '释放压抑情绪，可能引发争吵或让他愧疚补偿',
          nextScene: 13
        },
        {
          id: 'C',
          text: '模仿疏离 - 被动反击',
          response: '哦，还好。可能跟朋友逛街吧。',
          emotion: '冷淡、反击',
          impact: '用冷淡触发他的关注，也可能让关系更僵',
          nextScene: 14
        },
        {
          id: 'special_perspective',
          text: '🔍 切换到对方视角',
          response: '(此刻，你想知道他这三天究竟怎么想的吗？)',
          emotion: '好奇',
          impact: '查看他的内心独白',
          nextScene: 15,
          isSpecial: true,
          toolType: 'perspective'
        }
      ],
      specialTools: {
        relationshipAnalysis: {
          available: true,
          cooldown: 120, // 2分钟冷却
          content: {
            title: '关系动态分析',
            patterns: [
              '沟通模式：你主动-他被动，83%的对话由你发起',
              '回复时间：他的平均回复时间从2分钟延长到4小时',
              '情感投入：你的情感词汇密度是他的3.2倍',
              '关系确认度：0次明确关系定义，暧昧指数94%'
            ],
            insights: [
              '他正在通过延迟回复和简短回复来拉开距离',
              '你在这段关系中承担了过多的情感劳动',
              '关系缺乏明确边界，导致你处于被动等待状态'
            ],
            suggestions: [
              '尝试减少主动联系的频率，观察他的反应',
              '直接表达你对关系定义的需求',
              '为自己设定一个沟通的底线和时间期限'
            ]
          }
        }
      }
    },

    // 选择A的后续场景 - 暴露他的回避
    {
      id: 12,
      act: 2,
      title: '犹豫的借口',
      setting: '看到你主动提出飞来，他的回复速度明显慢了',
      time: '周五晚上',
      location: '等待回复中',
      mood: '紧张、不安',
      aiMessage: '啊？明天吗？这么突然…🤔\n这周真的太累了宝贝，下周还有个重要汇报要准备…\n而且明天下午可能临时要跟老板出差…(撤回)\n我是说…怕你来了我也没法好好陪你🫂',
      aiEmotion: '紧张、找借口、撤回消息显示慌乱',
      context: '撤回消息暴露了他的真实想法，各种借口显示他在回避',
      narrative: '你盯着"突然""出差""撤回"这几个刺眼的词，手指发凉。他紧接着又发来一条：',
      aiFollowUp: '要不…等下周末？我提前安排好时间？🥺',
      keyAction: 'choice',
      choices: [
        {
          id: 'A',
          text: '戳破借口 - 追问',
          response: '撤回是什么意思？你其实根本没事，只是不想见我？',
          emotion: '质疑、受伤',
          impact: '直面矛盾，可能逼出真相或激烈冲突',
          nextScene: 16
        },
        {
          id: 'B',
          text: '委屈妥协 - 咽下疑虑',
          response: '好吧…那下周再说吧。😔',
          emotion: '委屈、失望',
          impact: '暂时平息，但信任受损，焦虑感可能加重',
          nextScene: 17
        },
        {
          id: 'C',
          text: '突然沉默 - 不回复',
          response: '(关掉手机屏幕，眼泪砸在键盘上)',
          emotion: '伤心、沉默',
          impact: '用沉默表达受伤，可能触发他追问或顺势冷处理',
          nextScene: 18
        },
        {
          id: 'special_perspective',
          text: '🔍 切换到对方视角',
          response: '(你想知道那个撤回的消息背后，他到底在怕什么吗？)',
          emotion: '好奇',
          impact: '查看他的内心独白',
          nextScene: 19,
          isSpecial: true,
          toolType: 'perspective'
        }
      ],
      specialTools: {
        innerMonologue: {
          available: true,
          content: '撤回...他撤回了什么？临时出差？他在撒谎吗？为什么一提到见面他就这么慌乱？难道我真的只是一个可有可无的人？',
          emotion: '震惊、质疑、痛苦'
        }
      }
    },

    // 选择B的后续 - 委屈妥协路线
    {
      id: 17,
      act: 2,
      title: '虚假的安慰',
      setting: '你压下喉头的哽塞，指尖悬在屏幕上方几秒才落下',
      time: '周五深夜',
      location: '卧室',
      mood: '委屈、失望',
      aiMessage: '宝贝最体贴了！😘\n等忙完这阵一定好好补偿你，快睡吧，晚安！',
      aiEmotion: '轻松、敷衍、快速结束',
      context: '他用甜言蜜语轻松地化解了这次危机，但问题并没有解决',
      narrative: '对话终结于此。接下来的一周，他依然只有零星的消息。你数着日子到周末，他却发来一张加班照：办公室灯火通明。',
      aiFollowUp: '对不起啊宝贝！项目出问题了全组在救火😭 下周！下周我发誓！😭',
      narrativeContinue: '承诺像被风吹散的沙。又一个月过去，"下周复下周"的循环里，你开始失眠。直到某天，你临时出差到他城市，午休时鬼使神差走到了他公司楼下咖啡厅——',
      nextScene: 21,
      specialTools: {
        innerMonologue: {
          available: true,
          content: '又是"下周"...已经多少个下周了？我为什么总是这么好说话？他是不是就是看准了我不会生气才这样一再推迟？',
          emotion: '失望、自我反思'
        },
        highEnergyMode: {
          available: true,
          duration: 300, // 5分钟
          description: '厌倦了被动等待？开启高能女主模式，让AI主动推进对话！',
          effects: [
            'AI会主动发起话题和推进剧情',
            '减少等待时间，体验更流畅的对话',
            '探索更主动的关系处理方式',
            '5分钟限时体验'
          ]
        }
      }
    },

    // 选择B的后续 - 表达不满路线
    {
      id: 13,
      act: 2,
      title: '委屈的爆发',
      setting: '你终于忍不住表达了内心的委屈',
      time: '周五深夜',
      location: '情绪的出口',
      mood: '委屈、释放',
      aiMessage: '哎呀别这样说嘛...我真的最近太忙了😓\n你知道我最疼你了，怎么会忘记你呢\n等这个项目结束就好了，再等等我好不好？',
      aiEmotion: '安抚、许诺、转移责任',
      context: '他用惯常的安抚术试图化解你的不满',
      keyAction: 'auto',
      autoResponse: '总是"等等"...我已经等了很久了。',
      userEmotion: '疲惫、失望',
      aiFollowUp: '我知道委屈你了...下周我们一定见面，我保证！',
      narrative: '又是承诺，又是"下周"。你开始怀疑这些话的真实性。',
      nextScene: 21
    },

    // 选择C的后续 - 模仿疏离路线
    {
      id: 14,
      act: 2,
      title: '冷战的开始',
      setting: '你用同样的疏离回应他',
      time: '周五晚上',
      location: '情感的镜子',
      mood: '冷淡、报复',
      aiMessage: '怎么了？感觉你好冷淡啊...\n是不是心情不好？还是我说错什么了？😟',
      aiEmotion: '困惑、担心、试探',
      context: '你的冷淡让他开始慌乱，这是你想要的效果吗？',
      keyAction: 'auto',
      autoResponse: '没什么啊，就是有点累。',
      userEmotion: '冷淡、观察',
      aiFollowUp: '那你早点休息吧...有什么事记得跟我说。',
      narrative: '接下来的几天，你们都在等对方先打破沉默。',
      nextScene: 21
    },

    // 视角切换场景 - 他的内心世界
    {
      id: 15,
      act: 2,
      title: '他的内心独白',
      setting: '切换到他的视角，了解他的真实想法',
      time: '你做出选择的同时',
      location: '他的内心世界',
      mood: '矛盾、逃避',
      isPerspectiveSwitch: true,
      perspectiveCharacter: '他',
      aiMessage: '——【切换到他的视角】——\n他的内心独白：\n"她最近好像有点粘人...其实她挺好的，但是一想到要确定关系就感觉压力很大。我现在工作这么忙，真的没精力处理这些。而且万一以后不合适分手了多尴尬...现在这样不是挺好的吗？她也没明确要求什么，我也没承诺什么，大家都自由。"',
      innerMonologue: '她最近好像有点粘人...其实她挺好的，但是一想到要确定关系就感觉压力很大。我现在工作这么忙，真的没精力处理这些。而且万一以后不合适分手了多尴尬...现在这样不是挺好的吗？她也没明确要求什么，我也没承诺什么，大家都自由。',
      emotion: '逃避、自私、合理化',
      insights: [
        '他享受现状但害怕承诺',
        '他知道你的需求但选择忽视',
        '他在为自己的逃避寻找借口'
      ],
      narrative: '——【切回你的视角】——\n看到他的内心想法，你明白了什么...',
      keyAction: 'auto',
      nextScene: 21,
      specialTools: {
        perspectiveSwitch: {
          available: true,
          switched: true,
          character: '他',
          insight: '发现了他的自私本质和逃避心理'
        }
      }
    },

    // 戳破借口场景
    {
      id: 16,
      act: 2,
      title: '真相的追问',
      setting: '你决定直面他的借口',
      time: '周五深夜',
      location: '真相的边缘',
      mood: '坚定、追问',
      aiMessage: '没有没有！我怎么会不想见你...\n就是真的很忙嘛，你也知道我们公司最近...\n(正在输入很久)\n要不这样，我这周六晚上抽时间视频聊聊？',
      aiEmotion: '慌乱、找补救办法',
      context: '被戳破借口让他很慌乱，开始想其他妥协方案',
      keyAction: 'auto',
      autoResponse: '视频聊聊？我们异地这么久了，你觉得现在缺的是视频吗？',
      userEmotion: '清醒、不接受敷衍',
      aiFollowUp: '...那你想怎么样？',
      narrative: '这是第一次，他问你想怎么样，而不是他来决定节奏。',
      nextScene: 21
    },

    // 高能女主模式示例场景
    {
      id: 18,
      act: 2,
      title: '高能女主觉醒',
      setting: '你突然意识到自己一直在被动等待，是时候主动出击了',
      time: '某个夜晚',
      location: '决心之地',
      mood: '觉醒、果断',
      isHighEnergyMode: true,
      aiMessage: '(高能女主模式激活)\n他: 宝贝，在吗？今天有点想你了...',
      aiEmotion: '试探、惯例甜言蜜语',
      context: '又是熟悉的套路，但这次你不打算按照他的节奏来',
      keyAction: 'choice',
      choices: [
        {
          id: 'A',
          text: '🔥 直接摊牌',
          response: '想我？那我们什么时候见面？还是又要说下周？',
          emotion: '直接、强势',
          impact: '直接挑战他的习惯性拖延',
          nextScene: 20
        },
        {
          id: 'B',
          text: '🔥 反客为主',
          response: '想我就来见我啊，我可没空继续等你的"下周"了。',
          emotion: '主导、不妥协',
          impact: '打破你一直以来的被动地位',
          nextScene: 20
        },
        {
          id: 'C',
          text: '🔥 设定边界',
          response: '想得起我的时候就"宝贝"，忙的时候就消失，这样的关系我有点累了。',
          emotion: '清醒、设界',
          impact: '明确表达对现状的不满',
          nextScene: 20
        }
      ],
      specialEffects: {
        highEnergyMode: {
          active: true,
          autoAdvance: true,
          aiProactive: true,
          description: '高能女主模式：AI将更主动地推进剧情和深入对话'
        }
      }
    },

    // 视角切换后的内心独白
    {
      id: 19,
      act: 2,
      title: '真相的重量',
      setting: '了解他的真实想法后的内心冲击',
      time: '视角切换后',
      location: '内心的震荡',
      mood: '震惊、清醒、痛苦',
      isPerspectiveSwitch: true,
      perspectiveCharacter: '他',
      aiMessage: '——【再次切换到他的视角】——\n他的内心声音：\n"她撤回消息的事情被发现了...其实我真的是临时有事，但确实也不想那么快见面。异地恋太麻烦了，见一次面她就会想要更多。我现在事业刚起步，真的没时间搞这些感情纠葛。但她对我这么好，我也不想伤害她...就这样维持着不是挺好的吗？"',
      innerMonologue: '她撤回消息的事情被发现了...其实我真的是临时有事，但确实也不想那么快见面。异地恋太麻烦了，见一次面她就会想要更多。我现在事业刚起步，真的没时间搞这些感情纠葛。但她对我这么好，我也不想伤害她...就这样维持着不是挺好的吗？',
      emotion: '自私、矛盾、逃避',
      insights: [
        '他确实在刻意回避见面',
        '他把你的感情需求当成负担',
        '他想要你的好但不想负责任'
      ],
      narrative: '——【切回你的视角】——\n真相比你想象的更残酷...',
      keyAction: 'auto',
      nextScene: 21,
      specialTools: {
        perspectiveSwitch: {
          available: true,
          switched: true,
          character: '他',
          insight: '彻底看清了他的自私和虚伪'
        }
      }
    },

    // 高能女主模式的后续
    {
      id: 20,
      act: 2,
      title: '主动权的夺回',
      setting: '高能女主模式下，你掌握了对话的主导权',
      time: '觉醒之后',
      location: '力量的中心',
      mood: '强势、清醒、主导',
      isHighEnergyMode: true,
      aiMessage: '(被你的强势震惊)\n他: 啊？你今天怎么...感觉不太一样...\n(试图找回节奏) 宝贝别生气嘛，我们好好说话好不好？',
      aiEmotion: '困惑、试图重新掌控',
      context: '你的改变让他措手不及，他在试图恢复以往的话语权',
      keyAction: 'auto',
      autoResponse: '我没生气，我只是在说实话。你觉得我们现在是什么关系？',
      userEmotion: '清醒、直接',
      aiFollowUp: '我们...我们当然是很特别的关系啊...为什么突然问这个？',
      narrative: '（高能女主模式剩余3分钟）你感受到了掌握主动权的力量。',
      nextScene: 21,
      specialEffects: {
        highEnergyMode: {
          timeRemaining: 180, // 3分钟
          effect: 'AI更加主动回应，对话节奏加快'
        }
      }
    },

    // 第三幕：直面迷雾 (21-30) 
    {
      id: 21,
      act: 3,
      title: '咖啡厅的真相',
      setting: '透过咖啡厅玻璃，你看见他正和一位女同事并肩走出来。他笑着伸手摘掉她头发上的纸屑，女孩仰头说了句什么，两人笑作一团。阳光刺得你眼睛发疼。',
      time: '某个午休时间',
      location: '他公司楼下咖啡厅',
      mood: '震惊、痛苦、清醒',
      aiMessage: '在干嘛呢？刚开完会喘口气~ ☕',
      aiEmotion: '轻松、不知道被发现',
      context: '他完全不知道你就在附近，看到了一切',
      keyAction: 'input', // 开放输入
      inputPrompt: '此刻你站在真相的悬崖边，请输入你的回应 (1-2句话)',
      inputHints: [
        '情绪提示：可包含 愤怒/悲伤/试探/质问 等',
        '关键词示例："看见你了""她是谁""分手""承诺"'
      ],
      contextualResponses: [
        {
          trigger: ['看见', '发现', '咖啡厅'],
          response: '你显然没察觉到我的位置，消息回得飞快）\n他： 再忙也得关心我家宝贝呀~ 你吃午饭没？\n（你看着玻璃窗外他收起手机，女同事凑近他看屏幕，两人又笑起来）',
          nextScene: 22
        },
        {
          trigger: ['忙', '时间', '消息'],
          response: '他显然没察觉到你的位置，消息回得飞快）\n他： 再忙也得关心我家宝贝呀~ 你吃午饭没？\n（你看着玻璃窗外他收起手机，女同事凑近他看屏幕，两人又笑起来）',
          nextScene: 22
        }
      ],
      specialTools: {
        innerMonologue: {
          available: true,
          content: '这就是他忙到没时间见我的样子？和女同事有说有笑，摘头发上的纸屑...这些亲密举动我以为只对我做过...',
          emotion: '震惊、背叛感、清醒'
        }
      }
    },

    {
      id: 22,
      act: 3,
      title: '最后的选择',
      setting: '他的敷衍和眼前的画面重叠，你指尖发抖',
      time: '真相时刻',
      location: '咖啡厅',
      mood: '清醒、决断',
      aiMessage: '他: 再忙也得关心我家宝贝呀~ 你吃午饭没？',
      aiEmotion: '敷衍、习惯性甜言蜜语',
      context: '他还在用惯常的套路，完全不知道你已经看清了一切',
      keyAction: 'input',
      inputPrompt: '关键选择 - 请输入最终态度 (1-2句话)',
      inputHints: [
        '💡 提示：此刻的对话将决定关系走向',
        '🔥 强烈建议包含：你的情绪 / 核心诉求 / 关键决定'
      ],
      branchingPaths: [
        {
          type: '爆发质问',
          triggers: ['为什么', '她是谁', '解释'],
          description: '→ 他惊慌解释/彻底回避 → 真相揭露程度？',
          nextScene: 23
        },
        {
          type: '心冷撤离', 
          triggers: ['再见', '结束', '不联系'],
          description: '→ 直接拉黑/留告别语 → 他是否会追认关系？',
          nextScene: 24
        },
        {
          type: '苦涩试探',
          triggers: ['宝贝', '关系', '朋友'],
          description: '→ 继续观察 → 延长痛苦但避免冲突',
          nextScene: 25
        }
      ],
      specialTools: {
        relationshipAnalysis: {
          available: true,
          content: {
            title: '关系终极分析',
            finalAssessment: [
              '关系性质：长期模糊地带（友达以上恋人未满）',
              '核心问题：他享受亲密感但恐惧责任，你渴望确定性却不断妥协',
              '转折点：当亲眼目睹亲密边界的随意性后，你需要做出最终选择'
            ]
          }
        }
      }
    },

    // 苦涩试探路线
    {
      id: 25,
      act: 3,
      title: '边界的划定',
      setting: '你选择了最理智也最痛苦的方式',
      time: '真相后',
      location: '心理边界',
      mood: '理智、痛苦、坚定',
      userMessage: '以后还是别用【宝贝】这样的词来称呼吧，我们又没有确定关系，这样我会很容易误会',
      aiMessage: '啊？怎么突然说这个...\n(正在输入超过1分钟)\n我们...不是一直很好吗？😅\n别多想啊！等见面我们好好聊！',
      aiEmotion: '慌乱、试图维持现状',
      context: '你的理智让他感到不安，他试图用老套路化解',
      narrative: '消息发出的瞬间，你看见他低头看手机，笑容僵在脸上。女同事好奇探头，他侧身避开）',
      narrativeContinue: '他慌乱地抬头张望，突然对上玻璃窗内你的眼睛，手里的咖啡杯"哐当"摔在地上',
      keyAction: 'special',
      specialEvent: 'perspective_switch',
      nextScene: 26
    },

    {
      id: 26,
      act: 3,
      title: '他的内心独白',
      setting: '视角切换：他的内心世界',
      time: '发现被看见的瞬间',
      location: '他的内心',
      mood: '慌乱、心虚、恐惧',
      isPerspectiveSwitch: true,
      perspectiveCharacter: '他',
      innerMonologue: '完了她怎么在这里...刚才和同事打闹都被看到了吧？她肯定误会了...其实我就是怕寂寞，有人陪着的感觉多好。但确定关系？万一异地恋撑不住分手多难看...承诺了就要负责啊...拖着起码还能享受她的好...(抓头发) 现在怎么办...',
      emotion: '恐慌、心虚、自私',
      insights: [
        '他享受你的好，但不想承担责任',
        '他害怕承诺失败带来的尴尬',
        '他知道自己在利用你的感情'
      ],
      aiMessage: '——【切回你的视角】——\n他冲进咖啡厅，纸屑还粘在袖口\n他： 你听我解释！那真是普通同事...\n你： (静静看着他袖口的纸屑)',
      narrative: '通过刚才的视角切换，你完全明白了他的真实想法。现在是做出最终决定的时候了。',
      keyAction: 'input',
      inputPrompt: '最终行动点 - 请用1-2句话为你们的关系作结',
      inputHints: [
        '✍️ 示例方向：',
        '· 彻底决裂："我们到此为止吧，你的犹豫就是答案"',
        '· 最后通牒："今天必须说清楚关系，否则再不见面"', 
        '· 自我和解："不必解释了，我值得被坚定选择"'
      ],
      nextScene: 27,
      specialTools: {
        perspectiveSwitch: {
          available: true,
          justSwitched: true,
          character: '他',
          insight: '看穿了他享受暧昧但逃避责任的本质'
        }
      }
    },

    // 爆发质问路线
    {
      id: 23,
      act: 3,
      title: '愤怒的质问',
      setting: '你选择直接爆发，质问他的行为',
      time: '咖啡厅对峙',
      location: '真相的战场',
      mood: '愤怒、质问、释放',
      aiMessage: '(冲进咖啡厅，满脸慌乱)\n等等！你听我解释！她真的只是同事...\n我和她什么都没有，就是普通的工作关系！\n你为什么要这样怀疑我？',
      aiEmotion: '慌乱、解释、反击',
      context: '他试图解释但又反过来指责你的怀疑',
      keyAction: 'auto',
      autoResponse: '普通同事？普通同事会摘头发上的纸屑？你当我是傻子吗？',
      userEmotion: '愤怒、清醒',
      aiFollowUp: '那就是...就是顺手而已！你想太多了！',
      narrative: '他的解释越来越苍白无力，你看着他袖口的纸屑，一切都明白了。',
      nextScene: 28
    },

    // 心冷撤离路线  
    {
      id: 24,
      act: 3,
      title: '冷静的离开',
      setting: '你选择不再纠缠，冷静地离开',
      time: '决断时刻',
      location: '内心的平静',
      mood: '冷静、决断、释然',
      aiMessage: '(追上来)\n等等！你先别走！我们好好谈谈好不好？\n我知道刚才的场面可能让你误会了，但真的不是你想的那样...',
      aiEmotion: '挽留、解释、慌乱',
      context: '他追上来试图挽留，但你已经下定决心',
      keyAction: 'auto',
      autoResponse: '不用解释了。我已经看得很清楚了。',
      userEmotion: '平静、坚定',
      aiFollowUp: '看清楚什么？你到底要我怎么样？',
      narrative: '你转身离开，没有回头。有些话不需要说出口，有些关系不需要正式结束。',
      nextScene: 28
    },

    // 最终场景 - 多重结局
    {
      id: 27,
      act: 3,
      title: '未命名的终局',
      setting: '根据你的最终选择，故事迎来不同的结局',
      time: '真相大白后',
      location: '人生的十字路口',
      mood: '释然、成长、坚定',
      aiMessage: '(根据你刚才的最终选择...)\n\n【示例结局】\n你："没什么，我也只是刚好路过，以后还是减少联系吧，我想清楚了，我们只适合作为普通朋友，那些模糊不清的话也不要再跟我说了。"\n\n他："我...我真的...（攥紧袖口的纸屑）"\n\n你："保重。"\n\n他："对不起。"',
      narrative: '他像被抽走了所有力气，张了张嘴却发不出声音。窗外的阳光把你的影子拉得很长，像一道清晰的界线。你推开咖啡店的门，风铃清脆作响。手机最后震动一次——但你没有回头。',
      endingVariations: [
        {
          type: 'self_respect_ending',
          trigger: ['朋友', '减少联系', '普通朋友'],
          userMessage: '没什么，我也只是刚好路过，以后还是减少联系吧，我想清楚了，我们只适合作为普通朋友，那些模糊不清的话也不要再跟我说了',
          aiResponse: '我...我真的...（攥紧袖口的纸屑）',
          userFinal: '保重。',
          aiLastMessage: '对不起。',
          narrative: '他像被抽走了所有力气，张了张嘴却发不出声音。窗外的阳光把你的影子拉得很长，像一道清晰的界线）\n(你推开咖啡店的门，风铃清脆作响。手机最后震动一次——)',
          nextScene: 28
        }
      ],
      keyAction: 'auto',
      nextScene: 28,
      isNarrativeScene: true
    },

    // 关系报告场景
    {
      id: 28,
      act: 3,
      title: '未命名的关系报告',
      setting: '心理剧落幕，是时候审视这段经历了',
      time: '反思时刻',
      location: '内心世界',
      mood: '清醒、成长、释然',
      isReportScene: true,
      aiMessage: '——【终幕：未命名的关系报告】——\n\n📊 关系状态评估：\n关系性质：长期模糊地带（友达以上恋人未满）\n核心问题：他享受亲密感但恐惧责任，你渴望确定性却不断妥协\n转折点：当亲眼目睹亲密边界的随意性后，你选择了自我保全',
      narrative: '现在是时候深入分析这段经历，看见真实的自己和成长的轨迹了。',
      keyAction: 'special',
      specialEvent: 'relationship_report',
      relationshipReport: {
        title: '未命名的关系报告',
        assessment: {
          relationshipType: '长期模糊地带（友达以上恋人未满）',
          coreIssue: '他享受亲密感但恐惧责任，你渴望确定性却不断妥协',
          turningPoint: '当亲眼目睹亲密边界的随意性后，你选择了自我保全'
        },
        userAnalysis: {
          strengths: [
            '敏锐觉察关系中的风险信号（如朋友圈权限、撤回消息）',
            '最终展现果断的自我边界设立能力', 
            '在长久消耗中仍保有理性判断力'
          ],
          growthAreas: [
            '早期回避冲突可能延长了痛苦周期（如第一幕选择回避）',
            '对"语言亲密"的过度重视易被低成本付出迷惑',
            '需练习在怀疑初期直接表达需求，而非累积到崩溃'
          ]
        },
        keyInsight: '真正的亲密不是称呼的温度，而是承诺的力度。你最后那句"减少联系"不是失去，是把被他揉皱的自我尊严，一寸寸抚平了。',
        recommendations: [
          '未来关系中，用行动匹配度检验语言温度',
          '发现矛盾行为时，使用72小时沟通法：陈述事实→表达感受→观察行动',
          '引入"关系定义节点"：接触2个月内主动询问关系性质',
          '练习带着显微镜看行动，带着望远镜听甜言蜜语'
        ]
      },
      nextScene: 29,
      specialTools: {
        relationshipAnalysis: {
          available: true,
          isFinalReport: true,
          content: {
            title: '完整关系分析报告',
            detailed: true
          }
        }
      }
    },

    // 互动结尾
    {
      id: 29,
      act: 3,
      title: '新的开始',
      setting: '心理剧结束，但成长才刚刚开始',
      time: '现在',
      location: '现实世界',
      mood: '希望、力量、清醒',
      keyAction: 'choice',
      choices: [
        {
          id: 'A',
          text: '🔄 重演某个抉择点',
          response: '想看看如果当时选择不同会如何？',
          impact: '回到关键选择点，探索不同可能性',
          action: 'replay_scene'
        },
        {
          id: 'B', 
          text: '💬 深入讨论报告',
          response: '想聊聊刚才的关系分析报告',
          impact: '深入探讨关系模式和成长建议',
          action: 'discuss_report'
        },
        {
          id: 'C',
          text: '🎯 获取实用建议',
          response: '面对这样的情况，我应该怎么做？',
          impact: '获得具体的现实指导和行动建议',
          action: 'practical_advice'
        },
        {
          id: 'D',
          text: '✨ 结束体验',
          response: '谢谢这次体验，我想独自消化一下',
          impact: '结束剧本，带着收获离开',
          action: 'end_script'
        }
      ],
      nextScene: 30
    },

    // 最终场景
    {
      id: 30,
      act: 3,
      title: '心理剧落幕',
      setting: '带着新的理解和力量，准备面对真实的世界',
      time: '永远的现在',
      location: '内心的力量之地',
      mood: '平静、坚定、充满希望',
      aiMessage: '🌻 恭喜你完成了这场心理剧的探索！\n\n你已经学会了：\n✨ 识别关系中的红色信号\n✨ 表达真实需求和设立边界\n✨ 为自己的情感负责\n✨ 相信自己值得被坚定选择\n\n记住：真正爱你的人会怕你误会，会狂奔着捧来明确的爱。',
      narrative: '你的故事还在继续，但现在你有了更清醒的眼睛和更坚定的心。这段经历教会了你什么是真正的自我价值，什么是值得拥有的爱情。',
      finalMessage: '心理剧《我们到底是什么关系？》完结。感谢你的勇敢探索，愿你在现实中也能带着这份清醒和力量，去寻找和创造真正属于你的幸福。',
      isEnding: true,
      keyAction: 'end',
      specialTools: {
        growthSummary: {
          available: true,
          achievements: [
            '完成了一次深度的情感自我探索',
            '学会了识别和应对情感操控',
            '建立了健康的关系边界意识',
            '获得了为自己设立底线的勇气'
          ]
        }
      }
    }
  ],

  // 特殊工具配置
  specialTools: {
    innerMonologue: {
      name: '内心独白',
      description: '窥视AI角色的内心想法',
      cooldown: 30, // 30秒冷却
      icon: '💭',
      scenes: [1, 4, 11, 12, 17, 21] // 可用场景
    },
    highEnergyMode: {
      name: '高能女主模式',
      description: 'AI主动推进剧情，体验更主动的关系处理方式',
      duration: 300, // 5分钟限时
      icon: '🔥',
      scenes: [17, 18], // 可激活场景
      effects: [
        'AI会主动发起话题和推进剧情',
        '减少等待时间，体验更流畅的对话',
        '探索更主动的关系处理方式'
      ]
    },
    relationshipAnalysis: {
      name: '关系分析报告',
      description: '多维度关系分析和个性化建议',
      cooldown: 120, // 2分钟冷却  
      icon: '📊',
      scenes: [11, 22, 28] // 可用场景
    },
    perspectiveSwitch: {
      name: '视角切换',
      description: '切换到对方视角，了解TA的真实想法',
      icon: '🔍',
      scenes: [11, 12, 25, 26] // 可用场景
    }
  },

  // 成长追踪
  growthTracking: {
    emotionalAwareness: ['识别暧昧信号', '理解自己的需求', '觉察情感模式'],
    boundariesSkills: ['表达真实感受', '设立关系边界', '坚持自我价值'],
    relationshipWisdom: ['识别健康关系', '避免情感操控', '选择坚定的爱']
  },

  // 后续建议
  followUpAdvice: {
    immediate: [
      '执行"物理戒断"：暂时拉黑/取消置顶',
      '翻译"未命名关系"的真相',
      '每天完成"自我确认仪式"'
    ],
    longTerm: [
      '用行动匹配度检验语言温度',
      '引入"关系定义节点"',
      '练习72小时沟通法'
    ],
    mindset: [
      '模糊的关系，本质是让你"竞争上岗"',
      '真正爱你的人会怕你误会',
      '带着显微镜看行动，带着望远镜听甜言蜜语'
    ]
  }
};

module.exports = script002MockData; 