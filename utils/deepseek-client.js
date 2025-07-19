/**
 * DeepSeek API 客户端
 * 用于与本地代理服务器通信，支持智能缓存
 * 已优化：超时时间从30秒降低到5秒，优先使用快速mock模式
 */

const CONFIG = require('./config.js');
const { getGlobalAICache } = require('./ai-request-cache');
const { getFastDeepSeekClient } = require('./fast-deepseek-client');

const DEEPSEEK_PROXY_HOST = CONFIG.proxyHost;

class DeepSeekClient {
  constructor() {
    this.baseURL = DEEPSEEK_PROXY_HOST;
    this.timeout = 30000; // 超时时间从5秒提升到30秒
    this.aiCache = getGlobalAICache();
    this.fastClient = getFastDeepSeekClient(); // 快速客户端备用
    this.useFastModeFirst = false; // 优先使用快速模式
  }

  /**
   * 新的chat方法，兼容OpenAI格式，支持智能缓存
   * 已优化：优先使用快速模式，大幅提升响应速度
   */
  async chat(messages, options = {}) {
    try {
      const { model = 'deepseek-chat', temperature = 0.7, max_tokens = 500 } = options;
      
      if (!messages || messages.length === 0) {
        throw new Error('消息数组不能为空');
      }

      // 0. 如果启用快速模式，优先使用快速客户端（100ms内响应）
      if (this.useFastModeFirst) {
        try {
          console.log('⚡ 使用快速模式...');
          return await this.fastClient.fastChat(messages, options);
        } catch (fastError) {
          console.warn('快速模式失败，回退到正常模式:', fastError.message);
        }
      }

      // 1. 首先尝试从缓存获取
      const cachedResponse = await this.aiCache.getCachedResponse(messages, options);
      if (cachedResponse) {
        console.log('🚀 使用AI缓存响应');
        return {
          content: cachedResponse.content,
          message: cachedResponse.message || cachedResponse.content,
          usage: cachedResponse.usage,
          fromCache: true
        };
      }

      // 2. 生成请求键，防止重复请求
      const requestKey = this.aiCache._generateCacheKey(messages, options);
      
      // 3. 使用防重复请求机制
      const actualRequest = async () => {
        const startTime = Date.now();
        
        try {
          const response = await this._request('/api/chat', {
            method: 'POST',
            data: {
              messages: messages,
              model,
              temperature,
              max_tokens
            }
          });

          if (response.success) {
            const responseTime = Date.now() - startTime;
            const result = {
              content: response.data.message,
              message: response.data.message,
              usage: response.data.usage,
              fromCache: false
            };
            
            // 缓存成功的API响应
            this.aiCache.setCachedResponse(messages, options, result, responseTime);
            this.aiCache.stats.apiCalls++;
            
            return result;
          } else {
            throw new Error(response.error || '调用失败');
          }
        } catch (apiError) {
          console.warn('API调用失败，使用智能模拟数据:', apiError.message);
          
          // 使用智能模拟响应
          const mockResponse = this._generateSmartMockResponse(messages);
          const result = {
            content: mockResponse,
            message: mockResponse,
            fromCache: false,
            isMock: true
          };
          
          // 也可以缓存模拟响应（短时间）
          this.aiCache.setCachedResponse(messages, options, result, Date.now() - startTime);
          
          return result;
        }
      };

      // 4. 使用去重和防抖机制
      return await this.aiCache.deduplicateRequest(requestKey, actualRequest);
      
    } catch (error) {
      console.error('DeepSeek chat API 调用失败:', error);
      
      // 最后的fallback
      return {
        content: '我理解你的感受，让我们继续深入探讨这个话题。',
        message: '我理解你的感受，让我们继续深入探讨这个话题。',
        fromCache: false,
        isError: true
      };
    }
  }

