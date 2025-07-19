# PlzMe AI集成方案文档

## AI架构概述

PlzMe的AI系统采用多层次、多模型的架构设计，核心包括：
- **心理剧导演AI**: 主要对话引擎
- **情感分析引擎**: 用户情绪识别与分析
- **个性化推荐系统**: 内容推荐算法
- **高能量女主模式**: 特殊人格AI

## 1. 大语言模型集成

### 1.1 模型选择策略

**主要模型: 百度千帆大模型**
```javascript
// 配置信息
{
  "model": "ERNIE-Bot-4.0",
  "endpoint": "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat",
  "features": [
    "中文理解优秀",
    "心理咨询场景适配",
    "成本相对较低"
  ]
}
```

**备用模型: 腾讯混元**
```javascript
{
  "model": "hunyuan-lite", 
  "endpoint": "https://hunyuan.tencentcloudapi.com",
  "features": [
    "响应速度快",
    "稳定性高",
    "微信生态集成"
  ]
}
```

**兜底模型: 阿里通义千问**
```javascript
{
  "model": "qwen-plus",
  "endpoint": "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
  "features": [
    "高可用性",
    "多样性好"
  ]
}
```

### 1.2 模型调用封装

```javascript
// AI服务抽象层
class AIService {
  constructor() {
    this.primaryModel = new BaiduQianfanModel();
    this.fallbackModels = [
      new TencentHunyuanModel(),
      new AliTongyiModel()
    ];
  }
  
  async generateResponse(prompt, context = {}) {
    try {
      return await this.primaryModel.chat(prompt, context);
    } catch (error) {
      console.log('主模型调用失败，尝试备用模型');
      return await this.tryFallbackModels(prompt, context);
    }
  }
  
  async tryFallbackModels(prompt, context) {
    for (const model of this.fallbackModels) {
      try {
        return await model.chat(prompt, context);
      } catch (error) {
        console.log(`备用模型 ${model.name} 调用失败`);
      }
    }
    throw new Error('所有AI模型都不可用');
  }
}
```

## 2. 心理剧导演AI设计

### 2.1 核心人格设定

```javascript
const DIRECTOR_PERSONALITY = {
  name: "心理剧导演",
  role: "专业心理咨询师 + 剧本导演",
  characteristics: [
    "温和而富有洞察力",
    "善于引导用户自我探索", 
    "具备专业心理学知识",
    "能够营造安全的对话环境"
  ],
  communicationStyle: {
    tone: "温和、专业、支持性",
    approach: "苏格拉底式提问 + 认知行为疗法",
    language: "简洁明了，避免专业术语"
  }
};
```

### 2.2 System Prompt 设计

```javascript
const SYSTEM_PROMPT = `
你是PlzMe应用中的心理剧导演，专门帮助27-35岁的轻熟女性用户通过角色扮演进行自我探索和成长。

## 你的角色特征：
- 温和、专业、富有同理心
- 具备心理咨询专业知识
- 善于通过提问引导用户思考
- 创造安全、无评判的对话环境

## 你的任务：
1. 根据剧本设定，引导用户进入角色
2. 在关键节点提供选择项，推进剧情发展
3. 观察用户的情绪变化，给出及时的情感支持
4. 在适当时机提供心理洞察和成长建议
5. 帮助用户连接剧本情境与现实生活

## 对话原则：
- 每次回复控制在100字以内
- 多用开放式问题，少给直接建议
- 尊重用户的选择和感受
- 避免过度解读或诊断
- 保持专业边界，不替代专业治疗

## 当前剧本信息：
标题：{script_title}
背景：{script_background}
用户角色：{user_role}
当前场景：{current_scene}

请根据用户的回复，自然地推进对话，记住你是在引导一场心理剧表演。
`;
```

### 2.3 情境感知与记忆管理

```javascript
class ConversationContext {
  constructor(scriptId, userId) {
    this.scriptId = scriptId;
    this.userId = userId;
    this.memory = {
      userEmotions: [],      // 用户情绪历史
      keyEvents: [],         // 关键事件
      relationships: {},     // 关系状态
      insights: [],          // 洞察记录
      personality: []        // 用户性格特征
    };
  }
  
  // 更新用户情绪状态
  updateEmotion(emotion, intensity, context) {
    this.memory.userEmotions.push({
      emotion,
      intensity,
      context,
      timestamp: Date.now()
    });
  }
  
  // 记录关键事件
  recordKeyEvent(event, impact) {
    this.memory.keyEvents.push({
      event,
      impact,
      timestamp: Date.now()
    });
  }
  
  // 生成上下文总结
  generateContextSummary() {
    const recentEmotions = this.memory.userEmotions.slice(-5);
    const recentEvents = this.memory.keyEvents.slice(-3);
    
    return {
      emotionalState: this.analyzeEmotionalTrend(recentEmotions),
      recentEvents: recentEvents.map(e => e.event),
      relationshipStatus: this.memory.relationships,
      personalityTraits: this.memory.personality
    };
  }
}
```

