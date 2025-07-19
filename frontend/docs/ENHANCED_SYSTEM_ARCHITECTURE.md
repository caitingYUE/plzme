# PLZME 增强剧本系统架构文档

## 概述

本文档描述了PLZME心理剧本平台的增强系统架构，重点关注基于用户真实故事的动态剧本生成、无限流体验和个性化场景管理。

## 核心特色

### 🎯 真实感 + 无限流
- **真实故事基础**：基于用户投稿的真实故事MD文件自动生成剧本信息
- **无限内容体验**：每次进入都有新故事，支持无限场景延伸
- **智能提示系统**：根据用户历史智能提示继续或重新开始

## 系统架构

### 1. 剧本生成层 (ScriptGenerator)

#### 功能职责
- 解析用户投稿的MD文件
- 自动生成符合产品要求的剧本信息
- 提供标准化的剧本数据结构

#### 核心算法

##### 标题生成 (5-15字)
```javascript
// 标题要求：真实、故事感、戏剧张力、吸引力
generateTitle(parsed) {
  // 提取关键词和情感词汇
  const keywords = this.extractKeywords(parsed.mainStory);
  const emotionalWords = this.extractEmotionWords(parsed.mainStory);
  
  // 使用模板生成策略
  const titleTemplates = [
    `${keywords[0]}的${emotionalWords[0]}`,
    `那个${keywords[0]}`,
    `${emotionalWords[0]}${keywords[0]}`
  ];
}
```

##### 简介生成 (100字内)
```javascript
// 简介要求：第一视角复述，体现真实感和戏剧张力
generateSummary(parsed) {
  const coreElements = this.extractCoreElements(parsed.mainStory);
  return `我${coreElements.action}，${coreElements.emotion}。${coreElements.conflict}，${coreElements.resolution}。这是一个关于${coreElements.theme}的真实故事。`;
}
```

##### 标签系统 (1-3个)
```javascript
// 标签要求：第一个必须是人群标签，后面最多3个情感标签
generateTags(parsed) {
  const tags = [];
  
  // 第一个标签：人群标签
  const scriptType = this.determineScriptType(parsed); // 男主本/女主本/双女主/双男主/不限人群
  tags.push(scriptType);
  
  // 后续标签：情感标签（能提炼故事亮点和差异点）
  const emotionKeywords = this.extractEmotionWords(parsed.mainStory);
  const matchedTags = this.matchEmotionTags(emotionKeywords);
  tags.push(...matchedTags.slice(0, 2));
  
  return tags;
}
```

##### 场景生成 (30个)
```javascript
// 场景要求：包含名称和30字内简介，支持无限延伸
generateScenes(parsed) {
  const sceneTemplates = [
    { phase: 'opening', count: 5 },      // 开篇
    { phase: 'development', count: 10 }, // 发展
    { phase: 'conflict', count: 8 },     // 冲突
    { phase: 'resolution', count: 7 }    // 结局
  ];
  
  // 为每个阶段生成相应数量的场景
  // 场景名称要反映故事进展，描述要在30字以内
}
```

### 2. 增强剧本管理层 (EnhancedScriptManager)

#### 功能职责
- 整合ScriptGenerator生成的剧本数据
- 管理用户进度和会话状态
- 实现无限流场景生成
- 提供个性化体验

#### 核心功能

##### 用户进度管理
```javascript
class UserProgress {
  userId: string;
  scriptId: string;
  currentSceneIndex: number;
  sessionCount: number;           // 会话次数
  totalTimeSpent: number;        // 总时长
  lastAccess: Date;              // 最后访问时间
  completedScenes: Array;        // 已完成场景
  userResponses: Array;          // 用户回应历史
  emotionalJourney: Array;       // 情感历程
}
```

##### 无限流场景生成
```javascript
generateDynamicScene(userId, scriptId, progress) {
  // 1. 检查缓存
  const cacheKey = `${userId}_${scriptId}_${progress.currentSceneIndex}`;
  
  // 2. 动态生成新场景
  const newScene = {
    name: this.generateSceneName(progress, script),
    description: this.generateSceneDescription(progress, script),
    phase: this.determinePhase(progress.currentSceneIndex, script.totalScenes),
    isNewContent: true,
    totalScenes: '∞' // 无限场景标识
  };
  
  // 3. 缓存场景以确保一致性
  this.sceneCache.set(cacheKey, newScene);
  return newScene;
}
```

##### 智能提示系统
```javascript
shouldContinueDialog(userId, scriptId) {
  const progress = this.getUserProgress(userId, scriptId);
  const timeSinceLastAccess = Date.now() - progress.lastAccess.getTime();
  
  return {
    shouldPrompt: timeSinceLastAccess > 24 * 60 * 60 * 1000, // 24小时
    message: '距离上次对话已过去一段时间，是否继续探索这个故事？'
  };
}
```

### 3. API服务层 (script-scene.js)

#### 核心端点

