const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0'; // 监听所有网卡，适配局域网

// 中间件
app.use(cors());
app.use(express.json());

// DeepSeek API 配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-4d4b48e14ff34b28a50d37c2b7bcee3f'; // 添加备用API密钥

// 心理剧场景模板 - 基于script_example.md优化
const PSYCHOLOGY_PROMPTS = {
  opening: `你是一个心理剧专家及导演，擅长剧本设计并通过专业的方法引导用户通过心理剧看见自我、让自我成长。

你正在进行一段可互动、半开放式的心理剧剧本，让用户在半开放的对话过程中探索自我。

剧本要求：
1. 场景真实有温度、非常符合真实世界而不是小说式的情节
2. 以线上文字聊天的方式进行，语言口语化、较简短，避免长篇大论
3. 对话风格符合角色特点、场景特点，符合常识
4. 温和专业的导演身份，营造安全的探索氛围

现在开始互动：`,

  scene_setting: `你正在引导用户进入心理剧的具体场景设定阶段。

请帮助用户：
1. 投入到真实的情境中
2. 感受场景中的情感氛围
3. 开始表达内心的真实感受
4. 建立安全的对话空间

请以温和、共情的方式继续引导：`,

  exploration: `现在进入深度探索阶段，引导用户探索更深层的情感和认知模式。

请帮助用户：
1. 识别内在的情感模式和行为模式
2. 理解行为背后的深层需求和恐惧
3. 发现自己的内在资源和力量
4. 探索过去经验对现在的影响

请继续以专业而温暖的方式深入引导：`,

  insight: `现在进入洞察阶段，帮助用户整合体验并获得新的理解。

请帮助用户：
1. 整合前面的探索内容，形成新的认知
2. 发现新的视角和理解方式
3. 连接过去、现在和未来的经验
4. 找到内在的智慧和力量源泉

请以启发性和支持性的方式继续对话：`,

  healing: `现在进入疗愈整合阶段，帮助用户接纳体验并找到前进的方向。

请帮助用户：
1. 接纳和整合这段体验带来的成长
2. 寻找未来前进的具体方向
3. 建立积极的自我认知和行动方案
4. 强化内在的成长力量

请以支持性和赋能的方式引导这个阶段：`,

  empowerment: `现在进入最终的赋能阶段，帮助用户带着新的力量和智慧结束这次心理剧。

请帮助用户：
1. 确认自己在这个过程中的成长和收获
2. 强化新获得的内在资源和能力
3. 为未来的生活建立信心和方向
4. 以积极正面的状态结束这次体验

请以祝福和肯定的方式完成这次心理剧：`
};

// 错误处理中间件
const errorHandler = (error, message = '服务暂时不可用') => {
  console.error('API Error:', error);
  return {
    error: true,
    message,
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  };
};

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'PlzMe DeepSeek Proxy',
    version: '1.0.0'
  });
});

// DeepSeek API 代理端点
app.post('/api/chat', async (req, res) => {
  console.log('API请求:', req.body);
  try {
    const { 
      message, 
      messages,
      scriptId, 
      phase = 'opening',
      userRole,
      aiRole,
      history = [],
      model = 'deepseek-chat',
      temperature = 0.7,
      max_tokens = 1000
    } = req.body;

    let finalMessages = [];

    // 支持两种格式: 旧格式(message + history) 和 新格式(messages数组)
    if (messages && Array.isArray(messages) && messages.length > 0) {
      // 新格式: 直接使用messages数组
      finalMessages = messages;
    } else if (message) {
      // 旧格式: 从message和history构建
      const systemPrompt = PSYCHOLOGY_PROMPTS[phase] || PSYCHOLOGY_PROMPTS.opening;
      const roleContext = aiRole ? `你现在扮演：${aiRole}` : '';
      const userContext = userRole ? `用户扮演：${userRole}` : '';
      
      finalMessages = [
        {
          role: 'system',
          content: `${systemPrompt}\n\n${roleContext}\n${userContext}`
        },
        // 添加历史对话
        ...history.map(item => ({
          role: item.role,
          content: item.content
        })),
        {
          role: 'user',
          content: message
        }
      ];
    } else {
      return res.status(400).json({
        error: true,
        message: '消息内容不能为空'
      });
    }

    // 验证API密钥
    if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'your-deepseek-api-key') {
      throw new Error('DeepSeek API密钥未配置或无效');
    }

    console.log('调用DeepSeek API，消息数量:', finalMessages.length);
    console.log('API密钥前缀:', DEEPSEEK_API_KEY.substring(0, 10) + '...');

    // 调用 DeepSeek API
    const response = await axios.post(DEEPSEEK_API_URL, {
      model,
      messages: finalMessages,
      max_tokens,
      temperature,
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1,
      stream: false
    }, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'PlzMe-App/1.0'
      },
      timeout: 45000
    });

    const aiResponse = response.data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('DeepSeek API 返回了空响应');
    }

    // 返回结果
    res.json({
      success: true,
      data: {
        message: aiResponse,
        timestamp: new Date().toISOString(),
        scriptId,
        phase,
        usage: response.data.usage
      }
    });

  } catch (error) {
    console.error('DeepSeek API Error:', error);
    
    if (error.response) {
      // API 返回了错误状态码
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.error?.message || 'API 调用失败';
      
      res.status(statusCode).json(errorHandler(error, errorMessage));
    } else if (error.request) {
      // 请求发送失败
      res.status(503).json(errorHandler(error, '无法连接到 DeepSeek 服务'));
    } else {
      // 其他错误
      res.status(500).json(errorHandler(error, '服务器内部错误'));
    }
  }
});

// 获取剧本对话引导
app.post('/api/script-guide', async (req, res) => {
  try {
    const { scriptId, phase, userMessage } = req.body;
    
    // 这里可以根据剧本ID和阶段返回特定的引导内容
    // 暂时返回通用引导
    const guide = {
      prompt: PSYCHOLOGY_PROMPTS[phase] || PSYCHOLOGY_PROMPTS.opening,
      suggestions: [
        '请分享你现在的感受',
        '你觉得这个情况让你想到了什么？',
        '如果可以重新选择，你会怎么做？'
      ],
      phase: phase
    };
    
    res.json({
      success: true,
      data: guide
    });
    
  } catch (error) {
    res.status(500).json(errorHandler(error, '获取剧本引导失败'));
  }
});

// 获取API使用统计
app.get('/api/stats', (req, res) => {
  // 这里可以添加使用统计逻辑
  res.json({
    success: true,
    data: {
      requests_today: 0,
      total_requests: 0,
      last_request: null
    }
  });
});

// 启动服务器
app.listen(PORT, HOST, () => {
  console.log(`🚀 PlzMe DeepSeek Proxy Server is running on port ${HOST}`);
  console.log(`📡 Health check: http://<你的局域网IP>:${PORT}/health`);
  console.log(`🤖 Chat API: http://<你的局域网IP>:${PORT}/api/chat`);
  console.log(`📋 Guide API: http://<你的局域网IP>:${PORT}/api/script-guide`);
  
  if (!process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY === 'your-deepseek-api-key') {
    console.log(`⚠️  请在 .env 文件中配置 DEEPSEEK_API_KEY`);
  }
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 收到 SIGTERM 信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 收到 SIGINT 信号，正在关闭服务器...');
  process.exit(0);
}); 