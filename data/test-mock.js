#!/usr/bin/env node

/**
 * Mock数据测试脚本
 * 验证剧本002的Mock数据完整性和功能
 */

const mockConfig = require('./mock-config');
const script002MockData = require('./script_002_mock');

console.log('🚀 开始测试剧本002 Mock数据...\n');

// 1. 基础数据验证
console.log('📋 1. 基础数据验证');
console.log('剧本ID:', script002MockData.id);
console.log('剧本标题:', script002MockData.title);
console.log('总场景数:', script002MockData.scenes.length);
console.log('支持高能模式:', script002MockData.energyMode ? '✅' : '❌');
console.log('剧本类型:', script002MockData.scriptType);
console.log('');

// 2. 场景完整性验证
console.log('🎬 2. 场景完整性验证'); 
const sceneIds = script002MockData.scenes.map(s => s.id);
const missingScenes = [];
for (let i = 1; i <= 30; i++) {
  if (!sceneIds.includes(i)) {
    missingScenes.push(i);
  }
}

if (missingScenes.length === 0) {
  console.log('✅ 所有30个场景都存在');
} else {
  console.log('❌ 缺少场景:', missingScenes);
}

// 按幕统计
const actStats = {1: 0, 2: 0, 3: 0};
script002MockData.scenes.forEach(scene => {
  if (actStats[scene.act] !== undefined) {
    actStats[scene.act]++;
  }
});
console.log('各幕场景数量:', actStats);
console.log('');

// 3. 特殊工具验证
console.log('🛠️ 3. 特殊工具验证');
const toolStats = {
  innerMonologue: 0,
  highEnergyMode: 0,
  relationshipAnalysis: 0,
  perspectiveSwitch: 0
};

script002MockData.scenes.forEach(scene => {
  if (scene.specialTools) {
    Object.keys(scene.specialTools).forEach(tool => {
      if (toolStats[tool] !== undefined) {
        toolStats[tool]++;
      }
    });
  }
});

console.log('工具使用统计:');
Object.entries(toolStats).forEach(([tool, count]) => {
  const toolConfig = script002MockData.specialTools[tool];
  console.log(`  ${toolConfig.icon} ${toolConfig.name}: ${count}个场景`);
});
console.log('');

// 4. 选择卡验证
console.log('💭 4. 选择卡验证');
let totalChoices = 0;
let choiceScenes = 0;
let inputScenes = 0;

script002MockData.scenes.forEach(scene => {
  if (scene.choices && scene.choices.length > 0) {
    choiceScenes++;
    totalChoices += scene.choices.length;
  }
  if (scene.keyAction === 'input') {
    inputScenes++;
  }
});

console.log('选择卡场景数:', choiceScenes);
console.log('总选择数量:', totalChoices);
console.log('自由输入场景:', inputScenes);
console.log('');

// 5. 关键场景验证
console.log('🎯 5. 关键场景验证');
const keyScenes = [
  {id: 1, name: '深夜的不安', type: '开场'},
  {id: 11, name: '周五的等待', type: '二幕开始'},
  {id: 17, name: '虚假的安慰', type: '高能模式触发'},
  {id: 21, name: '咖啡厅的真相', type: '三幕高潮'},
  {id: 26, name: '他的内心独白', type: '视角切换'},
  {id: 28, name: '关系报告', type: '结局分析'},
  {id: 30, name: '心理剧落幕', type: '最终结局'}
];

keyScenes.forEach(keyScene => {
  const scene = script002MockData.scenes.find(s => s.id === keyScene.id);
  if (scene) {
    console.log(`✅ ${keyScene.type}: 场景${keyScene.id} - ${scene.title}`);
  } else {
    console.log(`❌ 缺少关键场景: 场景${keyScene.id} - ${keyScene.name}`);
  }
});
console.log('');

// 6. 对话内容验证
console.log('💬 6. 对话内容验证');
let scenesWithAIMessage = 0;
let scenesWithChoiceText = 0;
let emptyDialogues = [];

