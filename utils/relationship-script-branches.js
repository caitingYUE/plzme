/**
 * 《我们现在是什么关系》剧本分支数据
 * 支持 3 轮选择，每轮 3 选项（A/B/C），共 27 种分支路径
 * 目前使用主线内容作为所有分支的占位，后续可按需补充
 */

// 主线内容（用作所有分支的占位内容）
const MAINLINE_CONTENT = {
  // 第一轮：裂痕初显
  round1: {
    aiMessage: '宝贝，睡了吗？今天好累啊，刚加完班。😴',
    choices: [
      {
        code: 'A',
        id: 'gentle_probe_oldmemory',
        title: '温和试探 - 提旧事',
        text: '还没睡呢，辛苦啦~ 对了，忽然想起去年圣诞那张牵手照拍得真好，好怀念呀。你当时发朋友圈，是不是只给我看的呀？😊',
        replyText: '还没睡呢，辛苦啦~ 对了，忽然想起去年圣诞那张牵手照拍得真好，好怀念呀。你当时发朋友圈，是不是只给我看的呀？😊',
        potentialImpact: '可能引导他回忆/解释，也可能让他警觉你在翻旧账',
        aiReply: '啊？为什么突然问这个...😅 那个...我不太记得当时的设置了，应该是所有人都能看的吧？'
      },
      {
        code: 'B',
        id: 'direct_question_photo',
        title: '直接质问 - 带情绪',
        text: '刚看到手机相册。那张圣诞牵手照，你当时发朋友圈是设了仅我可见吧？为什么？🫤',
        replyText: '刚看到手机相册。那张圣诞牵手照，你当时发朋友圈是设了仅我可见吧？为什么？🫤',
        potentialImpact: '直接引爆冲突点，可能引发防御或争吵',
        aiReply: '额...你怎么会这样想？我没有设置什么特殊权限啊...可能是系统问题？'
      },
      {
        code: 'C',
        id: 'avoid_topic_care',
        title: '回避问题 - 转移话题',
        text: '还没呢。加班这么晚啊，吃饭了吗？我给你点个外卖？❤️',
        replyText: '还没呢。加班这么晚啊，吃饭了吗？我给你点个外卖？❤️',
        potentialImpact: '暂时回避冲突，但内心焦虑未解决，可能积累怨气',
        aiReply: '不用啦宝贝，在公司楼下随便吃了碗面。今天PPT改到吐，客户真是...😮‍💨 你真好，还想着我。早点休息？明天一早还有个会。'
      }
    ]
  },

  // 第二轮：沉默的重量
  round2: {
    aiMessage: '刚开完复盘会，这周简直不是人过的！[裂开表情] 你呢？周末打算干嘛？',
    choices: [
      {
        code: 'A',
        id: 'proactive_invite',
        title: '主动邀约 - 测试态度',
        text: '我也没事做…好久没见你了，要不我明天飞过去找你？我们去看新上的那部电影？',
        replyText: '我也没事做…好久没见你了，要不我明天飞过去找你？我们去看新上的那部电影？',
        potentialImpact: '直接推进见面，可能得到热情回应或暴露他的回避',
        aiReply: '啊？明天吗？这么突然...😅 这周真的太累了宝贝，下周还有个重要汇报要准备...'
      },
      {
        code: 'B',
        id: 'express_dissatisfaction',
        title: '表达不满 - 带委屈',
        text: '原来你还记得有我这个人啊？三天没消息，我以为你失踪了呢。😒',
        replyText: '原来你还记得有我这个人啊？三天没消息，我以为你失踪了呢。😒',
        potentialImpact: '释放压抑情绪，可能引发争吵或让他愧疚补偿',
        aiReply: '哎呀，宝贝别这样说...真的是工作太忙了，每天都要加班到很晚。🥺'
      },
      {
        code: 'C',
        id: 'mirror_coldness',
        title: '模仿疏离 - 被动反击',
        text: '哦，还好。可能跟朋友逛街吧。',
        replyText: '哦，还好。可能跟朋友逛街吧。',
        potentialImpact: '用冷淡触发他的关注，也可能让关系更僵',
        aiReply: '哦...那你玩得开心点。我这边还有个会要开。'
      }
    ]
  },

  // 第三轮：直面迷雾
  round3: {
    aiMessage: '在干嘛呢？刚开完会喘口气~ [咖啡表情]',
    choices: [
      {
        code: 'A',
        id: 'challenge_intimacy',
        title: '质疑亲密称呼',
        text: '以后还是别用【宝贝】这样的词来称呼吧，我们又没有确定关系，这样我会很容易误会。',
        replyText: '以后还是别用【宝贝】这样的词来称呼吧，我们又没有确定关系，这样我会很容易误会。',
        potentialImpact: '直接挑战关系模糊性，可能引发关系定义讨论',
        aiReply: '啊？怎么突然说这个...我们...不是一直很好吗？😰 别多想啊！'
      },
      {
        code: 'B',
        id: 'demand_clarity',
        title: '要求明确关系',
        text: '我们到底是什么关系？能不能给我一个准确的答案？',
        replyText: '我们到底是什么关系？能不能给我一个准确的答案？',
        potentialImpact: '强势要求关系定义，可能得到答案或遭到回避',
        aiReply: '关系...这个问题有点突然。我们一直相处得很自然啊，为什么突然要定义？'
      },
      {
        code: 'C',
        id: 'self_protection_distance',
        title: '自我保护 - 拉开距离',
        text: '我想我们还是减少联系比较好，我需要想清楚一些事情。',
        replyText: '我想我们还是减少联系比较好，我需要想清楚一些事情。',
        potentialImpact: '主动设立边界，可能让他察觉失去的危险',
        aiReply: '什么？为什么要减少联系？是我做错什么了吗？宝贝，我们好好谈谈...'
      }
    ]
  }
};

