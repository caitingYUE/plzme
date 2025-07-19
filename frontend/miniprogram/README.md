# PlzMe - AI Interactive Psychological Drama WeChat Mini-Program

## 项目概览

PlzMe 是一款创新的微信小程序，专为 27-35 岁女性设计，通过 AI 驱动的心理剧互动实现情感疗愈和自我成长。产品口号"我是我的人生主角"体现了其核心使命：让用户掌控自己的情感成长之旅。

### 核心功能特色

- **AI 心理剧导演**: 引导用户进行沉浸式角色扮演体验
- **深夜疗愈 UI 主题**: 专为夜间情感疗愈设计的深色界面
- **三大核心页面**:
  - **首页**: 疗愈卡片 + 线下活动推荐
  - **剧本**: 小红书风格瀑布流布局（2:3 竖版图片）
  - **我的**: 用户信息、收藏、成长报告
- **AI 工具箱**: 内心独白、关系报告、自定义剧情生成
- **高能女主模式**: 长按头像激活，提供 10 轮高自信 AI 回应

## 技术架构

### 前端技术栈
- **微信小程序**: 原生开发框架
- **UI 组件**: Vant Weapp 组件库
- **样式系统**: 深夜疗愈主题 + CSS 自定义属性
- **状态管理**: 微信原生状态管理

### 后端技术栈
- **运行环境**: Node.js + Express.js
- **数据库**: MongoDB 主数据库 + Redis 缓存
- **AI 集成**: 多模型备份方案
  - **主要**: DeepSeek API（根据用户要求）
  - **备用**: 百度千帆、腾讯混元、阿里通义

### 核心页面实现

#### 1. 首页 (pages/index/index)
```javascript
// 首页核心功能
- slogan 展示："我是我的人生主角"
- AI 情感导师入口
- 今日疗愈卡（情绪探索卡 + 关系洞察卡）
- 精选线下活动列表
- 开始心理剧探索按钮
```

#### 2. 剧本列表 (pages/scripts/scripts)
```javascript
// 瀑布流布局实现
- 搜索栏 + 筛选功能
- 双列瀑布流展示（小红书风格）
- 剧本卡片：封面图 + 标题 + 简介 + 标签
- 高能女主模式标识（⚡图标）
- 无限滚动加载
```

#### 3. 我的页面 (pages/profile/profile)
```javascript
// 用户中心功能
- 用户头像（长按激活高能女主模式）
- 成长数据展示（剧本体验、成长天数、心得洞察）
- 功能菜单（收藏、历史、报告、工具箱）
- 最近成长足迹时间线
- 高能模式激活弹窗
```

### 资源文件结构

```
assets/
├── index/                      # 首页资源
│   ├── emotion_card.png        # 情绪卡片示例
│   ├── relation_card.png       # 关系卡片示例
│   ├── group.png              # 小组活动配图
│   └── workshop.png           # 工作坊配图
├── scripts_list/              # 剧本资源
│   ├── script_001.jpeg        # 剧本封面图（12个）
│   ├── script_001.md          # 剧本内容文件
│   └── ...                    # 对应的图片和文档
└── user/                      # 用户相关资源
    ├── role1.jpg              # 女性默认头像
    ├── role2.jpg              # 男性默认头像
    ├── role3.jpg              # 女性备份头像
    ├── role4.jpg              # 男性备份头像
    └── avatar.png             # 通用头像
```

### 深夜疗愈风格设计

#### 色彩方案
```css
/* 主色调 */
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
```

#### 组件设计原则
- **圆角**: 8-24rpx 一致的圆角系统
- **阴影**: 带蓝色调的柔和阴影
- **动画**: 0.2-0.3s 的温和过渡效果
- **间距**: 16-48rpx 递增间距系统

## 快速开始

### 环境要求
```bash
Node.js >= 16.0.0
npm >= 8.0.0
微信开发者工具
```

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd plzme-miniprogram
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发环境**
```bash
npm run dev
# 或
npm start
```

4. **配置微信开发者工具**
- 打开微信开发者工具
- 导入项目（选择 `miniprogram` 目录）
- 配置 AppID 或使用测试号

### 开发指南

#### 页面开发流程
1. 在 `miniprogram/pages/` 下创建页面目录
2. 创建四个文件：`.wxml`, `.wxss`, `.js`, `.json`
3. 在 `app.json` 中注册页面路径
4. 实现页面逻辑和样式