##### 获取当前场景
```http
GET /api/script-scene/current?userId={userId}&scriptId={scriptId}
```
- 检查是否需要提示继续对话
- 返回当前场景信息（可能是新生成的）

##### 开始新会话
```http
POST /api/script-scene/new-session
{
  "userId": "string",
  "scriptId": "string"
}
```
- 清除旧的场景缓存
- 启动新的探索体验
- 返回第一个场景

##### 获取下一个场景
```http
POST /api/script-scene/next
{
  "userId": "string",
  "scriptId": "string",
  "userResponse": "string"
}
```
- 记录用户回应
- 更新进度到下一个场景
- 可能触发动态场景生成

### 4. 前端集成层

#### 剧本详情页面增强
```javascript
// 支持无限流的启动流程
async startScript() {
  const userId = this.getUserId();
  const scriptId = `script_${this.data.scriptData.id}`;
  
  // 检查历史记录
  const hasHistory = this.checkUserHistory(userId, scriptId);
  
  if (hasHistory) {
    // 显示选择：新的开始 vs 继续对话
    this.showContinueDialog(userId, scriptId);
  } else {
    // 直接开始新会话
    this.startNewSession(userId, scriptId);
  }
}
```

#### 场景提示系统
```javascript
// 在对话界面显示场景信息
displayScenePrompt(scene) {
  if (scene.isNewContent) {
    // 显示"全新内容"标识
    this.showToast('🌟 探索全新的故事情节');
  }
  
  // 在页面居中展示场景提示（斜体、小字）
  this.setData({
    scenePrompt: `*${scene.description}*`,
    isInfiniteMode: scene.totalScenes === '∞'
  });
}
```

## 数据流程

### 1. 剧本初始化流程
```
MD文件 → ScriptGenerator → 解析内容 → 生成剧本信息 → EnhancedScriptManager → 转换格式 → 剧本数据库
```

### 2. 用户体验流程
```
用户进入 → 检查历史 → 选择模式 → 获取场景 → 对话交互 → 更新进度 → 下一场景 → (可能生成新场景)
```

### 3. 无限流触发条件
- 用户重新进入剧本（70%概率生成新内容）
- 超出预设30个场景范围
- 用户明确选择"新的开始"

## 配置参数

### 剧本生成配置
```javascript
const CONFIG = {
  title: {
    minLength: 5,
    maxLength: 15,
    requirements: ['真实', '故事感', '戏剧张力', '吸引力']
  },
  summary: {
    maxLength: 100,
    perspective: '第一人称',
    requirements: ['真实感', '戏剧张力']
  },
  tags: {
    count: { min: 1, max: 3 },
    structure: ['人群标签', '情感标签1', '情感标签2?']
  },
  scenes: {
    count: 30,
    descriptionMaxLength: 30,
    phases: ['opening', 'development', 'conflict', 'resolution']
  }
};
```

### 无限流配置
```javascript
const INFINITE_MODE = {
  enabled: true,
  sceneVariations: 5,              // 每个场景的变化数量
  newContentThreshold: 0.7,        // 70%概率生成新内容
  personalizedScenes: true,        // 基于用户历史个性化
  cacheExpiry: 24 * 60 * 60 * 1000 // 24小时缓存过期
};
```

## 特色亮点

### 1. 自动内容生成
- **标题生成**：基于故事核心自动生成吸引人的标题
- **简介提炼**：第一视角复述，突出戏剧张力
- **标签智能匹配**：自动识别人群和情感标签
- **场景分层设计**：30个基础场景 + 无限动态场景

### 2. 无限流体验
- **动态场景生成**：基于用户进度和偏好动态创建新场景
- **个性化内容**：根据用户历史回应调整场景内容
- **缓存机制**：确保同一会话中场景的一致性
- **智能提示**：根据时间间隔智能提示用户选择

### 3. 用户体验优化
- **进度管理**：完整的用户会话和进度跟踪
- **选择权**：用户可选择继续或重新开始
- **视觉反馈**：清晰的新内容标识和场景提示
- **无缝集成**：与现有聊天系统无缝集成

### 4. 技术特色
- **模块化设计**：ScriptGenerator和EnhancedScriptManager职责分离
- **异步处理**：支持异步剧本初始化
- **错误处理**：完善的错误处理和回退机制
- **可扩展性**：易于添加新的生成策略和场景类型

## 部署建议

### 1. 初始化
```bash
# 运行剧本生成测试
node test-script-generator.js

# 运行增强系统测试
node test-enhanced-system.js
```

### 2. 生产环境配置
- 调整缓存策略以适应实际用户量
- 配置定期清理过期的用户进度数据
- 监控动态场景生成的性能
- 收集用户反馈以优化生成算法

### 3. 扩展方向
- 集成AI生成更丰富的场景内容
- 添加情感分析以更好地匹配场景
- 支持用户自定义场景偏好
- 开发多语言支持 