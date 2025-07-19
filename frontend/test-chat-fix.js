/**
 * 测试增强聊天管理器的修复效果
 */

// 模拟微信小程序环境
global.console = console;

// 引入模块
const EnhancedChatManager = require('./utils/enhanced-chat-manager');

async function testEnhancedChatManager() {
  console.log('🧪 开始测试 Enhanced Chat Manager...\n');
  
  try {
    // 1. 创建管理器实例
    console.log('1️⃣ 创建管理器实例...');
    const chatManager = new EnhancedChatManager();
    console.log('✅ 管理器创建成功\n');
    
    // 2. 初始化会话
    console.log('2️⃣ 初始化聊天会话...');
    const sessionData = await chatManager.initializeSession('test_user', 'script_001', {
      userPreferences: {
        preferredInteractionMode: 'guided'
      }
    });
    console.log('✅ 会话初始化成功');
    console.log(`📋 会话Key: ${sessionData.sessionKey}`);
    console.log(`📚 剧本标题: ${sessionData.script.title}`);
    console.log(`🎬 当前场景: ${sessionData.currentScene.name}\n`);
    
    // 3. 测试开场消息
    console.log('3️⃣ 测试开场消息...');
    console.log('场景介绍:', sessionData.openingMessage.sceneIntro.content);
    console.log('角色介绍:', sessionData.openingMessage.roleIntro.content);
    console.log('第一句话:', sessionData.openingMessage.firstMessage.content);
    console.log('✅ 开场消息生成成功\n');
    
    // 4. 测试获取选择卡
    console.log('4️⃣ 测试获取选择卡...');
    const choicesResult = await chatManager.processUserInteraction(
      sessionData.sessionKey,
      {
        type: 'get_choices',
        context: 'initial'
      }
    );
    
    if (choicesResult.nextChoices) {
      console.log(`✅ 成功生成 ${choicesResult.nextChoices.choices.length} 个选择卡`);
      choicesResult.nextChoices.choices.forEach((choice, index) => {
        console.log(`   ${index + 1}. ${choice.text} (${choice.type})`);
      });
    }
    console.log('');
    
    // 5. 测试选择卡交互
    console.log('5️⃣ 测试选择卡交互...');
    if (choicesResult.nextChoices && choicesResult.nextChoices.choices.length > 0) {
      const firstChoice = choicesResult.nextChoices.choices[0];
      const choiceResult = await chatManager.processUserInteraction(
        sessionData.sessionKey,
        {
          type: 'choice',
          choice: firstChoice,
          choiceIndex: 0
        }
      );
      
      console.log('✅ 选择卡交互成功');
      console.log('用户消息:', choiceResult.userMessage.content);
      console.log('AI回应:', choiceResult.aiResponse.content);
    }
    console.log('');
    
    // 6. 测试特殊功能可用性
    console.log('6️⃣ 测试特殊功能...');
    
    // 模拟多次交互以解锁特殊功能
    for (let i = 0; i < 3; i++) {
      await chatManager.processUserInteraction(
        sessionData.sessionKey,
        {
          type: 'choice',
          choice: choicesResult.nextChoices.choices[0],
          choiceIndex: 0
        }
      );
    }
    
    // 检查特殊功能是否可用
    const sessionAfterInteractions = chatManager.sessionData.get(sessionData.sessionKey);
    if (sessionAfterInteractions.interactionCount >= 3) {
      console.log('✅ 特殊功能已解锁');
      console.log(`🔄 交互次数: ${sessionAfterInteractions.interactionCount}`);
      
      // 测试内心独白
      const innerMonologueResult = await chatManager.processUserInteraction(
        sessionData.sessionKey,
        {
          type: 'special_feature',
          featureType: 'inner_monologue'
        }
      );
      
      console.log('💭 内心独白:', innerMonologueResult.content);
    }
    console.log('');
    
    console.log('🎉 所有测试通过！Enhanced Chat Manager 工作正常。');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    console.error('详细错误:', error.stack);
  }
}

// 运行测试
if (require.main === module) {
  testEnhancedChatManager();
}

module.exports = { testEnhancedChatManager }; 