#### 组件开发规范
```javascript
// 页面结构示例
Page({
  data: {
    // 页面数据
  },
  
  onLoad(options) {
    // 页面加载逻辑
  },
  
  // 事件处理方法
  handleEvent() {
    // 处理用户交互
  }
});
```

#### 样式开发规范
```css
/* 使用全局 CSS 变量 */
.custom-component {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

/* 响应式设计 */
@media (max-width: 375px) {
  .custom-component {
    padding: 24rpx;
  }
}
```

### AI 集成配置

#### DeepSeek API 配置
```javascript
// 在 app.js 中配置
globalData: {
  apiURL: 'https://api.deepseek.com',
  // 注意：实际 API 密钥应在服务端配置
}

// AI 对话示例
async function chatWithAI(message, context) {
  const response = await wx.request({
    url: `${app.globalData.apiURL}/chat`,
    method: 'POST',
    data: {
      message,
      context,
      mode: energyMode ? 'high-energy' : 'normal'
    }
  });
  return response.data;
}
```

#### 高能女主模式实现
```javascript
// 激活高能模式
activateEnergyMode() {
  app.globalData.energyBoostActive = true;
  wx.setStorageSync('energyModeCount', 10);
  
  // 更新 AI 响应风格
  this.updateAIPersonality({
    confidence: 95,
    assertiveness: 90,
    empowerment: 100
  });
}
```

## 项目文档

### 完整文档列表
- 📋 [需求文档](docs/requirements.md) - 详细产品需求说明
- 🗄️ [数据库设计](docs/database-design.md) - MongoDB 数据模型
- 🔌 [API 设计](docs/api-design.md) - RESTful API 规范
- 🤖 [AI 集成](docs/ai-integration.md) - AI 实现指南
- 🛠️ [开发指南](docs/development-guide.md) - 开发规范和最佳实践
- 📅 [实施计划](docs/implementation-plan.md) - 11周开发时间线

### 关键功能实现

#### 瀑布流布局算法
```javascript
// 瀑布流排列逻辑
arrangeWaterfall(scripts) {
  const columns = [[], []];
  const heights = [0, 0];
  
  scripts.forEach(script => {
    // 计算卡片高度
    const cardHeight = this.calculateCardHeight(script);
    
    // 选择较矮的列
    const shortestColumn = heights[0] <= heights[1] ? 0 : 1;
    
    columns[shortestColumn].push(script);
    heights[shortestColumn] += cardHeight;
  });
  
  return columns;
}
```

#### 高能模式视觉效果
```css
/* 高能模式动画 */
.energy-boost {
  animation: energyPulse 2s infinite;
  border: 2rpx solid var(--accent-color);
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

## 部署与运维

### 开发环境
- **本地开发**: 微信开发者工具 + 模拟数据
- **API 模拟**: 使用 mock 数据进行前端开发
- **实时预览**: 开发者工具的真机预览功能

### 生产环境准备
1. **配置 DeepSeek API 密钥**
2. **部署 Node.js 后端服务**
3. **设置 MongoDB 数据库**
4. **配置 CDN 和域名**
5. **提交微信小程序审核**

### 性能优化
- **图片优化**: WebP 格式 + 懒加载
- **代码分包**: 按页面拆分代码包
- **缓存策略**: 静态资源缓存 + API 缓存
- **首屏优化**: 关键资源预加载

## 贡献指南

### 开发流程
1. Fork 项目仓库
2. 创建功能分支 (`feature/功能名称`)
3. 遵循代码规范并添加测试
4. 提交 Pull Request
5. 代码审查和合并

### 代码规范
- **JavaScript**: ESLint + Prettier
- **样式**: CSS 模块化 + BEM 命名
- **提交信息**: 规范的 Git commit 格式
- **文档**: 充分的代码注释和 README 更新

## 技术支持

### 相关资源
- **微信小程序官方文档**: https://developers.weixin.qq.com/miniprogram/dev/
- **DeepSeek API 文档**: https://platform.deepseek.com/api-docs/
- **Vant Weapp 组件库**: https://vant-contrib.gitee.io/vant-weapp/

### 常见问题
1. **样式不生效**: 检查 CSS 变量定义和选择器优先级
2. **页面跳转失败**: 确认页面路径在 app.json 中已注册
3. **API 调用失败**: 检查域名白名单和请求格式
4. **图片无法显示**: 确认图片路径和格式正确

---

**联系方式**
- 开发团队: dev@plzme.com
- 技术支持: support@plzme.com
- 文档反馈: docs@plzme.com

**开源协议**: MIT License 