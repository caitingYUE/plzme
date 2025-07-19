# PlzMe 开发指南

## 开发环境配置

### 1. 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0
- 微信开发者工具 >= 1.06.0
- MongoDB >= 4.4
- Redis >= 6.0

### 2. 项目初始化

```bash
# 克隆项目
git clone https://github.com/plzme/plzme-miniprogram.git
cd plzme-miniprogram

# 安装依赖
npm install

# 安装微信小程序组件库
npm install @vant/weapp

# 复制配置文件
cp config/config.example.js config/config.js
```

### 3. 开发服务器启动

```bash
# 启动后端服务
cd server
npm install
npm run dev

# 启动前端开发
cd miniprogram
npm run dev
```

## 项目结构说明

```
plzme-miniprogram/
├── miniprogram/              # 小程序前端
│   ├── pages/               # 页面文件
│   │   ├── index/          # 首页
│   │   ├── scripts/        # 剧本列表页
│   │   ├── chat/           # 对话页面
│   │   └── profile/        # 个人中心
│   ├── components/         # 公共组件
│   │   ├── script-card/    # 剧本卡片
│   │   ├── chat-bubble/    # 对话气泡
│   │   ├── energy-boost/   # 高能量模式
│   │   └── tool-bar/       # 工具栏
│   ├── utils/              # 工具函数
│   │   ├── request.js      # 网络请求封装
│   │   ├── auth.js         # 用户认证
│   │   ├── storage.js      # 本地存储
│   │   └── emotion.js      # 情绪分析工具
│   ├── api/                # API接口
│   │   ├── user.js         # 用户相关
│   │   ├── script.js       # 剧本相关
│   │   ├── chat.js         # 对话相关
│   │   └── activity.js     # 活动相关
│   ├── assets/             # 静态资源
│   │   ├── images/         # 图片资源
│   │   ├── icons/          # 图标
│   │   └── styles/         # 样式文件
│   ├── app.js              # 小程序入口
│   ├── app.json            # 小程序配置
│   └── app.wxss            # 全局样式
├── server/                  # 后端服务
│   ├── controllers/        # 控制器
│   ├── services/           # 业务逻辑
│   ├── models/            # 数据模型
│   ├── middleware/        # 中间件
│   ├── routes/            # 路由配置
│   ├── config/            # 配置文件
│   └── utils/             # 工具函数
├── docs/                   # 文档
├── tests/                  # 测试文件
└── deploy/                 # 部署脚本
```

## 代码规范

### 1. JavaScript/ES6 规范

```javascript
// ✅ 推荐写法
const getUserProfile = async (userId) => {
  try {
    const response = await api.getUserProfile(userId);
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    throw error;
  }
};

// ❌ 避免写法
function getUserProfile(userId, callback) {
  api.getUserProfile(userId, function(err, data) {
    if (err) {
      callback(err);
    } else {
      callback(null, data);
    }
  });
}
```

### 2. 小程序页面结构规范

```javascript
// pages/example/example.js
Page({
  data: {
    // 页面数据
    loading: false,
    userInfo: null,
    list: []
  },
  
  // 生命周期函数
  onLoad(options) {
    this.initPage(options);
  },
  
  onShow() {
    this.refreshData();
  },
  
  // 自定义方法
  async initPage(options) {
    wx.showLoading({ title: '加载中...' });
    
    try {
      await this.loadUserInfo();
      await this.loadList();
    } catch (error) {
      this.handleError(error);
    } finally {
      wx.hideLoading();
    }
  },
  
  async loadUserInfo() {
    const userInfo = await api.getUserInfo();
    this.setData({ userInfo });
  },
  
  handleError(error) {
    wx.showToast({
      title: error.message || '操作失败',
      icon: 'none'
    });
  }
});
```

### 3. 组件开发规范

```javascript
// components/example/example.js
Component({
  properties: {
    // 对外属性
    title: {
      type: String,
      value: ''
    },
    data: {
      type: Object,
      value: null,
      observer: '_onDataChange'
    }
  },
  
  data: {
    // 内部数据
    loading: false
  },
  
  lifetimes: {
    attached() {
      this.initComponent();
    }
  },
  
  methods: {
    // 内部方法
    initComponent() {
      // 组件初始化
    },
    
    _onDataChange(newVal, oldVal) {
      // 属性变化监听
      if (newVal) {
        this.processData(newVal);
      }
    },
    
    // 对外方法
    refresh() {
      this.loadData();
    },
    
    // 事件处理
    onTap() {
      this.triggerEvent('tap', {
        data: this.data.data
      });
    }
  }
});
```

### 4. API调用规范