## 3. 情感分析引擎

### 3.1 多维度情感识别

```javascript
class EmotionAnalyzer {
  constructor() {
    this.emotionCategories = {
      basic: ['喜悦', '悲伤', '愤怒', '恐惧', '惊讶', '厌恶'],
      complex: ['焦虑', '内疚', '羞耻', '骄傲', '嫉妒', '感激'],
      social: ['孤独', '被理解', '被拒绝', '归属感', '安全感']
    };
  }
  
  async analyzeEmotion(text, context) {
    const prompt = `
    请分析以下文本的情感状态：
    
    文本："${text}"
    
    请返回JSON格式：
    {
      "primaryEmotion": "主要情绪",
      "intensity": 0.8,
      "dimensions": {
        "basic": ["情绪1"],
        "complex": ["情绪1"], 
        "social": ["情绪1"]
      }
    }
    `;
    
    const result = await this.aiService.analyze(prompt);
    return this.parseEmotionResult(result);
  }
}
```

### 3.2 情绪调节建议

```javascript
class EmotionRegulationAdvisor {
  constructor() {
    this.strategies = {
      '焦虑': [
        {
          type: 'breathing',
          name: '深呼吸练习',
          description: '进行4-7-8呼吸法，帮助放松身心'
        },
        {
          type: 'cognitive',
          name: '认知重构',
          description: '尝试从不同角度看待当前的担心'
        }
      ],
      '愤怒': [
        {
          type: 'physical',
          name: '身体放松',
          description: '进行渐进性肌肉放松练习'
        },
        {
          type: 'expression',
          name: '情绪表达',
          description: '用"我感到..."的方式表达感受'
        }
      ]
      // ... 更多情绪调节策略
    };
  }
  
  getRegulationAdvice(emotion, intensity, context) {
    const strategies = this.strategies[emotion] || [];
    return strategies.filter(s => 
      this.isApplicable(s, intensity, context)
    );
  }
}
```

## 4. 高能量女主模式

### 4.1 人格转换机制

```javascript
class HighEnergyMode {
  constructor() {
    this.personalityAdjustments = {
      confidence: +3,        // 自信度提升
      assertiveness: +2,     // 坚定性提升  
      optimism: +2,         // 乐观度提升
      expressiveness: +1     // 表达力提升
    };
    
    this.responsePatterns = [
      "你完全有能力处理这种情况",
      "相信你的直觉和判断",
      "现在正是展现你力量的时候",
      "你值得更好的对待",
      "勇敢地表达你的真实想法"
    ];
  }
  
  async generateHighEnergyResponse(originalPrompt, userInput) {
    const enhancedPrompt = `
    ${originalPrompt}
    
    ## 特殊模式：高能量女主
    现在用户处于"高能量女主"模式，请以更加自信、坚定、积极的语调回复：
    - 鼓励用户展现自信和力量
    - 强调用户的价值和能力
    - 引导用户勇敢表达真实想法
    - 支持用户做出有利于自己的选择
    
    保持温暖和支持，但语气更加坚定有力。
    `;
    
    return await this.aiService.generateResponse(enhancedPrompt, {
      energyLevel: 'high',
      userInput
    });
  }
}
```

### 4.2 能量状态管理

```javascript
class EnergyStateManager {
  constructor() {
    this.states = {
      normal: { confidence: 0, duration: Infinity },
      high: { confidence: 3, duration: 10 }, // 10轮对话
      boost: { confidence: 2, duration: 5 }  // 5轮对话
    };
  }
  
  activateEnergyBoost(userId, conversationId, duration = 10) {
    const boostData = {
      userId,
      conversationId,
      startTime: Date.now(),
      remainingTurns: duration,
      energyLevel: 'high'
    };
    
    // 存储到Redis缓存
    return this.cacheService.set(
      `energy_boost:${conversationId}`, 
      boostData, 
      3600 // 1小时过期
    );
  }
  
  checkEnergyState(conversationId) {
    return this.cacheService.get(`energy_boost:${conversationId}`);
  }
  
  decrementEnergyTurn(conversationId) {
    const state = this.checkEnergyState(conversationId);
    if (state && state.remainingTurns > 0) {
      state.remainingTurns--;
      this.cacheService.set(`energy_boost:${conversationId}`, state, 3600);
    }
    return state;
  }
}
```

