#!/usr/bin/env node

/**
 * 剧本生成器测试脚本
 * 测试ScriptGenerator对assets/scripts_list中MD文件的处理
 */

const ScriptGenerator = require('./utils/script-generator');
const fs = require('fs');
const path = require('path');

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

async function testScriptGenerator() {
  log('bright', '🚀 开始测试 ScriptGenerator\n');
  
  const generator = new ScriptGenerator();
  const scriptsDir = path.join(__dirname, 'assets/scripts_list');
  
  try {
    // 获取所有MD文件
    const files = fs.readdirSync(scriptsDir).filter(file => file.endsWith('.md'));
    log('blue', `发现 ${files.length} 个MD文件`);
    
    for (const file of files.slice(0, 3)) { // 只测试前3个文件
      log('yellow', `\n📄 处理文件: ${file}`);
      
      const filePath = path.join('assets/scripts_list', file);
      const scriptId = file.replace('.md', '');
      
      // 生成剧本信息
      const scriptInfo = await generator.generateScriptFromMD(filePath, scriptId);
      
      if (scriptInfo) {
        log('green', '✅ 生成成功');
        
        // 输出生成的信息
        console.log('');
        log('cyan', '📋 生成的剧本信息:');
        console.log(`标题: ${scriptInfo.title} (${scriptInfo.title.length}字)`);
        console.log(`简介: ${scriptInfo.summary} (${scriptInfo.summary.length}字)`);
        console.log(`标签: ${scriptInfo.tags.join(', ')}`);
        console.log(`类型: ${scriptInfo.scriptType}`);
        console.log(`视角: ${scriptInfo.perspective}`);
        console.log(`角色: ${scriptInfo.characters.join(', ')}`);
        console.log(`预估时长: ${scriptInfo.estimatedDuration}分钟`);
        console.log(`难度: ${scriptInfo.difficulty}`);
        console.log(`情感强度: ${scriptInfo.emotionalIntensity}`);
        
        // 显示前5个场景
        log('cyan', '\n🎬 场景预览 (前5个):');
        scriptInfo.scenes.slice(0, 5).forEach((scene, index) => {
          console.log(`${index + 1}. ${scene.name}: ${scene.description}`);
        });
        
        console.log(`... 还有 ${scriptInfo.scenes.length - 5} 个场景`);
        
      } else {
        log('red', '❌ 生成失败');
      }
      
      console.log('\n' + '='.repeat(60));
    }
    
    log('green', '\n🎉 测试完成！');
    
  } catch (error) {
    log('red', `❌ 测试失败: ${error.message}`);
    console.error(error);
  }
}

// 运行测试
testScriptGenerator(); 