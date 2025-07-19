# PlzMe 数据库设计文档

## 数据库架构

### 主数据库: MongoDB
用于存储主要业务数据，支持灵活的文档结构和复杂查询。

### 缓存数据库: Redis  
用于存储临时数据、会话信息和热点数据缓存。

## MongoDB 集合设计

### 1. users (用户集合)
```javascript
{
  _id: ObjectId,
  openid: String,          // 微信openid
  unionid: String,         // 微信unionid
  nickname: String,        // 用户昵称
  avatar: String,          // 头像URL
  gender: Number,          // 性别 0未知 1男 2女
  city: String,           // 城市
  province: String,       // 省份
  country: String,        // 国家
  profile: {              // 用户画像
    age: Number,          // 年龄
    personality: [String], // 性格标签
    interests: [String],   // 兴趣标签
    emotionalState: String, // 情感状态
    growthStage: String    // 成长阶段
  },
  preferences: {          // 用户偏好
    favoriteThemes: [String], // 喜欢的主题
    interactionStyle: String, // 互动风格
    difficulty: String        // 难度偏好
  },
  stats: {               // 统计数据
    totalSessions: Number,    // 总对话次数
    totalTime: Number,        // 总使用时长
    completedScripts: Number, // 完成剧本数
    level: Number,           // 用户等级
    experience: Number       // 经验值
  },
  membership: {          // 会员信息
    type: String,        // 会员类型 free/vip
    expireTime: Date,    // 过期时间
    features: [String]   // 可用功能
  },
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean
}
```

### 2. scripts (剧本集合)
```javascript
{
  _id: ObjectId,
  title: String,           // 剧本标题
  subtitle: String,        // 副标题
  description: String,     // 剧本描述
  coverImage: String,      // 封面图片URL
  category: String,        // 分类
  tags: [String],         // 标签
  difficulty: String,      // 难度等级
  duration: Number,        // 预计时长(分钟)
  scenario: {             // 剧本场景
    setting: String,      // 场景设定
    background: String,   // 背景故事
    characters: [{       // 角色列表
      name: String,      // 角色名
      description: String, // 角色描述
      avatar: String,    // 角色头像
      personality: [String] // 性格特征
    }],
    objectives: [String] // 剧本目标
  },
  content: {             // 剧本内容
    introduction: String, // 开场介绍
    scenes: [{          // 场景列表
      id: String,       // 场景ID
      title: String,    // 场景标题
      description: String, // 场景描述
      dialogues: [{     // 对话内容
        speaker: String, // 说话者
        content: String, // 对话内容
        emotion: String, // 情绪标签
        choices: [{     // 选择项
          text: String, // 选择文本
          nextScene: String, // 下一场景
          emotion: String,   // 情绪影响
          score: Number     // 分数影响
        }]
      }]
    }]
  },
  aiConfig: {            // AI配置
    personality: String, // AI人格
    responseStyle: String, // 回复风格
    emotionalTune: String, // 情感调性
    customPrompts: [String] // 自定义提示词
  },
  stats: {              // 统计数据
    viewCount: Number,   // 浏览次数
    playCount: Number,   // 游玩次数
    favoriteCount: Number, // 收藏次数
    averageRating: Number, // 平均评分
    completionRate: Number // 完成率
  },
  status: String,       // 状态 draft/published/archived
  createdBy: ObjectId,  // 创建者ID
  createdAt: Date,
  updatedAt: Date
}
```

