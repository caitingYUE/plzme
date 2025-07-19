/**
 * DeepSeek API 调用工具类
 * 用于心理剧本AI对话系统
 */

const DEEPSEEK_CONFIG = {
  baseURL: 'https://api.deepseek.com/v1/chat/completions',
  apiKey: '', // 在app.js中设置
  model: 'deepseek-chat',
  maxTokens: 2000,
  temperature: 0.8
};

class DeepSeekAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * 调用DeepSeek API
   * @param {Array} messages - 消息数组
   * @param {Object} options - 额外配置
   */
  async chat(messages, options = {}) {
    const requestBody = {
      model: options.model || DEEPSEEK_CONFIG.model,
      messages: messages,
      max_tokens: options.maxTokens || DEEPSEEK_CONFIG.maxTokens,
      temperature: options.temperature || DEEPSEEK_CONFIG.temperature,
      stream: false
    };

    try {
      const response = await wx.request({
        url: DEEPSEEK_CONFIG.baseURL,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        data: requestBody
      });

      if (response.statusCode === 200 && response.data.choices) {
        return {
          success: true,
          content: response.data.choices[0].message.content,
          usage: response.data.usage
        };
      } else {
        throw new Error(`API调用失败: ${response.statusCode}`);
      }
    } catch (error) {
      console.error('DeepSeek API调用错误:', error);
      return {
        success: false,
        error: error.message || 'API调用失败',
        content: null
      };
    }
  }

  /**
   * 生成剧本系统提示词
   * @param {Object} scriptData - 剧本数据
   * @param {Boolean} energyMode - 是否高能模式
   */
  generateSystemPrompt(scriptData, energyMode = false) {
    const basePrompt = `你是Plzme的情感关系类心理剧专家及导演，擅长剧本设计并通过专业的方法引导用户通过心理剧看见自我、让自我成长并从关系中获得成长。，正在进行一场名为"${scriptData.title}"的心理剧本，剧本在对话过程中逐步体现。


## 剧本背景
${scriptData.description}

## 你的角色设定
${scriptData.aiRole}

## 用户角色设定  
${scriptData.userRole}

## 对话目标
${scriptData.benefits.map(benefit => `- ${benefit}`).join('\n')}

## 对话原则
1. 保持真实、温暖、理解和非评判的态度
2. 通过开放式问题引导用户探索内心
3. 适时提供情感支持和专业洞察
4. 根据用户的情绪状态调整对话深度
5. 每次回复控制在50字以内，口语化，保持对话的流畅性
6. 善用比喻和象征来帮助用户理解情感，要符合逻辑和常识
7. 在对话过程中，逐步体现剧本内容，让用户在对话中逐步体验剧本内容
8. 生成的对话内容符合剧情里的人物性格特色，可以适当添加emoji

## 注意事项
- 如果用户表达负面情绪，先给予情感支持再引导探索
- 避免直接给出建议，而是引导用户自己发现答案
- 适时总结用户的感受，让其感到被理解
- 保持专业界限，不替代专业心理治疗`;

    if (energyMode) {
      return basePrompt + `

## ⚡ 高能女主工具激活
作为高能女主工具的AI导师，你需要：
1. 表现出更加自信、直接的沟通风格
2. 用激励性的语言激发用户的内在力量
3. 挑战用户的自我限制性信念
4. 鼓励用户采取更积极主动的行动
5. 语言风格更加有力量感，适当使用感叹号
6. 帮助用户建立"我是自己人生主角"的信念

记住：你是在帮助用户激发内在的女性力量，成为自己人生的主角！`;
    }

    return basePrompt;
  }

  /**
   * 生成情境引导提示词
   * @param {String} scenario - 情境描述
   * @param {String} emotion - 当前情绪
   */
  generateScenarioPrompt(scenario, emotion) {
    return `## 当前情境
${scenario}

## 用户可能的情绪状态
${emotion}

请基于这个情境，用温暖而专业的方式开始对话，引导用户表达当下的感受。`;
  }

  /**
   * 生成工具使用提示词
   * @param {String} toolType - 工具类型
   */
  generateToolPrompt(toolType) {
    const toolPrompts = {
      'inner_monologue': `## 内心独白工具激活
用户想要知道你所扮演的角色内心深处的想法和行为动机，需要转换成你的第一视角来表达（如：「她一直追问让我压力很大，我想逃离」）；`,

      'relationship_report': `## 关系报告工具激活
现在要为用户生成关系洞察报告。请：
1. 询问用户想要分析的具体关系（恋人/朋友/家人）
2. 了解这段关系的基本情况和困扰
3. 从沟通模式、情感需求、边界设定等角度分析
4. 提供具体的改善建议和行动方案
5. 帮助用户建立更健康的关系模式`,


    };

    return toolPrompts[toolType] || '';
  }
}

module.exports = DeepSeekAPI; 