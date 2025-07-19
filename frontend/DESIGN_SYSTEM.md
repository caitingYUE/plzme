# PLZME 设计系统 - 印象派雪景主题

## 🎨 主题概述

PLZME采用紫色主导的分层设计理念：启动页保持印象派雪景的完整渐变过渡，营造艺术性的视觉冲击；而主功能页面以深邃紫色系为主，米粉色仅作20%的点缀装饰，确保界面简洁专业且白色文字清晰可读。

## 🌈 色彩系统

### 主色调
```css
--primary-color: #6b73a8;      /* 深紫蓝色 - 主色 */
--secondary-color: #8a92c7;    /* 中紫蓝色 - 辅助色 */
--accent-color: #b4bde6;       /* 浅紫蓝色 - 强调色 */
--warm-color: #F4C2A1;         /* 温暖米粉色 - 强调元素 */
```

### 背景色系统
```css
--bg-primary: transparent;                    /* 透明背景使用全局渐变 */
--bg-secondary: rgba(255, 248, 240, 0.18);   /* 温暖米色毛玻璃背景 */
--bg-tertiary: rgba(255, 248, 240, 0.25);    /* 更明显的米色毛玻璃区域 */
--bg-glass: rgba(255, 248, 240, 0.12);       /* 轻度米色毛玻璃效果 */
--bg-card: rgba(255, 248, 240, 0.15);        /* 卡片背景 */
```

### 文字色彩
```css
--text-primary: #FFFFFF;                      /* 主要文字 - 纯白色 */
--text-secondary: rgba(255, 255, 255, 0.92); /* 次要文字 - 高透明白 */
--text-muted: rgba(255, 255, 255, 0.75);     /* 辅助文字 - 中透明白 */
--text-accent: #F4C2A1;                       /* 强调文字 - 温暖米粉色 */
```

### 渐变色系统（加深版）
```css
--gradient-primary: linear-gradient(180deg, #fbcab8 0%, #e6b8a6 20%, #d0a394 40%, #9a9bc4 70%, #bbb4d2 100%);
--gradient-light: linear-gradient(135deg, rgba(255, 248, 240, 0.2) 0%, rgba(255, 248, 240, 0.1) 100%);
--gradient-accent: linear-gradient(90deg, #F4C2A1 0%, #F8D4B8 100%);
--gradient-logo: linear-gradient(90deg, #FFFFFF 0%, #F4C2A1 50%, #FFFFFF 100%);
```

## 🎯 设计原则

### 1. 印象派质感 (Impressionist Texture)
- 使用 `backdrop-filter: blur(20rpx)` 创建温暖的毛玻璃效果
- 米色半透明背景营造油画般的质感
- 模拟印象派画作的光影变化

### 2. 分层配色策略
- **启动页**：完整印象派渐变（温暖到冷色过渡）
- **功能页**：紫色系主导 + 20%米粉色点缀
- **导航系统**：启动页顶部米色，其他页面紫色统一
- 大幅提升白色文字可读性和专业感
- 阴影系统：`0 8rpx 32rpx rgba(107, 115, 168, 0.25)`

### 3. 艺术性点缀
- 使用温暖米粉色 (#F4C2A1) 作为天空色调的强调色
- 在冷调的紫蓝背景中提供温暖的视觉焦点
- 用于按钮、标签、重要信息等元素

## 📱 组件应用

### 卡片组件
```css
.card {
  background: var(--card-bg);
  backdrop-filter: blur(20rpx);
  border: 1rpx solid var(--card-border);
  box-shadow: var(--card-shadow);
}
```

### 按钮组件
```css
.btn-primary {
  background: var(--gradient-accent);
  color: white;
  box-shadow: 0 8rpx 32rpx rgba(244, 194, 161, 0.4);
}
```

### 标签组件
```css
.tag {
  background: rgba(244, 194, 161, 0.25);
  color: var(--warm-color);
  border: 1rpx solid rgba(244, 194, 161, 0.4);
}
```

## 🌟 视觉特效

### 1. 能量脉冲动画
```css
@keyframes energyPulse {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(244, 194, 161, 0.5);
  }
  50% { 
    box-shadow: 0 0 0 20rpx rgba(244, 194, 161, 0);
  }
}
```

### 2. Logo发光效果
```css
@keyframes logoGlow {
  0%, 100% { 
    filter: drop-shadow(0 6rpx 25rpx rgba(244, 194, 161, 0.7));
  }
  50% { 
    filter: drop-shadow(0 8rpx 30rpx rgba(248, 212, 184, 0.9));
  }
}
```

## 🎨 页面应用示例

### 首页
- 印象派雪景渐变背景（从温暖米色到深邃紫蓝）
- 米色质感的毛玻璃卡片展示内容
- 温暖米粉色强调用户等级和重要信息

### 剧本列表
- 瀑布流布局配合印象派质感卡片
- 搜索栏使用温暖米色毛玻璃效果
- 标签使用米粉色系突出显示

### 聊天界面
- 用户消息使用温暖米粉色渐变背景
- AI消息使用白色半透明背景
- 整体保持印象派雪景氛围

### 个人中心
- 用户卡片使用渐变玻璃效果
- 菜单项使用统一的米色毛玻璃背景
- 等级徽章使用米粉色强调

## 🔧 技术实现

### CSS变量系统
所有颜色都通过CSS变量定义，便于全局管理和主题切换。

### 响应式设计
在小屏设备上适当调整间距和字体大小，保持视觉一致性。

### 性能优化
- 使用硬件加速的CSS属性
- 合理使用backdrop-filter避免性能问题
- 动画使用transform和opacity属性

## 📋 设计检查清单

- [x] 分层配色策略实施完成
- [x] 启动页保持完整印象派渐变过渡
- [x] 功能页面紫色主导，米粉色20%点缀
- [x] PLZME Logo采用纯白色高对比度设计
- [x] 导航栏分层适配（启动页米色/功能页紫色）
- [x] 白色文字可读性全面提升
- [x] 卡片组件印象派质感效果
- [x] 按钮使用温暖米粉色渐变
- [x] 动画效果协调一致
- [x] 响应式适配完成

这套分层设计系统完美平衡了艺术美感与实用性：启动页提供震撼的视觉冲击，功能页面确保清晰的信息层次，整体体验既专业又充满艺术气息。 