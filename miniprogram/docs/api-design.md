# PlzMe API 接口设计文档

## API 基础信息

### 基础路径
```
开发环境: https://dev-api.plzme.com
生产环境: https://api.plzme.com
```

### 通用响应格式
```javascript
{
  "code": 200,        // 状态码
  "message": "success", // 消息
  "data": {},         // 数据
  "timestamp": 1635724800000 // 时间戳
}
```

### 错误码定义
```javascript
{
  200: "成功",
  400: "请求参数错误", 
  401: "未授权",
  403: "禁止访问",
  404: "资源不存在",
  500: "服务器内部错误",
  1001: "用户不存在",
  1002: "登录已过期",
  2001: "剧本不存在",
  2002: "剧本已下架",
  3001: "对话不存在",
  3002: "对话已结束"
}
```

## 1. 用户相关接口

### 1.1 用户登录
```
POST /api/auth/login
```

**请求参数:**
```javascript
{
  "code": "微信登录code",
  "encryptedData": "加密数据",
  "iv": "初始向量"
}
```

**响应数据:**
```javascript
{
  "token": "jwt_token",
  "userInfo": {
    "id": "用户ID",
    "nickname": "昵称",
    "avatar": "头像URL",
    "isNewUser": true
  }
}
```

### 1.2 获取用户信息
```
GET /api/user/profile
```

**请求头:**
```
Authorization: Bearer <token>
```

**响应数据:**
```javascript
{
  "id": "用户ID",
  "nickname": "昵称",
  "avatar": "头像URL",
  "profile": {
    "age": 28,
    "personality": ["内向", "理性"],
    "emotionalState": "平静"
  },
  "stats": {
    "totalSessions": 5,
    "completedScripts": 3,
    "level": 2
  },
  "membership": {
    "type": "vip",
    "expireTime": "2024-12-31T23:59:59Z"
  }
}
```

### 1.3 更新用户画像
```
PUT /api/user/profile
```

**请求参数:**
```javascript
{
  "profile": {
    "age": 28,
    "personality": ["内向", "理性"],
    "interests": ["心理学", "成长"]
  },
  "preferences": {
    "favoriteThemes": ["职场", "感情"],
    "interactionStyle": "温和",
    "difficulty": "中等"
  }
}
```

## 2. 剧本相关接口

### 2.1 获取剧本列表
```
GET /api/scripts
```

**查询参数:**
```
category: 分类筛选
tags: 标签筛选 (多个用逗号分隔)
difficulty: 难度筛选
page: 页码 (默认1)
pageSize: 每页数量 (默认20)
sort: 排序方式 (hot/new/rating)
```

