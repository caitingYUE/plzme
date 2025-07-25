# PlzMe 心理剧本互动平台 - 产品需求文档 (PRD)

**版本**: v2.0  
**创建日期**: 2024年12月  
**最后更新**: 2024年12月  
**文档状态**: 正式版  

---

## 1. 产品概述

### 1.1 产品简介
PlzMe 是一款基于微信小程序的心理剧本互动平台，通过AI驱动的角色扮演和选择卡机制，帮助用户在安全的虚拟环境中探索情感关系、提升心理健康水平和沟通能力。

### 1.2 产品定位
- **主要定位**: 心理健康+娱乐互动的轻量级心理剧场
- **目标用户**: 18-35岁，关注心理健康、情感成长的年轻用户
- **核心价值**: 寓教于乐的心理探索体验，安全的情感表达空间

### 1.3 产品愿景
成为年轻人首选的情感探索和心理成长平台，通过科技手段降低心理健康服务的门槛。

---

## 2. 市场分析

### 2.1 目标用户画像

#### 主要用户群体
1. **情感困惑者** (40%)
   - 年龄: 20-28岁
   - 特点: 面临恋爱关系问题，缺乏情感表达技巧
   - 需求: 学习沟通技巧，理解关系模式

2. **心理健康关注者** (35%)
   - 年龄: 25-35岁
   - 特点: 重视心理健康，追求自我成长
   - 需求: 心理疏导，情绪管理

3. **好奇尝试者** (25%)
   - 年龄: 18-25岁
   - 特点: 对新鲜事物感兴趣，喜欢互动体验
   - 需求: 娱乐体验，社交话题

### 2.2 用户需求分析
- **核心需求**: 安全的情感表达和探索空间
- **功能需求**: 个性化剧本、智能AI对话、情感分析
- **体验需求**: 流畅交互、沉浸感、隐私保护

---

## 3. 功能需求

### 3.1 核心功能模块

#### 3.1.1 剧本系统
**功能描述**: 提供多样化的心理剧本模板

**详细需求**:
- **剧本分类**:
  - 按人群: 男主本、女主本、双主本、不限人群
  - 按主题: 情感治愈、关系边界、沟通技巧、自我成长
  - 按难度: 入门级、进阶级、专业级
  
- **剧本内容**:
  - 剧本标题、简介、封面图
  - 角色设定(用户角色、AI角色)
  - 30个渐进式场景
  - 核心场景和关键对话
  - 预期收获和成长目标

- **剧本管理**:
  - 剧本列表展示(网格/列表切换)
  - 分类筛选和搜索
  - 收藏功能
  - 体验历史记录

#### 3.1.2 AI对话系统
**功能描述**: 基于DeepSeek API的智能对话引擎

**详细需求**:
- **对话机制**:
  - 选择卡引导模式(3-4个选项)
  - 自由输入模式
  - 混合交互模式
  
- **AI角色**:
  - 根据剧本自动适配角色性格
  - 情感状态动态调整
  - 对话历史记忆
  
- **智能功能**:
  - 情感分析和识别
  - 个性化回复生成
  - 安全内容过滤

#### 3.1.3 特殊功能工具
**功能描述**: 增强用户体验的心理工具

**详细需求**:
1. **内心独白** (30秒冷却)
   - AI角色内心想法展示
   - 增强沉浸感和真实性
   
2. **高能女主模式** (5分钟限时)
   - 自动连续对话
   - AI主动引导剧情
   
3. **关系分析报告** (2分钟冷却)
   - 多维度关系分析
   - 个性化成长建议

#### 3.1.4 场景管理
**功能描述**: 动态场景切换和进度管理

**详细需求**:
- 30个渐进式场景
- 场景列表查看和跳转
- 进度条显示
- 场景介绍和背景设定

### 3.2 辅助功能模块

#### 3.2.1 用户系统
- 微信登录授权
- 用户信息管理
- 隐私设置

#### 3.2.2 个人中心
- 体验历史
- 成长报告
- 收藏管理
- 设置中心

#### 3.2.3 创作系统
- 自定义剧本创建
- 剧本草稿保存
- 剧本分享(未来功能)

---

## 4. 用户体验要求

