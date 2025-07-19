/**
 * 剧本内容生成器
 * 根据用户投稿的真实故事MD文件，生成符合要求的剧本信息
 */

// 小程序环境检测
let nodejieba = null;
let lexicon = null;

try {
  // 尝试加载 Node.js 模块，在小程序环境中会失败
  if (typeof wx === 'undefined') {
    nodejieba = require('nodejieba');
    lexicon = require('./lexicon');
  }
} catch (error) {
  console.log('在小程序环境中运行，使用简化版本');
}

class ScriptGenerator {
  constructor() {
    this.scriptTemplates = {};
    this.initializeTemplates();
  }

  /**
   * 初始化模板数据
   */
  initializeTemplates() {
    // 情感标签库
    this.emotionTags = {
      love: ['暗恋情结', '分手复合', '异地恋', '秘密恋情', '校园初恋'],
      confusion: ['关系困惑', '暧昧边界', '情感迷茫', '选择困难', '身份认同'],
      growth: ['自我觉醒', '成长蜕变', '价值重塑', '独立人格', '心理成熟'],
      healing: ['温柔治愈', '情感疗愈', '心灵修复', '重获力量', '内在平静'],
      regret: ['青春遗憾', '错过时光', '无法挽回', '时光倒流', '如果当初'],
      family: ['家庭亲情', '代际理解', '原生家庭', '血缘羁绊', '家的温暖'],
      career: ['职场生存', '梦想现实', '人生选择', '社会适应', '价值冲突']
    };

    // 剧本类型判断规则
    this.typeRules = {
      '男主本': ['男性视角', '男主角', '他的', '男生', '直男'],
      '女主本': ['女性视角', '女主角', '她的', '女生', '闺蜜'],
      '双女主': ['两个女', '女友', '姐妹', '女性友谊'],
      '双男主': ['两个男', '兄弟', '哥们', '男性友谊'],
      '不限人群': ['通用', '不分性别', '任何人']
    };
  }

  /**
   * 根据MD文件内容生成完整的剧本信息（微信小程序版本）
   */
  async generateScriptFromMD(content, scriptId) {
    try {
      const parsed = this.parseMDContent(content);
      if (!parsed.mainContent || parsed.mainContent.length < 10) {
        console.error(`剧本 ${scriptId} 内容过短或无效，跳过`);
        return null;
      }
      const scriptInfo = {
        id: scriptId,
        title: this.generateTitle(parsed),
        summary: this.generateSummary(parsed),
        tags: this.generateTags(parsed),
        characters: this.extractCharacters(parsed),
        scenes: this.generateScenes(parsed),
        imagePrompt: this.generateImagePrompt(parsed),
        originalContent: content,
        parsedContent: parsed
      };
      return scriptInfo;
    } catch (error) {
      console.error(`生成剧本 ${scriptId} 失败:`, error);
      return null;
    }
  }

  /**
   * 优化后的MD内容解析
   */
  parseMDContent(content) {
    const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
    let title = lines[0];
    if (!title || title.length < 4 || /[，。！？]/.test(title)) {
      title = lines[1] && lines[1].length < 20 ? lines[1] : lines[0].slice(0, 15);
    }
    const mainContent = lines.slice(1).join('\n').trim();
    const paragraphs = mainContent.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
    const allText = mainContent.replace(/[\n，。！？、]/g, '');
    const roleCandidates = {};
    ['我', '他', '她', '你', 'ta', 'z', 'x'].forEach(r => {
      const count = (allText.match(new RegExp(r, 'g')) || []).length;
      if (count > 0) roleCandidates[r] = count;
    });
    const sortedRoles = Object.entries(roleCandidates).sort((a, b) => b[1] - a[1]).map(r => r[0]);
    const characters = sortedRoles.length ? sortedRoles : ['主角', '配角'];
    // 简化版分词逻辑（小程序兼容）
    let words, emotionTags, sceneTags, themeTags;
    
    if (nodejieba && lexicon) {
      // Node.js 环境：使用完整分词
      words = nodejieba.cut(mainContent, true);
      emotionTags = lexicon.emotionWords.filter(w => words.includes(w));
      sceneTags = lexicon.sceneWords.filter(w => words.includes(w));
      themeTags = lexicon.themeWords.filter(w => words.includes(w));
    } else {
      // 小程序环境：使用简化分词
      words = this.simpleWordSegmentation(mainContent);
      emotionTags = this.extractEmotionTags(mainContent);
      sceneTags = this.extractSceneTags(mainContent);
      themeTags = this.extractThemeTags(mainContent);
    }
    return {
      title,
      mainContent,
      paragraphs,
      characters,
      emotionTags,
      sceneTags,
      themeTags
    };
  }