**响应数据:**
```javascript
{
  "list": [
    {
      "id": "剧本ID",
      "title": "剧本标题",
      "description": "剧本描述",
      "coverImage": "封面图URL",
      "category": "分类",
      "tags": ["标签1", "标签2"],
      "difficulty": "中等",
      "duration": 30,
      "stats": {
        "viewCount": 1000,
        "playCount": 500,
        "averageRating": 4.5
      },
      "isFavorited": false
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

### 2.2 获取剧本详情
```
GET /api/scripts/:id
```

**响应数据:**
```javascript
{
  "id": "剧本ID",
  "title": "剧本标题",
  "description": "剧本描述",
  "coverImage": "封面图URL",
  "category": "分类",
  "tags": ["标签1", "标签2"],
  "difficulty": "中等",
  "duration": 30,
  "scenario": {
    "setting": "场景设定",
    "background": "背景故事",
    "characters": [
      {
        "name": "角色名",
        "description": "角色描述",
        "avatar": "角色头像"
      }
    ],
    "objectives": ["目标1", "目标2"]
  },
  "stats": {
    "viewCount": 1000,
    "playCount": 500,
    "averageRating": 4.5,
    "completionRate": 0.8
  },
  "isFavorited": false,
  "canPlay": true
}
```

### 2.3 开始剧本对话
```
POST /api/scripts/:id/start
```

**响应数据:**
```javascript
{
  "sessionId": "会话ID",
  "conversationId": "对话ID", 
  "introduction": "开场介绍",
  "firstMessage": {
    "speaker": "心理剧导演",
    "content": "欢迎来到这个剧本...",
    "choices": [
      {
        "text": "我准备好了",
        "action": "start"
      }
    ]
  }
}
```

## 3. 对话相关接口

### 3.1 发送消息
```
POST /api/conversations/:id/messages
```

**请求参数:**
```javascript
{
  "content": "用户消息内容",
  "type": "text", // text/choice/tool
  "metadata": {
    "choiceId": "选择项ID",
    "emotion": "情绪标签"
  }
}
```

**响应数据:**
```javascript
{
  "messageId": "消息ID",
  "aiResponse": {
    "speaker": "心理剧导演",
    "content": "AI回复内容",
    "emotion": "温和",
    "choices": [
      {
        "id": "choice_1",
        "text": "选择1",
        "emotion": "积极"
      }
    ]
  },
  "insights": [
    {
      "type": "emotional",
      "content": "你在这种情况下表现出了..."
    }
  ],
  "progress": 0.3
}
```

### 3.2 获取对话历史
```
GET /api/conversations/:id/messages
```

**查询参数:**
```
page: 页码
pageSize: 每页数量
```

**响应数据:**
```javascript
{
  "messages": [
    {
      "id": "消息ID",
      "type": "user/ai/system",
      "sender": "发送者",
      "content": "消息内容",
      "emotion": "情绪标签",
      "timestamp": "时间戳"
    }
  ],
  "total": 50
}
```

### 3.3 使用工具 - 内心独白
```
POST /api/conversations/:id/tools/monologue
```

**请求参数:**
```javascript
{
  "trigger": "当前情境描述"
}
```

**响应数据:**
```javascript
{
  "content": "内心独白内容",
  "insights": ["洞察1", "洞察2"],
  "emotions": ["紧张", "期待"]
}
```

### 3.4 生成关系报告
```
POST /api/conversations/:id/tools/report
```

**请求参数:**
```javascript
{
  "reportType": "relationship/emotional/growth"
}
```

**响应数据:**
```javascript
{
  "reportId": "报告ID",
  "title": "报告标题",
  "summary": "报告摘要",
  "analysisUrl": "/reports/:reportId"
}
```

### 3.5 自定义剧情
```
POST /api/conversations/:id/tools/custom-plot
```

**请求参数:**
```javascript
{
  "scenario": "自定义场景描述",
  "characters": ["角色1", "角色2"],
  "objectives": ["目标描述"]
}
```

**响应数据:**
```javascript
{
  "plotId": "剧情ID",
  "content": "生成的剧情内容",
  "nextSteps": ["可能的后续发展"]
}
```

### 3.6 高能量女主模式
```
POST /api/conversations/:id/energy-boost
```

**请求参数:**
```javascript
{
  "duration": 10 // 持续对话轮数
}
```

**响应数据:**
```javascript
{
  "activated": true,
  "remainingTurns": 10,
  "energyLevel": "high",
  "tips": "现在是高能量状态，尽情表达你的想法！"
}
```

## 4. 活动相关接口

### 4.1 获取活动列表
```
GET /api/activities
```

**查询参数:**
```
type: 活动类型
city: 城市
status: 状态
startDate: 开始时间筛选
page: 页码
pageSize: 每页数量
```

**响应数据:**
```javascript
{
  "list": [
    {
      "id": "活动ID",
      "title": "活动标题",
      "description": "活动描述",
      "coverImage": "封面图",
      "type": "workshop",
      "location": {
        "city": "北京",
        "venue": "会议室"
      },
      "schedule": {
        "startTime": "2024-01-15T14:00:00Z",
        "duration": 120
      },
      "capacity": {
        "maxParticipants": 20,
        "currentParticipants": 15
      },
      "pricing": {
        "memberPrice": 99,
        "regularPrice": 199
      },
      "isRegistered": false
    }
  ],
  "total": 30
}
```

### 4.2 获取活动详情
```
GET /api/activities/:id
```

**响应数据:**
```javascript
{
  "id": "活动ID",
  "title": "活动标题",
  "description": "活动详细描述",
  "coverImage": "封面图",
  "type": "workshop",
  "location": {
    "city": "北京",
    "address": "详细地址",
    "venue": "会议室名称"
  },
  "schedule": {
    "startTime": "2024-01-15T14:00:00Z",
    "endTime": "2024-01-15T16:00:00Z",
    "duration": 120
  },
  "facilitator": {
    "name": "主持人姓名",
    "title": "心理咨询师",
    "bio": "个人简介"
  },
  "content": {
    "agenda": ["环节1", "环节2"],
    "objectives": ["目标1", "目标2"],
    "takeaways": ["收获1", "收获2"]
  },
  "requirements": {
    "ageRange": "25-35",
    "experience": "无要求"
  },
  "pricing": {
    "memberPrice": 99,
    "regularPrice": 199,
    "earlyBirdPrice": 79
  },
  "registration": {
    "endTime": "2024-01-10T23:59:59Z",
    "requiresApproval": false
  },
  "capacity": {
    "maxParticipants": 20,
    "currentParticipants": 15,
    "available": 5
  },
  "isRegistered": false,
  "canRegister": true
}
```

### 4.3 报名活动
```
POST /api/activities/:id/register
```

**请求参数:**
```javascript
{
  "contactInfo": {
    "phone": "手机号",
    "email": "邮箱"
  },
  "answers": [
    {
      "questionId": "问题ID",
      "answer": "回答内容"
    }
  ],
  "specialRequests": "特殊需求"
}
```

**响应数据:**
```javascript
{
  "registrationId": "报名ID",
  "status": "pending/confirmed",
  "message": "报名成功，等待确认"
}
```

## 5. 个人中心相关接口

### 5.1 获取收藏列表
```
GET /api/favorites
```

**查询参数:**
```
type: 收藏类型 (script/activity)
page: 页码
pageSize: 每页数量
```

**响应数据:**
```javascript
{
  "list": [
    {
      "id": "收藏ID",
      "targetId": "目标ID",
      "targetType": "script",
      "targetInfo": {
        "title": "标题",
        "coverImage": "封面图"
      },
      "tags": ["个人标签"],
      "notes": "个人笔记",
      "createdAt": "收藏时间"
    }
  ],
  "total": 25
}
```

### 5.2 添加收藏
```
POST /api/favorites
```

**请求参数:**
```javascript
{
  "targetId": "目标ID",
  "targetType": "script/activity",
  "tags": ["标签1", "标签2"],
  "notes": "个人笔记"
}
```

### 5.3 获取对话历史
```
GET /api/conversations
```

**查询参数:**
```
status: 状态筛选
page: 页码
pageSize: 每页数量
```

**响应数据:**
```javascript
{
  "list": [
    {
      "id": "对话ID",
      "title": "对话标题",
      "scriptInfo": {
        "title": "剧本标题",
        "coverImage": "封面图"
      },
      "status": "completed",
      "progress": 1.0,
      "duration": 1800,
      "createdAt": "开始时间",
      "completedAt": "完成时间"
    }
  ],
  "total": 10
}
```

### 5.4 获取关系报告列表
```
GET /api/reports
```

**查询参数:**
```
type: 报告类型
page: 页码
pageSize: 每页数量
```

**响应数据:**
```javascript
{
  "list": [
    {
      "id": "报告ID",
      "title": "报告标题",
      "type": "relationship",
      "summary": "报告摘要",
      "createdAt": "生成时间",
      "expiresAt": "过期时间"
    }
  ],
  "total": 5
}
```

### 5.5 查看关系报告详情
```
GET /api/reports/:id
```

**响应数据:**
```javascript
{
  "id": "报告ID",
  "title": "报告标题",
  "type": "relationship",
  "summary": "报告摘要",
  "analysis": {
    "patterns": [
      {
        "type": "communication",
        "description": "沟通模式分析",
        "score": 8.5
      }
    ],
    "strengths": ["优势1", "优势2"],
    "challenges": ["挑战1", "挑战2"],
    "insights": ["洞察1", "洞察2"],
    "recommendations": ["建议1", "建议2"]
  },
  "visualization": {
    "charts": [
      {
        "type": "radar",
        "title": "能力雷达图",
        "data": {
          "labels": ["沟通", "共情", "自我认知"],
          "values": [8, 7, 9]
        }
      }
    ]
  },
  "createdAt": "生成时间",
  "expiresAt": "过期时间"
}
```

## 6. AI相关接口

### 6.1 AI情感导师对话
```
POST /api/ai/mentor/chat
```

**请求参数:**
```javascript
{
  "message": "用户问题",
  "context": {
    "emotionalState": "当前情绪状态",
    "recentEvents": ["最近事件"]
  }
}
```

**响应数据:**
```javascript
{
  "response": "AI导师回复",
  "suggestions": ["建议1", "建议2"],
  "resources": [
    {
      "type": "script",
      "title": "推荐剧本",
      "id": "剧本ID"
    }
  ],
  "followUpQuestions": ["后续问题1", "后续问题2"]
}
```

## 7. 系统相关接口

### 7.1 获取配置信息
```
GET /api/system/config
```

**响应数据:**
```javascript
{
  "version": "1.0.0",
  "features": {
    "aiMentor": true,
    "energyBoost": true,
    "customPlot": false
  },
  "limits": {
    "freeUserDailyChats": 3,
    "vipUserDailyChats": 50
  },
  "maintenance": {
    "enabled": false,
    "message": "系统维护中"
  }
}
```

### 7.2 上传文件
```
POST /api/upload
```

**请求参数:**
```
multipart/form-data
file: 文件
type: 文件类型 (avatar/cover/report)
```

**响应数据:**
```javascript
{
  "url": "文件访问URL",
  "filename": "文件名",
  "size": 1024000
}
```

## 8. 中间件和认证

### 8.1 JWT Token 验证
所有需要登录的接口都需要在请求头中携带Token：
```
Authorization: Bearer <jwt_token>
```

### 8.2 请求限流
- 普通用户：每分钟60次请求
- VIP用户：每分钟200次请求
- AI对话接口特殊限制

### 8.3 数据验证
- 参数类型验证
- 必填字段验证  
- 数据长度限制
- 特殊字符过滤

### 8.4 错误处理
统一错误响应格式，包含详细错误信息和处理建议。 