#!/usr/bin/env node

/**
 * PlzMe 小程序开发启动脚本
 * 用于快速启动开发环境和相关服务
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🚀 启动 PlzMe 小程序开发环境...\n');

// 检查项目结构
function checkProjectStructure() {
  console.log('📁 检查项目结构...');
  
  const requiredDirs = [
    'miniprogram',
    'miniprogram/pages',
    'miniprogram/assets',
    'docs'
  ];
  
  const requiredFiles = [
    'miniprogram/app.js',
    'miniprogram/app.json', 
    'miniprogram/app.wxss',
    'package.json'
  ];
  
  let allExists = true;
  
  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`❌ 缺少目录: ${dir}`);
      allExists = false;
    } else {
      console.log(`✅ ${dir}`);
    }
  });
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      console.log(`❌ 缺少文件: ${file}`);
      allExists = false;
    } else {
      console.log(`✅ ${file}`);
    }
  });
  
  if (allExists) {
    console.log('✨ 项目结构检查完成！\n');
  } else {
    console.log('⚠️  项目结构不完整，请检查缺少的文件和目录\n');
  }
  
  return allExists;
}

// 检查依赖
function checkDependencies() {
  console.log('📦 检查项目依赖...');
  
  if (!fs.existsSync('package.json')) {
    console.log('❌ 缺少 package.json 文件');
    return false;
  }
  
  if (!fs.existsSync('node_modules')) {
    console.log('📥 安装依赖包...');
    exec('npm install', (error, stdout, stderr) => {
      if (error) {
        console.log(`❌ 依赖安装失败: ${error}`);
        return;
      }
      console.log('✅ 依赖安装完成');
    });
  } else {
    console.log('✅ 依赖已安装\n');
  }
  
  return true;
}

// 显示开发指南
function showDevGuide() {
  console.log('📖 开发指南:\n');
  
  console.log('🔧 开发工具:');
  console.log('  - 下载并安装微信开发者工具');
  console.log('  - 使用工具打开 miniprogram 目录');
  console.log('  - 确保已配置 AppID (或使用测试号)\n');
  
  console.log('📱 页面结构:');
  console.log('  - 首页: pages/index/index (疗愈卡片 + 活动)');
  console.log('  - 剧本: pages/scripts/scripts (瀑布流布局)');
  console.log('  - 我的: pages/profile/profile (用户中心)\n');
  
  console.log('🎨 UI 风格:');
  console.log('  - 深夜疗愈风格 (#1A202C 主色)');
  console.log('  - 温和紫蓝色调 (#6B73FF 强调色)');
  console.log('  - 温暖黄色点缀 (#FBD38D 辅助色)\n');
  
  console.log('⚡ 特色功能:');
  console.log('  - 高能女主模式 (长按头像激活)');
  console.log('  - AI 心理剧导演 (DeepSeek API)');
  console.log('  - 瀑布流剧本列表 (小红书风格)\n');
  
  console.log('🔧 开发建议:');
  console.log('  - 使用微信开发者工具的真机预览功能');
  console.log('  - 关注深色主题适配');
  console.log('  - 注意 rpx 单位的使用');
  console.log('  - 测试不同屏幕尺寸的适配\n');
}

// 显示 API 配置提示
function showAPIConfig() {
  console.log('🔌 API 配置提示:\n');
  
  console.log('📝 当前使用模拟数据，生产环境需要:');
  console.log('  1. 配置 DeepSeek API 密钥');
  console.log('  2. 部署后端服务 (Node.js + Express)');
  console.log('  3. 配置 MongoDB 数据库');
  console.log('  4. 更新 app.js 中的 apiURL\n');
  
  console.log('🔐 安全注意:');
  console.log('  - API 密钥不要直接写在前端代码中');
  console.log('  - 使用服务端代理调用 AI 接口');
  console.log('  - 配置请求域名白名单\n');
}

// 显示文档链接
function showDocuments() {
  console.log('📚 相关文档:\n');
  
  console.log('项目文档:');
  console.log('  - 📋 需求文档: docs/requirements.md');
  console.log('  - 🗄️  数据库设计: docs/database-design.md');
  console.log('  - 🔌 API 设计: docs/api-design.md');
  console.log('  - 🤖 AI 集成: docs/ai-integration.md');
  console.log('  - 🛠️  开发指南: docs/development-guide.md');
  console.log('  - 📅 实施计划: docs/implementation-plan.md\n');
  
  console.log('技术文档:');
  console.log('  - 微信小程序官方文档: https://developers.weixin.qq.com/miniprogram/dev/');
  console.log('  - DeepSeek API 文档: https://platform.deepseek.com/api-docs/');
  console.log('  - Node.js 官方文档: https://nodejs.org/docs/\n');
}

// 主函数
function main() {
  try {
    // 检查项目结构
    const structureOk = checkProjectStructure();
    
    // 检查依赖
    const depsOk = checkDependencies();
    
    if (structureOk && depsOk) {
      console.log('🎉 环境检查完成，可以开始开发！\n');
    }
    
    // 显示指南
    showDevGuide();
    showAPIConfig();
    showDocuments();
    
    console.log('💡 提示: 如需启动后端服务，请运行 npm run server');
    console.log('🚀 准备就绪！打开微信开发者工具开始开发吧！\n');
    
  } catch (error) {
    console.error('❌ 启动脚本执行失败:', error);
  }
}

// 运行主函数
main(); 