# 增强对话交互系统文档

## 概述

增强对话交互系统实现了基于选择卡+自由输入的混合交互模式，为用户提供了更丰富、更专业的心理剧体验。

## 核心功能

### 1. 场景介绍系统

每个场景开始时提供：
- **场景名称和描述**：居中斜体小字展示
- **AI角色介绍**：说明AI在该场景中扮演的角色
- **情境设定**：为用户营造真实的心理剧氛围

```javascript
// 场景介绍示例
{
  type: 'scene_intro',
  content: '*两人关系模糊不清的深夜对话 - 在这个场景中，你们将面对关系定义不明确带来的焦虑和困惑*',
  style: 'italic-small-center'
}
```

### 2. 交互模式

#### 选择卡模式（主要）
- **智能选择生成**：根据对话阶段生成3-4个选择选项
- **心理学维度标注**：每个选择都标明心理维度（如：攻击性-温和性、主动性-被动性）
- **影响预告**：提示选择可能产生的影响
- **动态适配**：根据用户选择历史调整后续选项

```javascript
// 选择卡示例
{
  id: 'choice_gentle_probe_123',
  text: '委婉地试探对方的想法',
  type: 'gentle_probe',
  psychologicalDimension: '温和性-主动性',
  impact: '可能获得更多信息，但也可能让对方察觉你的不安',
  description: '以温和的方式表达关心，探索对方的真实想法'
}
```

#### 自由输入模式（辅助）
- **关键节点开放**：在重要对话节点开放文本输入
- **实时分析**：分析情感倾向、意图和关键词
- **智能匹配**：将输入映射到最接近的预设剧本分支
- **长度限制**：建议1-2句话，避免过长输入

```javascript
// 输入分析示例
{
  emotion: 'sadness',
  intent: 'probing',
  keywords: ['关系', '困惑'],
  analysis: {
    isAngry: false,
    isSad: true,
    isProbing: true,
    isBreakupRelated: false
  }
}
```

### 3. 特殊功能

#### 对方内心独白 🔍
- **固定内容**：每个场景的独白是固定的（生成一次并缓存）
- **角色视角**：展示对方的真实想法和动机
- **理解辅助**：帮助用户理解对方的行为逻辑

#### 高能模式 ⚡️
- **性格分析**：基于用户选择历史分析性格特点
- **自信回复**：生成更加高能量、自信的版本回复
- **AI演示**：用户无需输入，系统自动演示
- **场景限定**：仅针对单个场景有效

#### 当前关系分析 📋
- **交互门槛**：至少进行3轮交互后才能生成
- **综合评估**：基于用户的所有互动表现
- **成长指导**：提供正向的行动建议和情绪疗愈建议

### 4. 对话设计原则

#### 用户行动点设置
- **避免碎片化**：在每幕结尾或冲突高峰处设置行动点
- **非每句都选**：避免频繁打断对话流程
- **关键时刻**：在重要决策点提供选择

#### 选择设计原则
- **心理学维度**：体现不同的心理反应模式
- **影响标注**：说明潜在后果，避免"正确/错误"暗示
- **探索导向**：强调"探索不同可能性"而非寻找标准答案

```javascript
// 选择类型分类
const choiceTypes = {
  opening: ['gentle_probe', 'direct_question', 'silent_observe', 'topic_shift'],
  development: ['emotional_express', 'logical_analyze', 'empathy_respond', 'boundary_set'],
  conflict: ['confrontation', 'compromise', 'self_reflection', 'space_request'],
  resolution: ['future_commit', 'wise_accept', 'growth_focus', 'gratitude_express']
};
```

### 5. 场景切换机制

#### 切换条件
- **交互次数**：达到8次交互后建议切换
- **剧情完整性**：当前场景的主要冲突得到探索
- **用户选择**：用户可以选择继续或切换

#### 切换流程
1. **提示出现**：显示场景切换卡片
2. **用户选择**：继续对话 或 重新开始
3. **数据保存**：保存当前场景的对话记录
4. **场景切换**：切换到下一个场景并重新初始化

```javascript
// 场景切换数据
{
  nextScene: {
    name: '深度沟通的契机',
    description: '在理解的基础上进行更深入的对话'
  },
  prompt: '进入新场景：深度沟通的契机（在理解的基础上进行更深入的对话），是否继续对话？',
  canContinue: true
}
```

### 6. 关系报告生成

#### 生成时机
- **场景完成**：当前场景演绎完成后
- **主动请求**：用户点击关系分析按钮
- **定期生成**：每隔一定交互次数自动生成

#### 报告内容
```javascript
// 关系报告结构
{
  relationshipStatus: '正在探索和磨合中，双方都在寻找合适的相处模式',
  userTraits: ['善于观察', '情感细腻', '渴望理解', '勇于表达'],
  recommendations: [
    '保持真诚沟通',
    '建立健康边界', 
    '培养自我价值感'
  ],
  encouragement: '你的真诚和勇气值得被珍惜，继续做那个敢于表达的自己'
}
```

