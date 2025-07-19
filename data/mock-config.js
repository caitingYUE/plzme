/**
 * Mock数据配置文件
 * 用于测试和开发
 */

const script002MockData = require('./script_002_mock');

const mockConfig = {
  // 是否启用mock模式
  enableMock: true,
  
  // 当前测试的剧本ID
  currentScriptId: 'script_002',
  
  // Mock数据映射
  mockScripts: {
    'script_002': script002MockData
  },
  
  // 测试配置
  testConfig: {
    // 是否跳过等待动画
    skipAnimations: true,
    
    // 是否自动播放
    autoPlay: false,
    
    // 默认用户选择（用于自动测试）
    defaultChoices: {
      1: 'C', // 第一个场景选择C
      11: 'A', // 第二幕选择A
      12: 'B', // 选择B进入委屈妥协路线
      21: '哦是吗，挺忙呀，那怎么还有时间给我发消息', // 自由输入
      22: '以后还是别用【宝贝】这样的词来称呼吧，我们又没有确定关系，这样我会很容易误会',
      27: '没什么，我也只是刚好路过，以后还是减少联系吧，我想清楚了，我们只适合作为普通朋友，那些模糊不清的话也不要再跟我说了'
    },
    
    // 特殊工具测试开关
    toolTesting: {
      innerMonologue: true,
      highEnergyMode: true,
      relationshipAnalysis: true,
      perspectiveSwitch: true
    }
  },
  
  // 场景测试快捷方式
  quickTest: {
    // 直接跳转到特定场景
    jumpToScene: (sceneId) => {
      return mockConfig.mockScripts[mockConfig.currentScriptId].scenes.find(s => s.id === sceneId);
    },
    
    // 获取特定幕的所有场景
    getActScenes: (actNumber) => {
      return mockConfig.mockScripts[mockConfig.currentScriptId].scenes.filter(s => s.act === actNumber);
    },
    
    // 获取包含特定工具的场景
    getScenesWithTool: (toolName) => {
      return mockConfig.mockScripts[mockConfig.currentScriptId].scenes.filter(s => 
        s.specialTools && s.specialTools[toolName]
      );
    },
    
    // 获取关键选择场景
    getChoiceScenes: () => {
      return mockConfig.mockScripts[mockConfig.currentScriptId].scenes.filter(s => 
        s.keyAction === 'choice' || s.keyAction === 'input'
      );
    }
  },
  
  // API模拟响应
  mockApiResponses: {
    // DeepSeek API响应模拟
    deepseekResponse: (sceneId, userInput) => {
      const scene = mockConfig.quickTest.jumpToScene(sceneId);
      if (!scene) return null;
      
      return {
        choices: [
          {
            message: {
              content: scene.aiMessage || "这是一个测试回复"
            }
          }
        ]
      };
    },
    
    // 内心独白API响应
    innerMonologueResponse: (sceneId) => {
      const scene = mockConfig.quickTest.jumpToScene(sceneId);
      if (!scene || !scene.specialTools?.innerMonologue) return null;
      
      return {
        content: scene.specialTools.innerMonologue.content,
        emotion: scene.specialTools.innerMonologue.emotion
      };
    },
    
    // 关系分析API响应
    relationshipAnalysisResponse: (sceneId) => {
      const scene = mockConfig.quickTest.jumpToScene(sceneId);
      if (!scene || !scene.specialTools?.relationshipAnalysis) return null;
      
      return scene.specialTools.relationshipAnalysis.content;
    }
  },
  
  // 调试工具
  debug: {
    // 打印当前场景信息
    logScene: (sceneId) => {
      const scene = mockConfig.quickTest.jumpToScene(sceneId);
      console.log('=== 场景调试信息 ===');
      console.log('场景ID:', scene.id);
      console.log('标题:', scene.title);
      console.log('幕次:', scene.act);
      console.log('关键动作:', scene.keyAction);
      console.log('AI消息:', scene.aiMessage);
      console.log('可用工具:', Object.keys(scene.specialTools || {}));
      console.log('===================');
      return scene;
    },
    
    // 验证数据完整性
    validateData: () => {
      const script = mockConfig.mockScripts[mockConfig.currentScriptId];
      const issues = [];
      
      // 检查场景连续性
      const sceneIds = script.scenes.map(s => s.id);
      for (let i = 1; i <= 30; i++) {
        if (!sceneIds.includes(i)) {
          issues.push(`缺少场景ID: ${i}`);
        }
      }
      
      // 检查选择链路
      script.scenes.forEach(scene => {
        if (scene.choices) {
          scene.choices.forEach(choice => {
            if (choice.nextScene && !sceneIds.includes(choice.nextScene)) {
              issues.push(`场景${scene.id}的选择${choice.id}指向不存在的场景${choice.nextScene}`);
            }
          });
        }
      });
      
      if (issues.length === 0) {
        console.log('✅ 数据验证通过');
      } else {
        console.log('❌ 发现问题:', issues);
      }
      
      return issues;
    }
  }
};

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
  module.exports = mockConfig;
}

// 如果在浏览器环境中
if (typeof window !== 'undefined') {
  window.mockConfig = mockConfig;
}