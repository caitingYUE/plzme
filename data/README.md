# PlzMe 剧本002 Mock数据使用指南

## 概述

本目录包含基于 `assets/script_example.md` 内容创建的剧本002《我们到底是什么关系》完整Mock数据，用于开发和测试。

## 文件说明

- `script_002_mock.js` - 剧本002的完整Mock数据
- `mock-config.js` - Mock数据配置和测试工具
- `README.md` - 使用说明（当前文件）

## 主要特性

### ✨ 完整剧本流程
- **30个完整场景**：涵盖三幕结构
- **真实对话内容**：基于assets/script_example.md的完整对话
- **多重结局分支**：根据用户选择展现不同结局

### 🛠️ 特殊功能工具
- **内心独白** 💭：窥视AI角色的内心想法
- **高能女主模式** 🔥：AI主动推进剧情，5分钟限时体验
- **关系分析报告** 📊：多维度关系分析和个性化建议
- **视角切换** 🔍：切换到对方视角了解真实想法

### 📊 数据结构特点
- **选择卡系统**：每个选择都有详细的情感影响说明
- **自由输入支持**：关键节点支持用户自由输入
- **分支路径管理**：智能识别输入内容并匹配相应剧情分支
- **成长追踪**：记录用户在情感觉察、边界技能等方面的成长

## 快速开始

### 1. 基础使用

```javascript
const mockConfig = require('./mock-config');

// 获取剧本数据
const script002 = mockConfig.mockScripts.script_002;

// 获取第一个场景
const firstScene = script002.scenes[0];
console.log(firstScene.title); // "深夜的不安"
```

### 2. 场景测试

```javascript
const mockConfig = require('./mock-config');

// 跳转到特定场景
const scene11 = mockConfig.quickTest.jumpToScene(11);
console.log(scene11.title); // "周五的等待"

// 获取第二幕所有场景
const act2Scenes = mockConfig.quickTest.getActScenes(2);
console.log(act2Scenes.length); // 10个场景

// 获取包含内心独白工具的场景
const monologueScenes = mockConfig.quickTest.getScenesWithTool('innerMonologue');
```

### 3. 工具测试

```javascript
const mockConfig = require('./mock-config');

// 模拟内心独白响应
const monologue = mockConfig.mockApiResponses.innerMonologueResponse(1);
console.log(monologue.content); // 内心独白内容

// 模拟关系分析响应
const analysis = mockConfig.mockApiResponses.relationshipAnalysisResponse(11);
console.log(analysis.patterns); // 关系模式分析
```

## 场景结构说明

### 第一幕：裂痕初显 (场景1-10)
- **核心冲突**：发现朋友圈权限设置，开始质疑关系
- **关键场景**：场景1（深夜的不安）、场景4（压抑的关心）
- **可用工具**：内心独白

### 第二幕：沉默的重量 (场景11-20)  
- **核心冲突**：三天没联系，在试探和等待中焦虑升级
- **关键场景**：场景11（周五的等待）、场景12（犹豫的借口）、场景17（虚假的安慰）
- **可用工具**：关系分析报告、高能女主模式

### 第三幕：直面迷雾 (场景21-30)
- **核心冲突**：咖啡厅目睹真相，最终勇敢设立边界
- **关键场景**：场景21（咖啡厅的真相）、场景26（他的内心独白）、场景28（关系报告）
- **可用工具**：视角切换、最终关系报告

## 特殊工具详解

### 1. 内心独白 💭
- **冷却时间**：30秒
- **可用场景**：1, 4, 11, 12, 17, 21
- **功能**：窥视AI角色的内心想法和真实动机

```javascript
// 示例：场景1的内心独白
{
  content: '我到底在想什么...明明那张照片很甜蜜，为什么要隐藏？难道我对他来说是不能见光的秘密吗？',
  emotion: '困惑、受伤'
}
```

### 2. 高能女主模式 🔥
- **持续时间**：5分钟
- **可激活场景**：17, 18
- **效果**：
  - AI主动发起话题和推进剧情
  - 减少等待时间，体验更流畅的对话
  - 探索更主动的关系处理方式

### 3. 关系分析报告 📊
- **冷却时间**：2分钟
- **可用场景**：11, 22, 28
- **内容**：关系模式分析、洞察建议、具体行动指南

```javascript
// 示例：场景11的关系分析
{
  patterns: [
    '沟通模式：你主动-他被动，83%的对话由你发起',
    '回复时间：他的平均回复时间从2分钟延长到4小时'
  ],
  insights: [
    '他正在通过延迟回复和简短回复来拉开距离'
  ],
  suggestions: [
    '尝试减少主动联系的频率，观察他的反应'
  ]
}
```

### 4. 视角切换 🔍
- **可用场景**：11, 12, 25, 26
- **功能**：切换到对方视角，了解TA的真实想法
- **特点**：非互动式，自动播放后返回主视角

## 测试和调试

### 数据验证
```javascript
const mockConfig = require('./mock-config');

// 验证数据完整性
const issues = mockConfig.debug.validateData();
if (issues.length === 0) {
  console.log('✅ 所有数据验证通过');
}
```

### 场景调试
```javascript
const mockConfig = require('./mock-config');

// 打印场景详细信息
mockConfig.debug.logScene(21);
// 输出：场景ID、标题、幕次、关键动作、AI消息、可用工具等
```

### 自动测试路径
Mock配置中预设了一条完整的测试路径：
1. 场景1选择C（回避问题）
2. 场景11选择A（主动邀约）
3. 场景12选择B（委屈妥协）
4. 场景21-27按照示例对话进行自由输入

## 扩展说明

### 相比原始示例的增强功能

1. **高能女主模式**：原示例中缺少，新增5分钟限时体验
2. **多维度工具系统**：除了视角切换，新增内心独白和关系分析
3. **完整30场景**：补充了缺失的场景内容
4. **智能分支识别**：自动匹配用户输入到对应剧情分支
5. **成长追踪系统**：记录用户在各方面的成长进度

### 数据丰富度

- **对话内容**：基于真实示例，每个场景都有详细的AI回复
- **情感层次**：每个选择都标注了情感类型和潜在影响
- **心理洞察**：结合了心理学理论的关系分析和建议
- **实用指导**：提供了具体的现实生活指导建议

## 使用建议

1. **开发测试**：使用`mockConfig.testConfig`快速测试各种场景
2. **功能验证**：通过`quickTest`方法验证特定功能
3. **数据完整性**：定期运行`validateData()`确保数据一致性
4. **用户体验**：参考`followUpAdvice`设计后续用户引导

## 注意事项

- Mock数据仅用于开发测试，实际使用时需要替换为真实API调用
- 高能女主模式有时间限制，注意在测试中处理超时情况
- 关系分析报告有冷却时间，避免频繁调用
- 视角切换是单向的，切换后会自动返回主视角

---

这套Mock数据完整地模拟了剧本002的所有功能，为开发和测试提供了坚实的基础。通过这些数据，你可以验证所有特殊工具的表现，测试不同的用户选择路径，并确保整个剧本体验的流畅性。 