### 4.1 界面设计要求
- **设计风格**: 温暖、包容、专业的视觉设计
- **色彩方案**: 以紫色为主色调，体现心理健康专业性
- **交互设计**: 简洁直观，降低学习成本
- **响应式**: 适配不同屏幕尺寸

### 4.2 性能要求
- **加载速度**: 首屏加载时间 < 3秒
- **响应时间**: AI回复延迟 < 5秒
- **流畅度**: 页面切换动画 60fps
- **稳定性**: 无关键功能崩溃

### 4.3 可用性要求
- **易用性**: 新用户上手时间 < 5分钟
- **无障碍**: 支持读屏软件
- **兼容性**: 微信版本兼容性 >= 7.0.0

---

## 5. 技术要求

### 5.1 架构要求
- **前端**: 微信小程序原生开发
- **后端**: Node.js + Express(代理服务器)
- **AI服务**: DeepSeek API集成
- **存储**: 微信小程序本地存储 + 缓存优化

### 5.2 性能优化要求
- **缓存策略**: 多级缓存(内存+本地+会话)
- **数据压缩**: 大数据自动压缩
- **请求优化**: AI请求缓存和去重
- **存储优化**: 批量写入和过期清理

### 5.3 安全要求
- **数据安全**: 本地数据加密存储
- **隐私保护**: 不收集敏感个人信息
- **内容安全**: AI回复内容过滤
- **接口安全**: API请求频率限制

---

## 6. 商业模式

### 6.1 当前阶段
- **免费体验**: 基础剧本免费使用
- **功能限制**: 特殊工具使用频率限制
- **广告模式**: 预留广告位(未启用)

### 6.2 未来规划
- **会员订阅**: 高级剧本解锁
- **付费工具**: 深度心理分析报告
- **内容生态**: 用户原创剧本平台

---

## 7. 项目里程碑

### 7.1 已完成功能 ✅
- 核心剧本系统(2个主要剧本)
- AI对话引擎集成
- 选择卡交互机制
- 特殊功能工具
- 场景管理系统
- 性能优化(缓存系统)

### 7.2 优化完成 ✅
- **第一阶段**: ScriptManager单例模式 + 多级缓存
- **第二阶段**: AI请求缓存 + 存储优化
- 内存使用优化 30-40%
- AI响应速度提升 50-80%
- 存储I/O减少 60-70%

### 7.3 未来规划
- 更多剧本内容(目标20+剧本)
- 云端数据同步
- 用户创作平台
- 社区功能
- 数据分析后台

---

## 8. 风险评估

### 8.1 技术风险
- **AI服务依赖**: DeepSeek API稳定性
- **性能瓶颈**: 大数据量下的响应速度
- **兼容性**: 微信小程序平台更新影响

**应对措施**:
- AI服务降级方案(模拟回复)
- 缓存和优化策略
- 定期兼容性测试

### 8.2 产品风险
- **用户留存**: 单次体验后的回访率
- **内容质量**: AI回复的专业性和准确性
- **用户反馈**: 负面体验的处理

**应对措施**:
- 持续优化用户体验
- AI内容质量监控
- 用户反馈收集机制

---

## 9. 成功指标

### 9.1 用户指标
- **DAU**: 日活跃用户数
- **留存率**: 7日留存率 > 30%
- **完成率**: 剧本完整体验率 > 60%
- **满意度**: 用户评分 > 4.5/5.0

### 9.2 技术指标
- **性能**: 平均响应时间 < 3秒
- **稳定性**: 可用性 > 99.5%
- **缓存命中率**: > 70%

### 9.3 业务指标
- **月活增长**: 月环比增长 > 20%
- **使用深度**: 平均会话时长 > 10分钟
- **功能使用**: 特殊工具使用率 > 40%

---

## 10. 附录

### 10.1 术语表
- **剧本**: 结构化的心理剧场景模板
- **选择卡**: 引导用户选择的交互选项
- **AI角色**: 由AI扮演的对话角色
- **场景**: 剧本中的具体情境设定
- **特殊工具**: 增强体验的心理功能

### 10.2 参考资料
- 心理学相关理论
- 微信小程序开发文档
- DeepSeek API文档
- 用户体验设计规范

---

**文档维护**: 产品团队  
**审核**: 技术负责人  
**版本控制**: Git版本管理 