## 5. 工具系统AI实现

### 5.1 内心独白生成

```javascript
class InnerMonologueGenerator {
  async generateMonologue(userInput, conversationContext) {
    const prompt = `
    作为心理剧导演，请为用户生成一段内心独白。
    
    用户当前状态：
    - 刚刚说的话："${userInput}"
    - 情绪状态：${conversationContext.emotionalState}
    - 关系状况：${JSON.stringify(conversationContext.relationships)}
    
    请生成一段80-120字的内心独白，要求：
    1. 体现用户的真实内心感受
    2. 包含一些平时不敢说出口的想法
    3. 帮助用户更好地理解自己
    4. 语气要像用户在对自己说话
    
    格式：直接返回独白内容，用第一人称。
    `;
    
    const monologue = await this.aiService.generateResponse(prompt);
    
    // 同时生成相关洞察
    const insights = await this.generateInsights(monologue, conversationContext);
    
    return {
      content: monologue,
      insights,
      emotions: await this.emotionAnalyzer.analyzeEmotion(monologue)
    };
  }
  
  async generateInsights(monologue, context) {
    const prompt = `
    基于以下内心独白，请生成2-3个心理洞察：
    
    独白："${monologue}"
    
    请从以下角度分析：
    1. 情绪模式识别
    2. 行为动机分析  
    3. 成长机会点
    
    每个洞察控制在30字以内，要温和且具有启发性。
    `;
    
    return await this.aiService.generateResponse(prompt);
  }
}
```

### 5.2 关系报告生成

```javascript
class RelationshipReportGenerator {
  async generateReport(conversationId, reportType) {
    const conversation = await this.getConversationData(conversationId);
    const analysisData = await this.analyzeConversation(conversation);
    
    const prompt = `
    请基于用户的对话记录生成一份${reportType}报告。
    
    对话数据分析：
    ${JSON.stringify(analysisData)}
    
    报告要求：
    1. 总结用户的行为模式和情绪特征
    2. 识别优势和成长空间
    3. 提供具体的改善建议
    4. 语言专业但易懂，避免负面标签
    
    请返回JSON格式：
    {
      "summary": "报告摘要",
      "patterns": [{"type": "", "description": "", "score": 0}],
      "strengths": ["优势1", "优势2"],
      "challenges": ["挑战1", "挑战2"], 
      "insights": ["洞察1", "洞察2"],
      "recommendations": ["建议1", "建议2"]
    }
    `;
    
    const reportData = await this.aiService.generateResponse(prompt);
    
    // 生成可视化数据
    const visualization = await this.generateVisualization(reportData);
    
    return {
      ...reportData,
      visualization,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30天过期
    };
  }
}
```

### 5.3 自定义剧情生成

```javascript
class CustomPlotGenerator {
  async generateCustomPlot(scenario, characters, objectives, userContext) {
    const prompt = `
    请为用户创建一个自定义的心理剧情节。
    
    用户设定：
    - 场景：${scenario}
    - 角色：${characters.join(', ')}
    - 目标：${objectives.join(', ')}
    
    用户背景：
    - 当前情绪：${userContext.emotionalState}
    - 关注议题：${userContext.concerns.join(', ')}
    
    请生成一个200字左右的剧情开头，包括：
    1. 场景设置和背景
    2. 角色关系和冲突点
    3. 第一个互动选择
    
    风格要求：
    - 贴近现实生活
    - 有助于用户探索内心
    - 提供成长机会
    `;
    
    const plotContent = await this.aiService.generateResponse(prompt);
    
    // 生成后续发展路径
    const nextSteps = await this.generateNextSteps(plotContent, userContext);
    
    return {
      plotId: this.generateId(),
      content: plotContent,
      nextSteps,
      metadata: {
        scenario,
        characters, 
        objectives,
        createdAt: new Date()
      }
    };
  }
}
```

## 6. 个性化推荐系统

### 6.1 用户画像构建