// 分支树结构（目前所有分支都用主线内容占位）
const RELATIONSHIP_SCRIPT_BRANCHES = {
  // 开场AI消息（所有分支统一）
  opening: MAINLINE_CONTENT.round1.aiMessage,

  // 第一轮选择（3个选项：A/B/C）
  round1: MAINLINE_CONTENT.round1.choices,

  // 第二轮分支（根据第一轮选择 + 当前选择）
  round2: {
    // 第一轮选A后的第二轮
    A: {
      aiMessage: MAINLINE_CONTENT.round2.aiMessage,
      choices: MAINLINE_CONTENT.round2.choices
    },
    // 第一轮选B后的第二轮
    B: {
      aiMessage: MAINLINE_CONTENT.round2.aiMessage,
      choices: MAINLINE_CONTENT.round2.choices
    },
    // 第一轮选C后的第二轮
    C: {
      aiMessage: MAINLINE_CONTENT.round2.aiMessage,
      choices: MAINLINE_CONTENT.round2.choices
    }
  },

  // 第三轮分支（根据前两轮选择路径）
  round3: {
    // 路径: AA, AB, AC, BA, BB, BC, CA, CB, CC
    AA: { aiMessage: MAINLINE_CONTENT.round3.aiMessage, choices: MAINLINE_CONTENT.round3.choices },
    AB: { aiMessage: MAINLINE_CONTENT.round3.aiMessage, choices: MAINLINE_CONTENT.round3.choices },
    AC: { aiMessage: MAINLINE_CONTENT.round3.aiMessage, choices: MAINLINE_CONTENT.round3.choices },
    BA: { aiMessage: MAINLINE_CONTENT.round3.aiMessage, choices: MAINLINE_CONTENT.round3.choices },
    BB: { aiMessage: MAINLINE_CONTENT.round3.aiMessage, choices: MAINLINE_CONTENT.round3.choices },
    BC: { aiMessage: MAINLINE_CONTENT.round3.aiMessage, choices: MAINLINE_CONTENT.round3.choices },
    CA: { aiMessage: MAINLINE_CONTENT.round3.aiMessage, choices: MAINLINE_CONTENT.round3.choices },
    CB: { aiMessage: MAINLINE_CONTENT.round3.aiMessage, choices: MAINLINE_CONTENT.round3.choices },
    CC: { aiMessage: MAINLINE_CONTENT.round3.aiMessage, choices: MAINLINE_CONTENT.round3.choices }
  }
};

