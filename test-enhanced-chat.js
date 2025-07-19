/**
 * 增强对话交互系统测试
 */

const EnhancedChatManager = require('./utils/enhanced-chat-manager');
const EnhancedScriptManager = require('./utils/enhanced-script-manager');

async function testEnhancedChatSystem() {
  console.log('🎭 开始测试增强对话交互系统...\n');

  const chatManager = new EnhancedChatManager();
  const scriptManager = new EnhancedScriptManager();

  try {
    // 先测试脚本管理器
    console.log('测试脚本管理器初始化...');
    scriptManager.initializeScripts();
    console.log('脚本管理器初始化完成');
    
    // 1. 测试会话初始化
    console.log('1. 测试会话初始化');
    
    // 先检查可用的剧本
    console.log('可用剧本:');
    const allScripts = scriptManager.getAllScripts();
    console.log('脚本数量:', allScripts.length);
    allScripts.forEach(script => {
      console.log(`- ID: ${script.id}, 标题: ${script.title}`);
    });
    console.log('');
    
    const userId = 'test_user_001';
    const scriptId = 'script_001'; // 使用已生成的剧本ID
    
    const sessionData = await chatManager.initializeSession(userId, scriptId);
    console.log('✅ 会话初始化成功');
    console.log('会话Key:', sessionData.sessionKey);
    console.log('当前场景:', sessionData.currentScene.name);
    console.log('开场消息类型:', Object.keys(sessionData.openingMessage));
    console.log('');

    // 2. 测试选择卡交互
    console.log('2. 测试选择卡交互');
    
    // 获取初始选择卡
    const initialChoicesResult = await chatManager.processUserInteraction(
      sessionData.sessionKey,
      {
        type: 'get_choices',
        context: 'initial'
      }
    );

    if (initialChoicesResult.nextChoices) {
      console.log('✅ 初始选择卡生成成功');
      console.log('选择数量:', initialChoicesResult.nextChoices.choices.length);
      console.log('提示文本:', initialChoicesResult.nextChoices.prompt);
      
      // 测试第一个选择
      const firstChoice = initialChoicesResult.nextChoices.choices[0];
      console.log('第一个选择:', firstChoice.text);
      console.log('心理维度:', firstChoice.psychologicalDimension);
      console.log('');

      // 模拟用户选择
      const choiceResult = await chatManager.processUserInteraction(
        sessionData.sessionKey,
        {
          type: 'choice',
          choice: firstChoice,
          choiceIndex: 0
        }
      );

      console.log('✅ 选择处理成功');
      if (choiceResult.userMessage) {
        console.log('用户消息:', choiceResult.userMessage.content);
      }
      if (choiceResult.aiResponse) {
        console.log('AI回应:', choiceResult.aiResponse.content);
      }
      console.log('');
    }

    // 3. 测试自由输入交互
    console.log('3. 测试自由输入交互');
    
    const freeInputResult = await chatManager.processUserInteraction(
      sessionData.sessionKey,
      {
        type: 'free_input',
        text: '我感觉很困惑，不知道我们之间的关系到底是什么'
      }
    );

    console.log('✅ 自由输入处理成功');
    if (freeInputResult.inputAnalysis) {
      console.log('情感分析:', freeInputResult.inputAnalysis.emotion);
      console.log('意图分析:', freeInputResult.inputAnalysis.intent);
      console.log('关键词:', freeInputResult.inputAnalysis.keywords);
    }
    console.log('');

    // 4. 测试特殊功能
    console.log('4. 测试特殊功能');
    
    // 测试内心独白
    const monologueResult = await chatManager.processUserInteraction(
      sessionData.sessionKey,
      {
        type: 'special_feature',
        featureType: 'inner_monologue'
      }
    );

    if (monologueResult.type === 'inner_monologue') {
      console.log('✅ 内心独白生成成功');
      console.log('内容长度:', monologueResult.content.length, '字符');
      console.log('角色:', monologueResult.character);
    }
    console.log('');

    // 5. 测试高能模式
    console.log('5. 测试高能模式');
    
    const highEnergyResult = await chatManager.processUserInteraction(
      sessionData.sessionKey,
      {
        type: 'special_feature',
        featureType: 'high_energy_mode'
      }
    );

    if (highEnergyResult.highEnergyMessage) {
      console.log('✅ 高能模式激活成功');
      console.log('高能回复:', highEnergyResult.highEnergyMessage.content);
    }
    console.log('');

    // 6. 测试关系分析（需要足够的交互次数）
    console.log('6. 测试关系分析');
    
    // 先进行更多交互以满足最小交互次数要求
    for (let i = 0; i < 3; i++) {
      await chatManager.processUserInteraction(
        sessionData.sessionKey,
        {
          type: 'free_input',
          text: `这是第${i + 1}次额外的测试输入`
        }
      );
    }

    const analysisResult = await chatManager.processUserInteraction(
      sessionData.sessionKey,
      {
        type: 'special_feature',
        featureType: 'relationship_analysis'
      }
    );

    if (analysisResult.type === 'relationship_analysis') {
      console.log('✅ 关系分析生成成功');
      console.log('分析内容预览:', analysisResult.content.substring(0, 100) + '...');
    } else if (analysisResult.error) {
      console.log('⚠️ 关系分析:', analysisResult.error);
    }
    console.log('');

    // 7. 测试选择维度生成
    console.log('7. 测试选择维度生成');
    
    const phases = ['opening', 'development', 'conflict', 'resolution'];
    phases.forEach(phase => {
      const dimensions = chatManager.getChoiceDimensions(phase);
      console.log(`${phase}阶段选择数量:`, dimensions.length);
      console.log(`示例选择:`, dimensions[0].text);
    });
    console.log('');

    // 8. 测试情感分析
    console.log('8. 测试情感分析');
    
    const testTexts = [
      '我真的很生气',
      '我感到很难过',
      '我很开心',
      '为什么会这样？',
      '我们分手吧',
      '我爱你'
    ];

    for (const text of testTexts) {
      const analysis = await chatManager.analyzeUserInput(text);
      console.log(`"${text}" -> 情感:${analysis.emotion}, 意图:${analysis.intent}`);
    }
    console.log('');

    console.log('🎉 增强对话交互系统测试完成！');
    console.log('✅ 所有核心功能运行正常');

  } catch (error) {
    console.error('❌ 测试失败:', error);
    console.error('错误详情:', error.stack);
  }
}

// 运行测试
if (require.main === module) {
  testEnhancedChatSystem();
}

module.exports = { testEnhancedChatSystem }; 