  /**
   * 生成吸引人的标题（5-15字）
   */
  generateTitle(parsed) {
    if (parsed.title && parsed.title.length >= 4 && parsed.title.length <= 15) return parsed.title;
    if (parsed.emotionTags.length && parsed.sceneTags.length) {
      return `${parsed.sceneTags[0]}的${parsed.emotionTags[0]}`;
    }
    if (parsed.themeTags.length) {
      return `关于${parsed.themeTags[0]}的故事`;
    }
    return parsed.mainContent.slice(0, 12) + '...';
  }

  /**
   * 生成第一视角简介（100字内）
   */
  generateSummary(parsed) {
    let summary = parsed.mainContent.replace(/\n/g, '').slice(0, 100);
    for (const p of parsed.paragraphs) {
      if (/(但|可是|然而|直到|突然|后来|结果)/.test(p) && p.length > 20) {
        summary = p.slice(0, 100);
        break;
      }
    }
    return summary;
  }

  /**
   * 生成标签（1-3个）
   */
  generateTags(parsed) {
    let crowd = '不限人群';
    if (parsed.characters.includes('她') && !parsed.characters.includes('他')) crowd = '女主本';
    if (parsed.characters.includes('他') && !parsed.characters.includes('她')) crowd = '男主本';
    const tags = [crowd, ...parsed.emotionTags, ...parsed.themeTags, ...parsed.sceneTags];
    return Array.from(new Set(tags)).slice(0, 4);
  }

  /**
   * 确定剧本类型
   */
  determineScriptType(parsed) {
    const content = parsed.mainContent.toLowerCase();
    
    for (let [type, keywords] of Object.entries(this.typeRules)) {
      for (let keyword of keywords) {
        if (content.includes(keyword.toLowerCase())) {
          return type;
        }
      }
    }
    
    // 基于视角判断
    if (parsed.perspective.includes('第一人称')) {
      // 分析主角性别
      if (content.includes('她') && !content.includes('他')) {
        return '女主本';
      } else if (content.includes('他') && !content.includes('她')) {
        return '男主本';
      }
    }
    
    return '不限人群';
  }

  /**
   * 生成30个场景
   */
  generateScenes(parsed) {
    return parsed.paragraphs.map((p, i) => {
      const scene = parsed.sceneTags.find(w => p.includes(w)) || '';
      const emotion = parsed.emotionTags.find(w => p.includes(w)) || '';
      const event = p.slice(0, 15);
      return {
        index: i + 1,
        description: `${scene ? scene + '，' : ''}${event}${emotion ? '，' + emotion : ''}`
      };
    }).slice(0, 8);
  }