// 内心独白模板（按分支路径生成）
const INNER_MONOLOGUE_TEMPLATES = {
  // 根据用户选择路径的特征生成不同的内心独白
  default: '此刻我的内心很复杂，既想要亲近又担心受伤。用户的话触动了我内心深处的想法。',
  aggressive: '她的直接让我感到压力，我不知道该如何回应这种咄咄逼人的态度。',
  avoidant: '她这样回避让我觉得安全，我也不想面对那些复杂的关系问题。',
  testing: '她在试探我，我能感觉到。但我真的不知道该怎么给她想要的答案。'
};

// 关系报告模板（按最终路径生成）
const RELATIONSHIP_REPORT_TEMPLATES = {
  // 根据27种路径的最终结果生成不同的关系报告
  default: {
    status: '关系状态：正在探索和磨合中，双方都在寻找合适的相处模式',
    personality: '性格特点：善于观察、情感细腻、渴望理解、勇于表达',
    growth: '成长建议：保持真诚沟通、建立健康边界、培养自我价值感',
    encouragement: '温暖鼓励：你的真诚和勇气值得被珍惜，继续做那个敢于表达的自己'
  }
};

/**
 * 根据选择路径获取当前轮的选择卡
 */
function getChoicesByPath(round, path = []) {
  if (round === 1) {
    return RELATIONSHIP_SCRIPT_BRANCHES.round1;
  } else if (round === 2) {
    const firstChoice = path[0] || 'A';
    return RELATIONSHIP_SCRIPT_BRANCHES.round2[firstChoice]?.choices || MAINLINE_CONTENT.round2.choices;
  } else if (round === 3) {
    const pathKey = (path[0] || 'A') + (path[1] || 'A');
    return RELATIONSHIP_SCRIPT_BRANCHES.round3[pathKey]?.choices || MAINLINE_CONTENT.round3.choices;
  }
  return MAINLINE_CONTENT.round1.choices; // fallback
}

/**
 * 根据选择路径获取AI回复
 */
function getAIReplyByPath(round, choiceIndex, path = []) {
  const choices = getChoicesByPath(round, path);
  const choice = choices[choiceIndex];
  return choice?.aiReply || '我理解你的感受，让我们继续深入探讨这个话题。';
}

/**
 * 根据选择路径获取内心独白
 */
function getInnerMonologueByPath(path = []) {
  // 根据路径特征判断独白类型
  const pathString = path.join('');
  
  if (pathString.includes('B')) {
    return INNER_MONOLOGUE_TEMPLATES.aggressive;
  } else if (pathString.includes('C')) {
    return INNER_MONOLOGUE_TEMPLATES.avoidant;
  } else if (pathString.includes('A')) {
    return INNER_MONOLOGUE_TEMPLATES.testing;
  }
  
  return INNER_MONOLOGUE_TEMPLATES.default;
}

/**
 * 根据选择路径获取关系报告
 */
function getRelationshipReportByPath(path = []) {
  // 目前都返回默认模板，后续可根据具体路径定制
  return RELATIONSHIP_REPORT_TEMPLATES.default;
}

module.exports = {
  RELATIONSHIP_SCRIPT_BRANCHES,
  MAINLINE_CONTENT,
  INNER_MONOLOGUE_TEMPLATES,
  RELATIONSHIP_REPORT_TEMPLATES,
  getChoicesByPath,
  getAIReplyByPath,
  getInnerMonologueByPath,
  getRelationshipReportByPath
}; 