```javascript
class UserProfileBuilder {
  async buildProfile(userId) {
    const userData = await this.getUserData(userId);
    const conversationHistory = await this.getConversationHistory(userId);
    
    const profile = {
      demographics: {
        age: userData.age,
        city: userData.city
      },
      personality: await this.extractPersonality(conversationHistory),
      interests: await this.extractInterests(conversationHistory),
      emotionalPatterns: await this.analyzeEmotionalPatterns(conversationHistory),
      preferences: {
        interactionStyle: await this.inferInteractionStyle(conversationHistory),
        topicPreferences: await this.extractTopicPreferences(conversationHistory),
        difficultyLevel: await this.assessDifficultyPreference(conversationHistory)
      }
    };
    
    return profile;
  }
  
  async extractPersonality(conversations) {
    const prompt = `
    基于用户的对话记录，分析用户的性格特征：
    
    ${this.summarizeConversations(conversations)}
    
    请从以下维度分析：
    1. 外向性 vs 内向性
    2. 情绪稳定性
    3. 开放性
    4. 尽责性
    5. 宜人性
    
    返回JSON格式的性格标签数组。
    `;
    
    return await this.aiService.generateResponse(prompt);
  }
}
```

### 6.2 智能推荐算法

```javascript
class SmartRecommendationEngine {
  async recommendScripts(userId, limit = 5) {
    const userProfile = await this.userProfileBuilder.buildProfile(userId);
    const allScripts = await this.getAvailableScripts();
    
    // 计算匹配度
    const scoredScripts = allScripts.map(script => ({
      ...script,
      matchScore: this.calculateMatchScore(script, userProfile)
    }));
    
    // 排序并返回推荐
    return scoredScripts
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  }
  
  calculateMatchScore(script, userProfile) {
    let score = 0;
    
    // 主题匹配 (权重: 0.3)
    const themeMatch = this.calculateThemeMatch(script.themes, userProfile.interests);
    score += themeMatch * 0.3;
    
    // 难度匹配 (权重: 0.2)  
    const difficultyMatch = this.calculateDifficultyMatch(script.difficulty, userProfile.preferences.difficultyLevel);
    score += difficultyMatch * 0.2;
    
    // 情绪状态匹配 (权重: 0.3)
    const emotionMatch = this.calculateEmotionMatch(script.emotionalFocus, userProfile.emotionalPatterns);
    score += emotionMatch * 0.3;
    
    // 历史偏好 (权重: 0.2)
    const historyMatch = this.calculateHistoryMatch(script, userProfile.preferences);
    score += historyMatch * 0.2;
    
    return score;
  }
}
```

## 7. AI安全与监控

### 7.1 内容安全审核

```javascript
class ContentSafetyFilter {
  constructor() {
    this.sensitiveTopics = [
      '自伤', '自杀', '极端行为', '违法活动',
      '性内容', '暴力', '歧视', '仇恨言论'
    ];
    
    this.riskKeywords = [
      '想死', '活不下去', '伤害自己', '结束生命'
    ];
  }
  
  async checkContent(content, context) {
    // 关键词检测
    const keywordRisk = this.checkRiskKeywords(content);
    
    // AI内容审核
    const aiReview = await this.aiContentReview(content);
    
    // 上下文风险评估
    const contextRisk = this.assessContextRisk(context);
    
    const riskLevel = Math.max(keywordRisk, aiReview.riskLevel, contextRisk);
    
    return {
      riskLevel,
      reasons: [...aiReview.reasons],
      recommendations: this.getRiskHandlingRecommendations(riskLevel),
      shouldBlock: riskLevel > 0.8
    };
  }
  
  async aiContentReview(content) {
    const prompt = `
    请审核以下内容是否包含风险信息：
    
    内容："${content}"
    
    审核维度：
    1. 自伤自杀倾向
    2. 极端情绪表达
    3. 不当社交建议
    4. 其他安全风险
    
    返回风险等级(0-1)和具体原因。
    `;
    
    return await this.safetyAIService.analyze(prompt);
  }
}
```

### 7.2 用户心理危机识别

```javascript
class CrisisDetectionSystem {
  constructor() {
    this.crisisIndicators = [
      '持续低落情绪超过2周',
      '表达自伤或自杀想法',
      '严重睡眠或食欲问题',
      '社交完全退缩',
      '极端绝望感'
    ];
  }
  
  async detectCrisis(userId, conversationData) {
    const riskFactors = await this.analyzeRiskFactors(conversationData);
    const emotionalTrend = await this.analyzeEmotionalTrend(userId);
    const behaviorChanges = await this.detectBehaviorChanges(userId);
    
    const riskScore = this.calculateRiskScore({
      riskFactors,
      emotionalTrend,
      behaviorChanges
    });
    
    if (riskScore > 0.7) {
      await this.triggerCrisisResponse(userId, riskScore);
    }
    
    return {
      riskScore,
      riskLevel: this.getRiskLevel(riskScore),
      recommendations: this.getCrisisRecommendations(riskScore)
    };
  }
  
  async triggerCrisisResponse(userId, riskScore) {
    // 记录危机事件
    await this.logCrisisEvent(userId, riskScore);
    
    // 提供专业资源信息
    const resources = this.getMentalHealthResources();
    
    // 如果风险极高，考虑人工干预
    if (riskScore > 0.9) {
      await this.notifyHumanSupport(userId, riskScore);
    }
    
    return resources;
  }
}
```

