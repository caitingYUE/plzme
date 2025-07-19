const axios = require('axios');

// 测试配置
const BASE_URL = 'http://192.168.199.161:3000';

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

async function testIntegration() {
  console.log(colors.cyan + '🧪 小程序集成测试开始...\n' + colors.reset);

  // 测试1: 健康检查
  try {
    console.log(colors.blue + '1. 健康检查...' + colors.reset);
    const health = await axios.get(`${BASE_URL}/health`);
    console.log(colors.green + '✅ 健康检查通过' + colors.reset);
    console.log('   响应:', health.data);
  } catch (error) {
    console.log(colors.red + '❌ 健康检查失败:' + colors.reset, error.message);
    return;
  }

  // 模拟小程序消息格式
  const testMessage = {
    message: '你好，我感到有些困惑',
    scriptId: 'test',
    phase: 'opening',
    userRole: '正在探索内心的用户',
    aiRole: '温暖的心理导师',
    history: []
  };

  // 测试2: 发送消息
  try {
    console.log(colors.blue + '\n2. 发送聊天消息...' + colors.reset);
    console.log('   发送内容:', testMessage.message);
    
    const response = await axios.post(`${BASE_URL}/api/chat`, testMessage, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });

    if (response.data.success) {
      console.log(colors.green + '✅ 消息发送成功' + colors.reset);
      console.log('   AI回复:', colors.yellow + response.data.data.message + colors.reset);
      console.log('   使用统计:', response.data.data.usage);
    } else {
      console.log(colors.red + '❌ 消息发送失败:' + colors.reset, response.data.error);
    }
  } catch (error) {
    console.log(colors.red + '❌ 消息发送失败:' + colors.reset, error.message);
    if (error.response) {
      console.log('   响应状态:', error.response.status);
      console.log('   响应数据:', error.response.data);
    }
  }

  // 测试3: 带历史记录的对话
  try {
    console.log(colors.blue + '\n3. 带历史记录的对话...' + colors.reset);
    
    const messageWithHistory = {
      message: '我想更深入地了解自己',
      scriptId: 'test',
      phase: 'exploration',
      userRole: '正在探索内心的用户',
      aiRole: '温暖的心理导师',
      history: [
        { role: 'user', content: '你好，我感到有些困惑' },
        { role: 'assistant', content: '你好，我理解你的感受。能告诉我更多关于让你困惑的事情吗？' }
      ]
    };

    const response = await axios.post(`${BASE_URL}/api/chat`, messageWithHistory, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });

    if (response.data.success) {
      console.log(colors.green + '✅ 历史对话成功' + colors.reset);
      console.log('   AI回复:', colors.yellow + response.data.data.message + colors.reset);
    } else {
      console.log(colors.red + '❌ 历史对话失败:' + colors.reset, response.data.error);
    }
  } catch (error) {
    console.log(colors.red + '❌ 历史对话失败:' + colors.reset, error.message);
  }

  // 测试4: 获取统计信息
  try {
    console.log(colors.blue + '\n4. 获取统计信息...' + colors.reset);
    const stats = await axios.get(`${BASE_URL}/api/stats`);
    console.log(colors.green + '✅ 统计信息获取成功' + colors.reset);
    console.log('   统计数据:', stats.data);
  } catch (error) {
    console.log(colors.red + '❌ 统计信息获取失败:' + colors.reset, error.message);
  }

  console.log(colors.cyan + '\n🏁 小程序集成测试完成!\n' + colors.reset);
}

// 运行测试
testIntegration().catch(console.error); 