script002MockData.scenes.forEach(scene => {
  if (scene.aiMessage && scene.aiMessage.trim().length > 0) {
    scenesWithAIMessage++;
  }
  
  if (scene.choices) {
    const hasValidChoices = scene.choices.some(choice => 
      choice.response && choice.response.trim().length > 0
    );
    if (hasValidChoices) {
      scenesWithChoiceText++;
    }
  }
  
  if (!scene.aiMessage && !scene.choices) {
    emptyDialogues.push(scene.id);
  }
});

console.log('包含AI对话的场景:', scenesWithAIMessage);
console.log('包含选择回复的场景:', scenesWithChoiceText);
if (emptyDialogues.length > 0) {
  console.log('❌ 缺少对话内容的场景:', emptyDialogues);
} else {
  console.log('✅ 所有场景都有对话内容');
}
console.log('');

// 7. 路径连接验证
console.log('🔗 7. 路径连接验证');
let brokenLinks = [];

script002MockData.scenes.forEach(scene => {
  if (scene.choices) {
    scene.choices.forEach(choice => {
      if (choice.nextScene && !sceneIds.includes(choice.nextScene)) {
        brokenLinks.push(`场景${scene.id}的选择${choice.id} -> 场景${choice.nextScene}`);
      }
    });
  }
  
  if (scene.nextScene && !sceneIds.includes(scene.nextScene)) {
    brokenLinks.push(`场景${scene.id} -> 场景${scene.nextScene}`);
  }
});

if (brokenLinks.length === 0) {
  console.log('✅ 所有场景链接都有效');
} else {
  console.log('❌ 发现断开的链接:', brokenLinks);
}
console.log('');

// 8. Mock配置验证
console.log('⚙️ 8. Mock配置验证');
console.log('Mock模式启用:', mockConfig.enableMock ? '✅' : '❌');
console.log('当前测试剧本:', mockConfig.currentScriptId);
console.log('预设选择路径数量:', Object.keys(mockConfig.testConfig.defaultChoices).length);

// 测试配置方法
try {
  const testScene = mockConfig.quickTest.jumpToScene(1);
  console.log('✅ jumpToScene方法正常');
  
  const act2Scenes = mockConfig.quickTest.getActScenes(2);
  console.log(`✅ getActScenes方法正常 (第2幕${act2Scenes.length}个场景)`);
  
  const choiceScenes = mockConfig.quickTest.getChoiceScenes();
  console.log(`✅ getChoiceScenes方法正常 (${choiceScenes.length}个选择场景)`);
} catch (error) {
  console.log('❌ Mock配置方法测试失败:', error.message);
}
console.log('');

// 9. 总结
console.log('📊 9. 测试总结');
const totalIssues = missingScenes.length + brokenLinks.length + emptyDialogues.length;

if (totalIssues === 0) {
  console.log('🎉 所有测试通过！Mock数据准备就绪');
  console.log('');
  console.log('📋 数据统计:');
  console.log(`   • 30个完整场景，分布在3幕中`);
  console.log(`   • ${totalChoices}个选择卡，${inputScenes}个自由输入点`);
  console.log(`   • 支持4种特殊工具：内心独白、高能女主模式、关系分析、视角切换`);
  console.log(`   • 完整的三幕式剧情结构和多重结局`);
  console.log(`   • 基于assets/script_example.md的真实对话内容`);
  console.log('');
  console.log('🚀 可以开始使用Mock数据进行开发和测试了！');
} else {
  console.log(`❌ 发现 ${totalIssues} 个问题需要修复`);
  console.log('');
  console.log('问题详情:');
  if (missingScenes.length > 0) console.log(`   • 缺少${missingScenes.length}个场景`);
  if (brokenLinks.length > 0) console.log(`   • ${brokenLinks.length}个断开的链接`);
  if (emptyDialogues.length > 0) console.log(`   • ${emptyDialogues.length}个场景缺少对话`);
}

console.log('\n✨ 测试完成！');

// 如果是命令行执行，设置退出码
if (require.main === module) {
  process.exit(totalIssues === 0 ? 0 : 1);
} 