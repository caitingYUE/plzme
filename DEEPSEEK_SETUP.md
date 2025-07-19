# DeepSeek API 配置指南

## 📋 概述

PlzMe项目已经集成了DeepSeek API用于AI心理剧功能。本指南将帮助你完成DeepSeek服务的配置和测试。

## 🚀 快速开始

### 1. 获取DeepSeek API密钥

1. 访问 [DeepSeek 平台](https://platform.deepseek.com/)
2. 注册账号（如果没有的话）
3. 登录后进入API管理页面
4. 创建新的API密钥
5. 复制密钥备用

### 2. 配置环境变量

在项目根目录创建 `.env` 文件：

```bash
# DeepSeek API 配置
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 服务器配置
PORT=3000
NODE_ENV=development

# 可选：其他配置
API_TIMEOUT=30000
MAX_TOKENS=800
```

**注意**: 请将 `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` 替换为你的真实API密钥。

### 3. 安装依赖

```bash
npm install express cors axios dotenv
```

### 4. 启动服务

```bash
# 启动服务器
npm run server

# 或者启动开发模式（自动重启）
npm run dev:server
```

### 5. 测试服务

```bash
# 运行测试脚本
node test-deepseek.js
```

## 📡 API 端点

服务器启动后，以下端点将可用：

- **健康检查**: `GET http://localhost:3000/health`
- **聊天API**: `POST http://localhost:3000/api/chat`
- **剧本引导**: `POST http://localhost:3000/api/script-guide`
- **使用统计**: `GET http://localhost:3000/api/stats`

## 💬 使用示例

### 基本聊天请求

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "我最近在感情中感到很困惑",
    "scriptId": "script_002",
    "phase": "opening",
    "userRole": "在亲密关系中感到困扰的人",
    "aiRole": "经验丰富的关系咨询师"
  }'
```

### 小程序中使用

```javascript
// 引入客户端
const DeepSeekClient = require('../utils/deepseek-client.js');
const client = new DeepSeekClient();

// 发送消息
try {
  const response = await client.sendMessage({
    message: '我最近在感情中感到很困惑',
    scriptId: 'script_002',
    phase: 'opening',
    userRole: '在亲密关系中感到困扰的人',
    aiRole: '经验丰富的关系咨询师',
    history: []
  });
  
  console.log('AI回复:', response.data.message);
} catch (error) {
  console.error('请求失败:', error.message);
}
```

## 🔧 配置选项

### 环境变量说明

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `DEEPSEEK_API_KEY` | - | DeepSeek API密钥（必需） |
| `PORT` | 3000 | 服务器端口 |
| `NODE_ENV` | development | 运行环境 |
| `API_TIMEOUT` | 30000 | API请求超时时间（毫秒） |
| `MAX_TOKENS` | 800 | 最大token数量 |

### 心理剧对话阶段

1. **opening** - 开场阶段，建立连接
2. **exploration** - 探索阶段，深入分析
3. **insight** - 洞察阶段，发现模式
4. **healing** - 疗愈阶段，整合成长

## 🛠️ 故障排除

### 常见问题

#### 1. "Cannot find module 'gpt-proxy.js'"
- **原因**: 服务器文件不存在
- **解决**: 确保 `gpt-proxy.js` 文件在项目根目录

#### 2. "API密钥无效"
- **原因**: DeepSeek API密钥配置错误
- **解决**: 检查 `.env` 文件中的 `DEEPSEEK_API_KEY` 是否正确

#### 3. "请求超时"
- **原因**: 网络连接问题或API响应慢
- **解决**: 检查网络连接，或增加超时时间

#### 4. "HTTP 429: 请求过于频繁"
- **原因**: 超出API调用频率限制
- **解决**: 降低请求频率，或升级API套餐

### 检查清单

- [ ] `.env` 文件已创建且包含有效的API密钥
- [ ] 必要的npm包已安装
- [ ] 服务器在端口3000上运行
- [ ] 防火墙允许端口3000的访问
- [ ] 网络连接正常

## 📊 监控和日志

### 查看服务状态
```bash
curl http://localhost:3000/health
```

### 查看使用统计
```bash
curl http://localhost:3000/api/stats
```

### 服务器日志
服务器会输出详细的请求和错误日志，用于调试和监控。

## 🚀 部署建议

### 开发环境
```bash
npm run dev:server  # 使用nodemon自动重启
```

### 生产环境
```bash
# 使用PM2管理进程
npm install -g pm2
pm2 start gpt-proxy.js --name "plzme-deepseek"
pm2 startup
pm2 save
```

## 📚 相关文档

- [DeepSeek API 官方文档](https://platform.deepseek.com/api-docs/)
- [Express.js 文档](https://expressjs.com/)
- [微信小程序网络API](https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html)

## 💡 最佳实践

1. **安全**: 永远不要在前端代码中直接使用API密钥
2. **错误处理**: 为所有API调用添加适当的错误处理
3. **日志**: 记录重要的请求和响应用于调试
4. **限流**: 在生产环境中实施请求限流
5. **监控**: 监控API使用情况和性能指标

## ❓ 获取帮助

如果遇到问题，请：

1. 检查错误日志
2. 运行测试脚本诊断问题
3. 查看相关文档
4. 检查网络和API密钥配置

---

**注意**: 请确保妥善保护你的API密钥，不要将其提交到版本控制系统中。 