## 技术实现

### 核心类结构

```javascript
class EnhancedChatManager {
  // 会话管理
  async initializeSession(userId, scriptId, sessionParams)
  async processUserInteraction(sessionKey, interaction)
  
  // 交互处理
  async processChoiceInteraction(sessionData, interaction)
  async processFreeInputInteraction(sessionData, interaction)
  async processSpecialFeature(sessionData, interaction)
  
  // 特殊功能
  async generateInnerMonologue(sessionData)
  async activateHighEnergyMode(sessionData)
  async generateRelationshipAnalysis(sessionData)
  
  // 分析引擎
  analyzeChoice(choice)
  analyzeUserInput(text)
  getChoiceDimensions(phase)
}
```

### 前端组件

#### 选择卡组件
```xml
<view class="choice-card {{choice.type}}" bindtap="selectChoice">
  <view class="choice-content">
    <text class="choice-text">{{choice.text}}</text>
    <view class="choice-dimension">{{choice.psychologicalDimension}}</view>
  </view>
  <view class="choice-impact">
    <text class="impact-hint">{{choice.impact}}</text>
  </view>
</view>
```

#### 特殊功能按钮
```xml
<view class="func-card inner-monologue" bindtap="activateInnerMonologue">
  <view class="func-icon">🔍</view>
  <view class="func-text">对方内心独白</view>
  <view class="func-desc">了解对方真实想法</view>
</view>
```

## 使用指南

### 用户体验流程

1. **进入场景**
   - 阅读场景介绍（居中斜体小字）
   - 了解AI角色设定
   - 接收AI的开场对话

2. **选择互动**
   - 查看4个选择卡选项
   - 了解每个选择的心理维度和影响
   - 点击选择感兴趣的回应方式

3. **观察反馈**
   - 查看AI的回应和对话发展
   - 注意选择产生的实际影响
   - 根据情况调整后续策略

4. **使用特殊功能**
   - 3轮交互后解锁特殊功能
   - 查看对方内心独白了解真实想法
   - 使用高能模式体验自信回复
   - 生成关系分析获得成长建议

5. **场景切换**
   - 8轮交互后出现切换提示
   - 选择继续当前场景或进入新场景
   - 在新场景中应用已学到的经验

### 开发者集成

```javascript
// 初始化增强聊天
const chatManager = new EnhancedChatManager();
const sessionData = await chatManager.initializeSession(userId, scriptId);

// 处理用户选择
const result = await chatManager.processUserInteraction(sessionKey, {
  type: 'choice',
  choice: selectedChoice,
  choiceIndex: index
});

// 处理自由输入
const result = await chatManager.processUserInteraction(sessionKey, {
  type: 'free_input',
  text: userInput
});

// 激活特殊功能
const result = await chatManager.processUserInteraction(sessionKey, {
  type: 'special_feature',
  featureType: 'inner_monologue' // 'high_energy_mode' | 'relationship_analysis'
});
```

## 配置选项

### 选择卡配置
```javascript
const choiceConfig = {
  maxChoices: 4,           // 最大选择数量
  showImpact: true,        // 是否显示影响提示
  showDimension: true,     // 是否显示心理维度
  enableAnimation: true    // 是否启用动画效果
};
```

### 特殊功能配置
```javascript
const featureConfig = {
  innerMonologue: {
    enabled: true,
    cacheResults: true,    // 缓存结果
    maxLength: 150         // 最大字符数
  },
  highEnergyMode: {
    enabled: true,
    cooldown: 0,          // 冷却时间（毫秒）
    analysisDepth: 'deep' // 分析深度
  },
  relationshipAnalysis: {
    enabled: true,
    minInteractions: 3,   // 最小交互次数
    includeAdvice: true   // 包含建议
  }
};
```

## 最佳实践

### 对话设计
1. **真实性优先**：基于真实用户故事设计场景
2. **情感导向**：重视情感体验而非逻辑推理
3. **成长导向**：每个选择都应促进用户自我认知
4. **安全边界**：避免过度深入敏感话题

### 技术优化
1. **性能优化**：缓存常用的AI生成内容
2. **错误处理**：提供降级方案确保功能可用
3. **数据保护**：用户对话数据本地化存储
4. **扩展性**：模块化设计便于功能扩展

### 用户引导
1. **渐进式学习**：从简单选择开始，逐步复杂化
2. **即时反馈**：选择后立即显示影响和结果
3. **成长激励**：定期提供正向反馈和成长建议
4. **自主控制**：用户可以随时切换交互模式

## 总结

增强对话交互系统通过选择卡+自由输入的混合模式，结合特殊功能和智能分析，为用户提供了一个专业、丰富、个性化的心理剧体验平台。系统既保证了对话的专业性和引导性，又给予了用户足够的自主性和探索空间。 