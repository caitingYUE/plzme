#!/usr/bin/env node

/**
 * DeepSeek API 测试脚本
 * 用于测试本地代理服务是否正常工作
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// 测试数据
const testData = {
  message: '我最近在感情中感到很困惑，总是不知道对方的真实想法',
  scriptId: 'script_002',
  phase: 'opening',
  userRole: '在亲密关系中感到困扰的人，想要学会设定健康边界',
  aiRole: '经验丰富的关系咨询师，专长于帮助人们建立健康的关系模式',
  history: []
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 测试健康检查
async function testHealth() {
  try {
    log('blue', '🔍 测试健康检查...');
    const response = await axios.get(`${BASE_URL}/health`);
    log('green', '✅ 健康检查成功');
    console.log('响应:', response.data);
    console.log('');
    return true;
  } catch (error) {
    log('red', '❌ 健康检查失败');
    console.error('错误:', error.message);
    console.log('');
    return false;
  }
}

// 测试聊天API
async function testChat() {
  try {
    log('blue', '💬 测试聊天API...');
    log('yellow', `用户消息: ${testData.message}`);
    
    const response = await axios.post(`${BASE_URL}/api/chat`, testData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });
    
    if (response.data.success) {
      log('green', '✅ 聊天API测试成功');
      log('cyan', 'AI回复:');
      console.log(response.data.data.message);
      
      if (response.data.data.usage) {
        log('magenta', `Token使用: ${JSON.stringify(response.data.data.usage)}`);
      }
    } else {
      log('red', '❌ API返回失败状态');
      console.log('响应:', response.data);
    }
    console.log('');
    return true;
  } catch (error) {
    log('red', '❌ 聊天API测试失败');
    if (error.response) {
      console.error('HTTP状态:', error.response.status);
      console.error('错误信息:', error.response.data);
    } else {
      console.error('错误:', error.message);
    }
    console.log('');
    return false;
  }
}

// 测试剧本引导API
async function testScriptGuide() {
  try {
    log('blue', '📋 测试剧本引导API...');
    
    const response = await axios.post(`${BASE_URL}/api/script-guide`, {
      scriptId: testData.scriptId,
      phase: testData.phase,
      userMessage: testData.message
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      log('green', '✅ 剧本引导API测试成功');
      console.log('引导内容:', response.data.data);
    } else {
      log('red', '❌ API返回失败状态');
      console.log('响应:', response.data);
    }
    console.log('');
    return true;
  } catch (error) {
    log('red', '❌ 剧本引导API测试失败');
    console.error('错误:', error.message);
    console.log('');
    return false;
  }
}

// 测试统计API
async function testStats() {
  try {
    log('blue', '📊 测试统计API...');
    
    const response = await axios.get(`${BASE_URL}/api/stats`);
    
    if (response.data.success) {
      log('green', '✅ 统计API测试成功');
      console.log('统计数据:', response.data.data);
    } else {
      log('red', '❌ API返回失败状态');
      console.log('响应:', response.data);
    }
    console.log('');
    return true;
  } catch (error) {
    log('red', '❌ 统计API测试失败');
    console.error('错误:', error.message);
    console.log('');
    return false;
  }
}

// 主测试函数
async function runTests() {
  log('bright', '🚀 开始 DeepSeek API 测试\n');
  
  const results = {
    health: false,
    chat: false,
    guide: false,
    stats: false
  };
  
  // 按顺序执行测试
  results.health = await testHealth();
  
  if (results.health) {
    results.chat = await testChat();
    results.guide = await testScriptGuide();
    results.stats = await testStats();
  } else {
    log('yellow', '⚠️  健康检查失败，跳过其他测试');
  }
  
  // 输出测试结果
  log('bright', '📋 测试结果总结:');
  console.log('');
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ 通过' : '❌ 失败';
    const color = passed ? 'green' : 'red';
    log(color, `${test.padEnd(10)} ${status}`);
  });
  
  console.log('');
  
  const allPassed = Object.values(results).every(r => r);
  if (allPassed) {
    log('green', '🎉 所有测试通过！DeepSeek服务运行正常');
  } else {
    log('red', '⚠️  部分测试失败，请检查服务配置');
  }
  
  // 提供下一步建议
  console.log('');
  log('blue', '💡 使用建议:');
  console.log('1. 确保在 .env 文件中配置了正确的 DEEPSEEK_API_KEY');
  console.log('2. 如果聊天API失败，请检查API密钥是否有效');
  console.log('3. 可以通过 npm run dev:server 启动开发模式（自动重启）');
  console.log('4. 生产环境建议使用 PM2 或类似工具管理进程');
}

// 运行测试
if (require.main === module) {
  runTests().catch(error => {
    console.error('测试执行失败:', error);
    process.exit(1);
  });
}

module.exports = {
  testHealth,
  testChat,
  testScriptGuide,
  testStats,
  runTests
}; 