### 3. conversations (对话记录集合)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,        // 用户ID
  scriptId: ObjectId,      // 剧本ID
  sessionId: String,       // 会话ID
  title: String,          // 对话标题
  status: String,         // 状态 active/completed/paused
  currentScene: String,   // 当前场景
  progress: Number,       // 进度百分比
  context: {             // 对话上下文
    userRole: String,    // 用户角色
    relationships: {},   // 关系状态
    emotionalState: String, // 情感状态
    keyEvents: [String], // 关键事件
    personalInsights: [String] // 个人洞察
  },
  messages: [{           // 消息列表
    id: String,         // 消息ID
    type: String,       // 消息类型 user/ai/system
    sender: String,     // 发送者
    content: String,    // 消息内容
    emotion: String,    // 情绪标签
    timestamp: Date,    // 时间戳
    choices: [{}],      // 选择项(如果有)
    metadata: {}        // 元数据
  }],
  insights: [{          // 洞察记录
    type: String,       // 洞察类型
    content: String,    // 洞察内容
    timestamp: Date,    // 时间戳
    scene: String       // 相关场景
  }],
  tools: {              // 工具使用记录
    innerMonologue: [{}], // 内心独白
    relationshipReport: [{}], // 关系报告
    customPlot: [{}]    // 自定义剧情
  },
  feedback: {           // 反馈数据
    rating: Number,     // 评分
    helpful: Boolean,   // 是否有帮助
    comments: String,   // 评论
    suggestions: [String] // 建议
  },
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}
```

### 4. activities (活动集合)
```javascript
{
  _id: ObjectId,
  title: String,          // 活动标题
  description: String,    // 活动描述
  type: String,          // 活动类型 workshop/seminar/group
  coverImage: String,    // 封面图片
  location: {            // 地点信息
    city: String,        // 城市
    address: String,     // 详细地址
    venue: String,       // 场所名称
    coordinates: {       // 坐标
      latitude: Number,
      longitude: Number
    }
  },
  schedule: {            // 时间安排
    startTime: Date,     // 开始时间
    endTime: Date,       // 结束时间
    duration: Number,    // 持续时长
    timezone: String     // 时区
  },
  capacity: {            // 容量信息
    maxParticipants: Number, // 最大参与人数
    currentParticipants: Number, // 当前参与人数
    waitingList: Number  // 等待列表人数
  },
  requirements: {        // 参与要求
    ageRange: String,    // 年龄范围
    gender: String,      // 性别要求
    experience: String,  // 经验要求
    membership: String   // 会员要求
  },
  facilitator: {         // 主持人信息
    name: String,        // 姓名
    title: String,       // 职位
    bio: String,         // 简介
    avatar: String       // 头像
  },
  content: {             // 活动内容
    agenda: [String],    // 议程
    materials: [String], // 材料清单
    objectives: [String], // 目标
    takeaways: [String]  // 收获
  },
  pricing: {             // 价格信息
    free: Boolean,       // 是否免费
    memberPrice: Number, // 会员价格
    regularPrice: Number, // 普通价格
    earlyBirdPrice: Number, // 早鸟价格
    currency: String     // 币种
  },
  registration: {        // 报名信息
    startTime: Date,     // 报名开始时间
    endTime: Date,       // 报名结束时间
    requiresApproval: Boolean, // 是否需要审核
    questions: [{}]      // 报名问题
  },
  stats: {              // 统计数据
    viewCount: Number,   // 浏览次数
    applicationCount: Number, // 申请次数
    completionRate: Number,   // 完成率
    satisfactionScore: Number // 满意度
  },
  status: String,       // 状态 draft/open/full/closed/completed
  createdAt: Date,
  updatedAt: Date
}
```

### 5. reports (关系报告集合)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,       // 用户ID
  conversationId: ObjectId, // 对话ID
  type: String,          // 报告类型 relationship/emotional/growth
  title: String,         // 报告标题
  summary: String,       // 报告摘要
  analysis: {            // 分析结果
    patterns: [{}],      // 行为模式
    strengths: [String], // 优势
    challenges: [String], // 挑战
    insights: [String],  // 洞察
    recommendations: [String] // 建议
  },
  visualization: {       // 可视化数据
    charts: [{}],        // 图表数据
    metrics: {},         // 指标数据
    trends: [{}]         // 趋势数据
  },
  createdAt: Date,
  expiresAt: Date,       // 过期时间
  isShared: Boolean,     // 是否分享
  shareToken: String     // 分享令牌
}
```

### 6. favorites (收藏集合)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,      // 用户ID
  targetId: ObjectId,    // 目标ID
  targetType: String,    // 目标类型 script/activity/conversation
  tags: [String],        // 个人标签
  notes: String,         // 个人笔记
  createdAt: Date
}
```

## Redis 缓存设计

### 1. 用户会话缓存
```
Key: session:{userId}
Value: {
  openid: String,
  nickname: String,
  avatar: String,
  loginTime: Number,
  lastActiveTime: Number
}
TTL: 7200 (2小时)
```

### 2. 对话上下文缓存
```
Key: conversation:{sessionId}
Value: {
  userId: String,
  scriptId: String,
  currentScene: String,
  context: Object,
  lastUpdate: Number
}
TTL: 3600 (1小时)
```

### 3. 热门剧本缓存
```
Key: hot_scripts
Value: [
  {
    scriptId: String,
    title: String,
    score: Number
  }
]
TTL: 300 (5分钟)
```

### 4. AI对话缓存
```
Key: ai_response:{hash}
Value: {
  prompt: String,
  response: String,
  timestamp: Number
}
TTL: 1800 (30分钟)
```

## 索引设计

### MongoDB 索引
```javascript
// users 集合
db.users.createIndex({ "openid": 1 }, { unique: true })
db.users.createIndex({ "createdAt": -1 })
db.users.createIndex({ "profile.emotionalState": 1 })

// scripts 集合
db.scripts.createIndex({ "category": 1, "status": 1 })
db.scripts.createIndex({ "tags": 1 })
db.scripts.createIndex({ "stats.viewCount": -1 })
db.scripts.createIndex({ "createdAt": -1 })

// conversations 集合
db.conversations.createIndex({ "userId": 1, "createdAt": -1 })
db.conversations.createIndex({ "scriptId": 1, "status": 1 })
db.conversations.createIndex({ "sessionId": 1 }, { unique: true })

// activities 集合
db.activities.createIndex({ "schedule.startTime": 1, "status": 1 })
db.activities.createIndex({ "location.city": 1 })
db.activities.createIndex({ "type": 1, "status": 1 })

// reports 集合
db.reports.createIndex({ "userId": 1, "createdAt": -1 })
db.reports.createIndex({ "type": 1, "createdAt": -1 })

// favorites 集合
db.favorites.createIndex({ "userId": 1, "targetType": 1 })
db.favorites.createIndex({ "targetId": 1, "targetType": 1 })
```

## 数据一致性策略

### 1. 事务处理
- 用户注册/登录
- 对话记录更新
- 收藏/取消收藏
- 活动报名

### 2. 数据同步
- MongoDB与Redis数据同步
- 定期清理过期数据
- 备份和恢复策略

### 3. 数据验证
- 输入数据验证
- 业务规则验证
- 数据格式验证 