```javascript
// api/base.js
class BaseAPI {
  constructor() {
    this.baseURL = getApp().globalData.apiURL;
  }
  
  async request(options) {
    const {
      url,
      method = 'GET', 
      data = {},
      header = {}
    } = options;
    
    // 添加认证token
    const token = wx.getStorageSync('token');
    if (token) {
      header.Authorization = `Bearer ${token}`;
    }
    
    try {
      const response = await new Promise((resolve, reject) => {
        wx.request({
          url: this.baseURL + url,
          method,
          data,
          header: {
            'Content-Type': 'application/json',
            ...header
          },
          success: resolve,
          fail: reject
        });
      });
      
      return this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  handleResponse(response) {
    const { statusCode, data } = response;
    
    if (statusCode === 200) {
      if (data.code === 200) {
        return data.data;
      } else {
        throw new Error(data.message || '请求失败');
      }
    } else if (statusCode === 401) {
      // 处理登录过期
      this.handleAuthError();
      throw new Error('登录已过期');
    } else {
      throw new Error('网络错误');
    }
  }
}
```

## 状态管理

### 1. 全局状态管理

```javascript
// app.js
App({
  globalData: {
    // 用户信息
    userInfo: null,
    token: null,
    
    // 应用配置
    apiURL: 'https://api.plzme.com',
    version: '1.0.0',
    
    // 临时数据
    currentConversation: null,
    energyBoostActive: false
  },
  
  onLaunch() {
    this.initApp();
  },
  
  async initApp() {
    // 检查登录状态
    await this.checkAuth();
    
    // 初始化配置
    await this.loadConfig();
  },
  
  async checkAuth() {
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      try {
        const userInfo = await api.getUserInfo();
        this.globalData.userInfo = userInfo;
      } catch (error) {
        // token过期，清除本地存储
        wx.removeStorageSync('token');
        this.globalData.token = null;
      }
    }
  }
});
```

### 2. 页面间数据传递

```javascript
// 使用事件总线
// utils/eventBus.js
class EventBus {
  constructor() {
    this.events = {};
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        callback(data);
      });
    }
  }
  
  off(event, callback) {
    if (this.events[event]) {
      const index = this.events[event].indexOf(callback);
      if (index > -1) {
        this.events[event].splice(index, 1);
      }
    }
  }
}

export default new EventBus();

// 使用示例
import eventBus from '../../utils/eventBus';

// 发送事件
eventBus.emit('conversationEnd', { 
  conversationId: 'xxx',
  result: 'completed'
});

// 监听事件
eventBus.on('conversationEnd', (data) => {
  console.log('对话结束:', data);
  this.handleConversationEnd(data);
});
```

## UI/UX 设计规范

### 1. 深夜疗愈风格

```css
/* 主色调 */
:root {
  --primary-color: #2D3748;      /* 深蓝灰 */
  --secondary-color: #4A5568;    /* 中等灰蓝 */
  --accent-color: #6B73FF;       /* 温和紫蓝 */
  --warm-color: #FBD38D;         /* 温暖黄 */
  
  /* 背景色 */
  --bg-primary: #1A202C;         /* 深色背景 */
  --bg-secondary: #2D3748;       /* 卡片背景 */
  --bg-tertiary: #4A5568;        /* 浅色区域 */
  
  /* 文字颜色 */
  --text-primary: #F7FAFC;       /* 主要文字 */
  --text-secondary: #E2E8F0;     /* 次要文字 */
  --text-muted: #A0AEC0;         /* 辅助文字 */
  
  /* 功能色 */
  --success-color: #68D391;      /* 成功绿 */
  --warning-color: #F6AD55;      /* 警告橙 */
  --error-color: #FC8181;        /* 错误红 */
}

/* 全局样式 */
page {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

/* 卡片样式 */
.card {
  background: var(--bg-secondary);
  border-radius: 12rpx;
  padding: 32rpx;
  margin: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

/* 按钮样式 */
.btn-primary {
  background: linear-gradient(135deg, var(--accent-color), var(--warm-color));
  color: var(--text-primary);
  border: none;
  border-radius: 24rpx;
  padding: 24rpx 48rpx;
  font-size: 32rpx;
  font-weight: 500;
}

.btn-secondary {
  background: transparent;
  color: var(--accent-color);
  border: 2rpx solid var(--accent-color);
  border-radius: 24rpx;
  padding: 22rpx 46rpx;
}
```

### 2. 动画效果

```css
/* 页面切换动画 */
.page-enter {
  opacity: 0;
  transform: translateX(100%);
}

.page-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 0.3s ease-out;
}

/* 卡片悬浮效果 */
.card-hover {
  transition: all 0.2s ease;
}

.card-hover:active {
  transform: scale(0.98);
  opacity: 0.9;
}

/* 消息气泡动画 */
.message-bubble {
  animation: messageSlideIn 0.3s ease-out;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 高能量模式动画 */
.energy-boost {
  animation: energyPulse 2s infinite;
}

@keyframes energyPulse {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(107, 115, 255, 0.4);
  }
  50% { 
    box-shadow: 0 0 0 20rpx rgba(107, 115, 255, 0);
  }
}
```