  /**
   * 生成智能模拟响应
   */
  _generateSmartMockResponse(messages) {
    const lastMessage = messages[messages.length - 1];
    const userContent = lastMessage.content.toLowerCase();
    
    // 检查是否是选择卡生成请求
    if (userContent.includes('json') || userContent.includes('选择卡') || userContent.includes('回应选项')) {
      return `[
  {
    "title": "温和回应",
    "replyText": "我明白你的想法，我们可以慢慢聊。",
    "potentialImpact": "营造轻松的对话氛围"
  },
  {
    "title": "表达关心",
    "replyText": "我有些担心你，想知道你现在的真实感受。",
    "potentialImpact": "传达关心和在意"
  },
  {
    "title": "深入了解",
    "replyText": "能详细说说这件事对你的影响吗？",
    "potentialImpact": "获得更深层的理解"
  }
]`;
    }
    
    if (userContent.includes('心事') || userContent.includes('聊聊') || userContent.includes('想法')) {
      return '你说得对，我确实有些事情在想。最近工作上的压力让我有点喘不过气，回到家也总是心不在焉的。谢谢你注意到了。';
    } else if (userContent.includes('疏远') || userContent.includes('发生了什么')) {
      return '我没有故意疏远你...只是最近真的太累了。我知道这样对你不公平，我也不知道该怎么说。';
    } else if (userContent.includes('天气') || userContent.includes('不错')) {
      return '是啊，天气不错。不过...我总觉得我们之间有什么话没说开，你有这种感觉吗？';
    } else if (userContent.includes('担心') || userContent.includes('不开心')) {
      return '我知道你担心我，这让我既感动又愧疚。我不想让你也跟着我一起烦恼，但是看来我还是让你担心了。';
    } else if (userContent.includes('明白') || userContent.includes('不容易')) {
      return '谢谢你这么说，有你理解真的很重要。我只是需要一些时间来处理这些事情，但我不想让你觉得我在推开你。';
    } else if (userContent.includes('回避') || userContent.includes('谈谈')) {
      return '你说得对，我们确实应该好好谈谈。我一直在逃避，因为我害怕说出来会让事情变得更复杂。';
    } else if (userContent.includes('角度') || userContent.includes('接受')) {
      return '也许你说得对，我一直从负面的角度看问题。但是换个角度说起来容易，做起来很难，你觉得我们应该怎么开始？';
    } else if (userContent.includes('站在你这边') || userContent.includes('希望你知道')) {
      return '听到你这么说我真的很感动。有时候我觉得整个世界都在和我作对，但至少我还有你。这对我来说意义重大。';
    } else if (userContent.includes('冷静') || userContent.includes('想想')) {
      return '你说得对，我们都需要冷静下来想想。我承认我最近情绪不太稳定，可能说了一些伤人的话。';
    } else if (userContent.includes('害怕') || userContent.includes('失去')) {
      return '其实我也很害怕...害怕我的这些负面情绪会影响到我们的关系。我不想因为我的问题而失去你这个对我最重要的人。';
    } else if (userContent.includes('底线') || userContent.includes('无法接受')) {
      return '我理解你的底线，我也不希望我们的关系走到那一步。我会努力改变的，但我需要你的耐心和支持。';
    } else if (userContent.includes('解决方案') || userContent.includes('更好')) {
      return '我也希望情况能变得更好。也许我们可以制定一个计划，让我们的沟通变得更顺畅，让我学会更好地处理压力。';
    } else {
      // 通用回复，符合心理剧语调
      const genericResponses = [
        '你的话让我想到了很多。我一直在想我们之间是不是出现了什么问题，但又不敢直接问你。',
        '我承认我最近状态不好，可能让你也感到困扰了。这不是我想要的结果。',
        '有时候我觉得我们好像在用不同的语言对话，明明很关心对方，却总是表达不好。',
        '谢谢你愿意和我谈这些。我知道我需要做些改变，只是不知道从哪里开始。'
      ];
      
      return genericResponses[Math.floor(Math.random() * genericResponses.length)];
    }
  }

  /**
   * 发送HTTP请求
   */
  _request(url, options = {}) {
    return new Promise((resolve, reject) => {
      const { method = 'GET', data = null } = options;
      
      if (typeof wx !== 'undefined' && wx.request) {
        wx.request({
          url: `${this.baseURL}${url}`,
          method: method,
          data: data,
          header: {
            'Content-Type': 'application/json'
          },
          timeout: this.timeout,
          success: (res) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(res.data);
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${res.data?.message || '请求失败'}`));
            }
          },
          fail: (error) => {
            reject(new Error(`网络请求失败: ${error.errMsg || '未知错误'}`));
          }
        });
      } else {
        console.log(`模拟 DeepSeek API 请求: ${method} ${url}`);
        // 立即返回，不需要延迟
        resolve({
          success: true,
          data: {
            message: this._getMockResponse(url, data)
          }
        });
      }
    });
  }

  /**
   * 获取模拟响应
   */
  _getMockResponse(url, data) {
    if (url.includes('chat')) {
      if (data && data.phase === 'inner_monologue') {
        return '此刻我的内心很复杂，既想要亲近又担心受伤。用户的话触动了我内心深处的想法。';
      } else if (data && data.phase === 'high_energy_mode') {
        return '我要勇敢地表达自己的想法！';
      } else if (data && data.phase === 'relationship_analysis') {
        return `【关系状态】：正在探索和磨合中，双方都在寻找合适的相处模式
【性格特点】：善于观察、情感细腻、渴望理解、勇于表达
【成长建议】：保持真诚沟通、建立健康边界、培养自我价值感
【温暖鼓励】：你的真诚和勇气值得被珍惜，继续做那个敢于表达的自己`;
      } else {
        return '我理解你的感受，让我们继续深入这个话题。';
      }
    }
    return '模拟响应内容';
  }

  /**
   * 发送消息（旧接口，保持兼容性）
   */
  async sendMessage(params) {
    try {
      const { message, scriptId, phase = 'opening', userRole, aiRole, history = [] } = params;
      
      if (!message) {
        throw new Error('消息内容不能为空');
      }

      const response = await this._request('/api/chat', {
        method: 'POST',
        data: {
          message,
          scriptId,
          phase,
          userRole,
          aiRole,
          history
        }
      });

      return response;
    } catch (error) {
      console.error('DeepSeek API 调用失败:', error);
      throw error;
    }
  }
}

// 创建全局实例
const deepSeekClient = new DeepSeekClient();

// 导出
module.exports = DeepSeekClient;

// 如果在小程序环境中，也导出全局实例
if (typeof getApp !== 'undefined') {
  getApp().globalData = getApp().globalData || {};
  getApp().globalData.deepSeekClient = deepSeekClient;
} 