  /**
   * 辅助方法：提取关键词
   */
  extractKeywords(text) {
    const keywords = [];
    const patterns = [
      /爱情|感情|关系|喜欢|爱/g,
      /朋友|友情|友谊/g,
      /家庭|父母|亲情/g,
      /工作|职场|事业/g,
      /梦想|理想|追求/g
    ];
    
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) keywords.push(...matches);
    });
    
    return [...new Set(keywords)];
  }

  /**
   * 辅助方法：提取情感词汇
   */
  extractEmotionWords(text) {
    const emotionWords = [];
    const patterns = [
      /开心|快乐|幸福|甜蜜|美好/g,
      /难过|伤心|痛苦|失望|绝望/g,
      /困惑|迷茫|纠结|复杂/g,
      /愤怒|生气|不满|委屈/g,
      /温暖|治愈|安慰|平静/g
    ];
    
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) emotionWords.push(...matches);
    });
    
    return [...new Set(emotionWords)];
  }

  /**
   * 辅助方法：提取核心元素
   */
  extractCoreElements(text) {
    return {
      action: this.extractAction(text),
      emotion: this.extractMainEmotion(text),
      conflict: this.extractConflict(text),
      resolution: this.extractResolution(text),
      theme: this.extractTheme(text)
    };
  }

  extractAction(text) {
    if (text.includes('暗恋') || text.includes('喜欢')) return '暗恋着一个人';
    if (text.includes('分手') || text.includes('分开')) return '经历了分离';
    if (text.includes('相遇') || text.includes('认识')) return '遇见了某个人';
    return '经历了一段关系';
  }

  extractMainEmotion(text) {
    if (text.includes('痛苦') || text.includes('难过')) return '感到深深的痛苦';
    if (text.includes('困惑') || text.includes('迷茫')) return '陷入深深的困惑';
    if (text.includes('甜蜜') || text.includes('幸福')) return '体验过美好的甜蜜';
    return '经历了复杂的情感';
  }

  extractConflict(text) {
    if (text.includes('不知道') || text.includes('模糊')) return '关系变得模糊不清';
    if (text.includes('分开') || text.includes('离开')) return '面临着分离的痛苦';
    if (text.includes('选择') || text.includes('决定')) return '需要做出艰难的选择';
    return '遇到了情感的挑战';
  }

  extractResolution(text) {
    if (text.includes('成长') || text.includes('学会')) return '最终获得了成长';
    if (text.includes('释然') || text.includes('放下')) return '学会了释然和放下';
    if (text.includes('明白') || text.includes('理解')) return '获得了新的理解';
    return '找到了内心的答案';
  }

  extractTheme(text) {
    if (text.includes('暗恋')) return '暗恋与青春';
    if (text.includes('关系')) return '现代爱情关系';
    if (text.includes('成长')) return '自我成长';
    if (text.includes('家庭')) return '家庭与亲情';
    return '情感与人生';
  }

  // ... existing code ...
  // 句子级摘要：提取最具画面感的句子
  extractBestSentence(paragraphs, sceneTags, emotionTags) {
    // 优先选取含有场景词和情感词的长句
    for (const p of paragraphs) {
      for (const scene of sceneTags) {
        for (const emo of emotionTags) {
          if (p.includes(scene) && p.includes(emo) && p.length > 12) {
            return p;
          }
        }
      }
    }
    // 其次选取含有场景词的长句
    for (const p of paragraphs) {
      for (const scene of sceneTags) {
        if (p.includes(scene) && p.length > 12) return p;
      }
    }
    // 其次选取含有情感词的长句
    for (const p of paragraphs) {
      for (const emo of emotionTags) {
        if (p.includes(emo) && p.length > 12) return p;
      }
    }
    // 兜底：选最长的句子
    return paragraphs.sort((a, b) => b.length - a.length)[0] || '';
  }

  // 句子重写为图片描述
  rewriteToImagePrompt(sentence, sceneTags, emotionTags) {
    const scene = sceneTags[0] || '';
    const emotion = emotionTags[0] || '';
    // 简单模板润色
    if (scene && emotion) {
      return `图片描述: ${scene}场景，${sentence}，${emotion}氛围，电影感，4:3横图。`;
    }
    if (scene) {
      return `图片描述: ${scene}场景，${sentence}，电影感，4:3横图。`;
    }
    if (emotion) {
      return `图片描述: ${sentence}，${emotion}氛围，电影感，4:3横图。`;
    }
    return `图片描述: ${sentence}，电影感，4:3横图。`;
  }

  // 新增：图片描述生成
  generateImagePrompt(parsed) {
    // 1. 场景
    const scene = parsed.sceneTags[0] || '生活场景';
    // 2. 关系
    let relation = '主角';
    if (parsed.characters.includes('他') && parsed.characters.includes('她')) relation = '一对男女';
    else if (parsed.characters.includes('她')) relation = '女生';
    else if (parsed.characters.includes('他')) relation = '男生';
    // 3. 动作/事件
    const event = this.extractKeyEvent(parsed.paragraphs);
    // 4. 情绪
    const emotion = parsed.emotionTags[0] || '复杂情感';
    // 5. 画面感
    return `图片描述: ${scene}，${relation}${event ? '正在' + event : ''}，${emotion}氛围，电影感，4:3横图`;
  }

  // 简单事件抽取
  extractKeyEvent(paragraphs) {
    const eventWords = ['对视','拥抱','分离','沉思','告白','争吵','等待','回头','微笑','哭泣','走开','相遇','道别','牵手','亲吻','注视','发呆','发呆','奔跑','跳舞','喝酒','聊天','写信','看书','散步','下雨','看海','看星星','发呆'];
    for (const p of paragraphs) {
      for (const w of eventWords) {
        if (p.includes(w)) return w;
      }
    }
    return '';
  }

  // ... existing code ...

  /**
   * 辅助方法：匹配情感标签
   */
  matchEmotionTags(emotionWords) {
    const matched = [];
    
    for (let [category, tags] of Object.entries(this.emotionTags)) {
      for (let word of emotionWords) {
        if (category === 'love' && (word.includes('爱') || word.includes('恋'))) {
          matched.push(tags[0]);
          break;
        }
        if (category === 'confusion' && (word.includes('困惑') || word.includes('迷茫'))) {
          matched.push(tags[0]);
          break;
        }
        if (category === 'healing' && (word.includes('温暖') || word.includes('治愈'))) {
          matched.push(tags[0]);
          break;
        }
        if (category === 'regret' && (word.includes('遗憾') || word.includes('错过'))) {
          matched.push(tags[0]);
          break;
        }
      }
    }
    
    return [...new Set(matched)];
  }

  /**
   * 辅助方法：分析故事弧线
   */
  analyzeStoryArc(text) {
    return {
      hasConflict: text.includes('冲突') || text.includes('矛盾') || text.includes('问题'),
      hasResolution: text.includes('解决') || text.includes('结束') || text.includes('释然'),
      emotionalTone: this.analyzeEmotionalTone(text),
      complexity: this.assessComplexity(text)
    };
  }

  analyzeEmotionalTone(text) {
    const sadWords = (text.match(/难过|伤心|痛苦|失望/g) || []).length;
    const happyWords = (text.match(/开心|快乐|幸福|甜蜜/g) || []).length;
    const complexWords = (text.match(/复杂|纠结|困惑|矛盾/g) || []).length;
    
    if (complexWords > sadWords && complexWords > happyWords) return 'complex';
    if (sadWords > happyWords) return 'melancholic';
    if (happyWords > sadWords) return 'positive';
    return 'neutral';
  }

  assessComplexity(text) {
    const characters = (text.match(/他|她|我/g) || []).length;
    const scenes = (text.match(/淡入|淡出|切换/g) || []).length;
    const dialogues = (text.match(/>/g) || []).length;
    
    return characters + scenes + dialogues > 50 ? 'high' : 'medium';
  }

  /**
   * 辅助方法：评估时长
   */
  estimateDuration(parsed) {
    const textLength = parsed.mainContent.length;
    const dialogueCount = parsed.paragraphs.length;
    
    // 基于文本长度和对话数量估算
    const baseDuration = Math.floor(textLength / 100) + dialogueCount * 2;
    return Math.min(Math.max(baseDuration, 15), 60); // 15-60分钟
  }

  /**
   * 辅助方法：评估难度
   */
  assessDifficulty(parsed) {
    const complexity = this.assessComplexity(parsed.mainContent);
    const emotionalIntensity = this.assessEmotionalIntensity(parsed);
    
    if (complexity === 'high' || emotionalIntensity === 'high') return '深度体验';
    if (complexity === 'medium' || emotionalIntensity === 'medium') return '适度探索';
    return '轻松入门';
  }

  /**
   * 辅助方法：评估情感强度
   */
  assessEmotionalIntensity(parsed) {
    const intensityWords = parsed.mainContent.match(/痛苦|绝望|狂欢|激动|愤怒|崩溃/g) || [];
    
    if (intensityWords.length > 5) return 'high';
    if (intensityWords.length > 2) return 'medium';
    return 'low';
  }

  /**
   * 辅助方法：提取情感关键词
   */
  extractEmotions(text, emotions) {
    const emotionPatterns = [
      /开心|快乐|幸福|甜蜜|美好|温暖/g,
      /难过|伤心|痛苦|失望|绝望|沮丧/g,
      /愤怒|生气|不满|委屈|愤慨/g,
      /困惑|迷茫|纠结|复杂|矛盾/g,
      /平静|安详|释然|淡然|从容/g
    ];
    
    emotionPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        emotions.push(...matches);
      }
    });
  }

  /**
   * 确定视角
   */
  determinePerspective(parsed) {
    const content = parsed.mainContent;
    
    if (content.includes('我（画外音）') || content.includes('第一人称')) {
      return '第一人称';
    }
    if (content.includes('第三人称')) {
      return '第三人称';
    }
    
    // 根据内容判断
    const firstPersonCount = (content.match(/我/g) || []).length;
    const thirdPersonCount = (content.match(/他|她/g) || []).length;
    
    return firstPersonCount > thirdPersonCount ? '第一人称' : '第三人称';
  }

  /**
   * 提取角色
   */
  extractCharacters(parsed) {
    return parsed.characters.slice(0, 3);
  }

  /**
   * 简化分词（小程序环境）
   */
  simpleWordSegmentation(text) {
    // 简单的基于标点符号的分词
    return text.split(/[，。！？、；：\s]+/).filter(word => word.length > 0);
  }

  /**
   * 提取情感标签（小程序版本）
   */
  extractEmotionTags(text) {
    const emotionKeywords = {
      '暗恋': ['暗恋', '喜欢', '心动', '单恋'],
      '分手': ['分手', '分离', '离别', '结束'],
      '困惑': ['困惑', '迷茫', '不知道', '疑惑'],
      '治愈': ['治愈', '温暖', '安慰', '疗愈'],
      '成长': ['成长', '改变', '进步', '蜕变'],
      '遗憾': ['遗憾', '后悔', '错过', '可惜']
    };

    const foundTags = [];
    for (const [tag, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        foundTags.push(tag);
      }
    }
    return foundTags.slice(0, 3); // 最多返回3个
  }

  /**
   * 提取场景标签（小程序版本）
   */
  extractSceneTags(text) {
    const sceneKeywords = {
      '校园': ['学校', '校园', '教室', '操场'],
      '职场': ['公司', '办公室', '工作', '职场'],
      '咖啡厅': ['咖啡', '咖啡厅', '咖啡店'],
      '家庭': ['家', '家里', '家庭', '父母'],
      '街道': ['街道', '路上', '街边', '马路']
    };

    const foundTags = [];
    for (const [tag, keywords] of Object.entries(sceneKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        foundTags.push(tag);
      }
    }
    return foundTags.slice(0, 2); // 最多返回2个
  }

  /**
   * 提取主题标签（小程序版本）
   */
  extractThemeTags(text) {
    const themeKeywords = {
      '情感': ['爱情', '恋爱', '感情', '情感'],
      '友情': ['朋友', '友情', '友谊', '伙伴'],
      '亲情': ['家人', '亲情', '父母', '兄弟'],
      '自我': ['自己', '自我', '个人', '独立'],
      '梦想': ['梦想', '理想', '目标', '希望']
    };

    const foundTags = [];
    for (const [tag, keywords] of Object.entries(themeKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        foundTags.push(tag);
      }
    }
    return foundTags.slice(0, 2); // 最多返回2个
  }
}

module.exports = ScriptGenerator;