## 测试规范

### 1. 单元测试

```javascript
// tests/utils/emotion.test.js
const { analyzeEmotion } = require('../../miniprogram/utils/emotion');

describe('情绪分析工具', () => {
  test('应该正确识别积极情绪', () => {
    const text = '今天心情特别好，感觉一切都很顺利！';
    const result = analyzeEmotion(text);
    
    expect(result.emotion).toBe('喜悦');
    expect(result.intensity).toBeGreaterThan(0.7);
  });
  
  test('应该正确识别消极情绪', () => {
    const text = '感觉很沮丧，什么都不想做...';
    const result = analyzeEmotion(text);
    
    expect(result.emotion).toBe('悲伤');
    expect(result.intensity).toBeGreaterThan(0.5);
  });
});
```

### 2. 接口测试

```javascript
// tests/api/user.test.js
const request = require('supertest');
const app = require('../../server/app');

describe('用户API', () => {
  test('POST /api/auth/login - 用户登录', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        code: 'test_code',
        encryptedData: 'test_encrypted_data',
        iv: 'test_iv'
      });
      
    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
  });
  
  test('GET /api/user/profile - 获取用户信息', async () => {
    const token = 'valid_test_token';
    
    const response = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${token}`);
      
    expect(response.status).toBe(200);
    expect(response.body.data.id).toBeDefined();
  });
});
```

## 部署流程

### 1. 开发环境部署

```bash
# 构建项目
npm run build:dev

# 上传到开发环境
npm run upload:dev

# 生成预览二维码
npm run preview
```

### 2. 生产环境部署

```bash
# 构建生产版本
npm run build:prod

# 代码审查
npm run lint

# 运行测试
npm test

# 上传到生产环境
npm run upload:prod
```

### 3. 发布检查清单

- [ ] 代码通过所有测试
- [ ] 通过代码审查
- [ ] 更新版本号
- [ ] 更新更新日志
- [ ] 检查隐私政策合规
- [ ] 验证AI内容安全
- [ ] 备份数据库
- [ ] 发布到小程序平台

## 调试技巧

### 1. 微信开发者工具调试

```javascript
// 使用console.group组织日志
console.group('AI对话调试');
console.log('用户输入:', userInput);
console.log('AI回复:', aiResponse);
console.log('情绪分析:', emotionAnalysis);
console.groupEnd();

// 使用wx.showToast调试
wx.showToast({
  title: `调试: ${JSON.stringify(data)}`,
  icon: 'none',
  duration: 3000
});
```

### 2. 网络请求调试

```javascript
// 在网络面板查看请求详情
// 添加请求ID用于追踪
const requestId = Date.now();
console.log(`[${requestId}] 发送请求:`, options);

wx.request({
  // ... 其他配置
  success: (res) => {
    console.log(`[${requestId}] 请求成功:`, res);
  },
  fail: (err) => {
    console.error(`[${requestId}] 请求失败:`, err);
  }
});
```

### 3. 性能监控

```javascript
// 性能监控工具
class PerformanceMonitor {
  static startTiming(name) {
    console.time(name);
    return name;
  }
  
  static endTiming(name) {
    console.timeEnd(name);
  }
  
  static memory() {
    const memoryInfo = wx.getSystemInfo();
    console.log('内存使用情况:', memoryInfo);
  }
}

// 使用示例
const timer = PerformanceMonitor.startTiming('AI响应时间');
// ... AI调用
PerformanceMonitor.endTiming(timer);
```

## 常见问题解决

### 1. 微信小程序常见问题

**问题**: 页面白屏或加载失败
**解决方案**:
```javascript
// 在页面onLoad中添加错误处理
onLoad() {
  try {
    this.initPage();
  } catch (error) {
    console.error('页面初始化失败:', error);
    wx.showModal({
      title: '提示',
      content: '页面加载失败，请重试',
      success: (res) => {
        if (res.confirm) {
          wx.reLaunch({ url: '/pages/index/index' });
        }
      }
    });
  }
}
```

**问题**: 网络请求超时
**解决方案**:
```javascript
// 添加请求重试机制
async requestWithRetry(options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await this.request(options);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // 指数退避重试
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, i) * 1000)
      );
    }
  }
}
```

### 2. AI集成常见问题

**问题**: AI响应延迟过高
**解决方案**:
- 启用响应缓存
- 使用流式返回
- 实现请求队列管理

**问题**: AI内容不合规
**解决方案**:
- 加强内容审核
- 添加敏感词过滤
- 实现人工审核机制

这个开发指南涵盖了PlzMe项目开发的各个方面，为团队提供了统一的开发标准和最佳实践。 