## 8. 性能优化策略

### 8.1 AI响应缓存

```javascript
class AIResponseCache {
  constructor() {
    this.cache = new Redis();
    this.cacheConfig = {
      ttl: 1800, // 30分钟
      maxSize: 10000
    };
  }
  
  generateCacheKey(prompt, context) {
    const contextHash = crypto
      .createHash('md5')
      .update(JSON.stringify(context))
      .digest('hex');
    
    const promptHash = crypto
      .createHash('md5') 
      .update(prompt)
      .digest('hex');
      
    return `ai_response:${promptHash}:${contextHash}`;
  }
  
  async getCachedResponse(prompt, context) {
    const key = this.generateCacheKey(prompt, context);
    const cached = await this.cache.get(key);
    
    if (cached) {
      return JSON.parse(cached);
    }
    
    return null;
  }
  
  async setCachedResponse(prompt, context, response) {
    const key = this.generateCacheKey(prompt, context);
    await this.cache.setex(
      key, 
      this.cacheConfig.ttl,
      JSON.stringify(response)
    );
  }
}
```

### 8.2 批量处理与异步优化

```javascript
class AIBatchProcessor {
  constructor() {
    this.batchQueue = [];
    this.batchSize = 5;
    this.batchTimeout = 2000; // 2秒
  }
  
  async processRequest(request) {
    return new Promise((resolve, reject) => {
      this.batchQueue.push({ request, resolve, reject });
      
      if (this.batchQueue.length >= this.batchSize) {
        this.processBatch();
      } else {
        this.scheduleBatchProcess();
      }
    });
  }
  
  async processBatch() {
    if (this.batchQueue.length === 0) return;
    
    const batch = this.batchQueue.splice(0, this.batchSize);
    
    try {
      const results = await Promise.all(
        batch.map(item => this.aiService.generateResponse(item.request))
      );
      
      batch.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      batch.forEach(item => {
        item.reject(error);
      });
    }
  }
}
```

## 9. 监控与分析

### 9.1 AI性能监控

```javascript
class AIPerformanceMonitor {
  constructor() {
    this.metrics = {
      responseTime: [],
      successRate: 0,
      errorRate: 0,
      userSatisfaction: []
    };
  }
  
  async trackAICall(modelName, prompt, startTime, endTime, success) {
    const responseTime = endTime - startTime;
    
    await this.recordMetrics({
      model: modelName,
      responseTime,
      success,
      timestamp: Date.now()
    });
    
    // 实时告警
    if (responseTime > 5000) { // 超过5秒
      await this.sendSlowResponseAlert(modelName, responseTime);
    }
    
    if (!success) {
      await this.sendErrorAlert(modelName, prompt);
    }
  }
  
  async generatePerformanceReport() {
    const report = {
      averageResponseTime: this.calculateAverageResponseTime(),
      successRate: this.calculateSuccessRate(),
      modelComparison: await this.compareModelPerformance(),
      userFeedback: await this.analyzeUserFeedback(),
      recommendations: this.generateOptimizationRecommendations()
    };
    
    return report;
  }
}
```

### 9.2 用户体验分析

```javascript
class UserExperienceAnalyzer {
  async analyzeConversationQuality(conversationId) {
    const conversation = await this.getConversation(conversationId);
    
    const quality = {
      engagement: this.calculateEngagement(conversation),
      coherence: await this.analyzeCoherence(conversation),
      emotionalSupport: await this.analyzeEmotionalSupport(conversation),
      goalAchievement: this.assessGoalAchievement(conversation),
      userSatisfaction: await this.getUserFeedback(conversationId)
    };
    
    return quality;
  }
  
  async calculateEngagement(conversation) {
    const indicators = {
      messageLength: this.analyzeMessageLength(conversation.messages),
      responseTime: this.analyzeResponseTime(conversation.messages),
      emotionalExpression: await this.analyzeEmotionalExpression(conversation),
      toolUsage: this.analyzeToolUsage(conversation.tools)
    };
    
    return this.weightedAverage(indicators, {
      messageLength: 0.3,
      responseTime: 0.2,
      emotionalExpression: 0.3,
      toolUsage: 0.2
    });
  }
}
```

这个AI集成方案提供了PlzMe应用完整的人工智能功能实现，包括对话生成、情感分析、个性化推荐等核心能力，同时考虑了安全性、性能和用户体验的平衡。 