# 加载兜底页面组件使用说明

## 🎯 功能说明

`loading-fallback` 组件是一个通用的白色底加载兜底页面，用于解决页面加载时出现紫色缓存帧的问题。提供优雅的加载动效和进度显示。

## 🔧 使用方法

### 1. 注册组件

在需要使用的页面的 `.json` 文件中注册组件：

```json
{
  "usingComponents": {
    "loading-fallback": "/components/loading-fallback/loading-fallback"
  }
}
```

### 2. 基础使用

```xml
<!-- 最简单的使用方式 -->
<loading-fallback 
  show="{{loading}}"
  loading-text="正在加载剧本..."
/>
```

### 3. 带进度条的使用

```xml
<!-- 显示进度条和自定义文字 -->
<loading-fallback 
  show="{{loading}}"
  loading-text="初始化中..."
  progress-text="正在准备心理剧场景"
  footer-text="初次加载可能需要更长时间"
  show-progress="{{true}}"
  progress="{{loadingProgress}}"
  bind:complete="onLoadComplete"
/>
```

### 4. 页面逻辑示例

```javascript
// pages/example/example.js
Page({
  data: {
    loading: true,
    loadingProgress: 0
  },

  onLoad() {
    this.loadPageData();
  },

  async loadPageData() {
    try {
      this.setData({ loading: true, loadingProgress: 0 });

      // 模拟加载过程
      this.updateProgress(20, '加载用户数据...');
      await this.loadUserData();

      this.updateProgress(50, '加载剧本列表...');
      await this.loadScripts();

      this.updateProgress(80, '初始化界面...');
      await this.initUI();

      this.updateProgress(100, '加载完成！');
      
      // 延迟隐藏加载页面
      setTimeout(() => {
        this.setData({ loading: false });
      }, 500);

    } catch (error) {
      console.error('加载失败:', error);
      this.setData({ loading: false });
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  updateProgress(progress, text) {
    this.setData({
      loadingProgress: progress,
      progressText: text
    });
  },

  onLoadComplete() {
    console.log('加载完成回调');
    this.setData({ loading: false });
  }
});
```

## 📋 属性列表

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `show` | Boolean | `false` | 是否显示加载页面 |
| `loading-text` | String | `'加载中...'` | 主要加载文字 |
| `progress-text` | String | `'请稍候，正在为您准备内容'` | 进度描述文字 |
| `footer-text` | String | `'网络较慢时请耐心等待'` | 底部提示文字 |
| `show-progress` | Boolean | `false` | 是否显示进度条 |
| `progress` | Number | `0` | 进度百分比 (0-100) |
| `custom-class` | String | `''` | 自定义样式类 |

## 🎪 事件列表

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `complete` | 加载完成时触发 | 无 |

## 💡 使用场景

### 1. 页面初始加载

```xml
<!-- 在页面加载时显示 -->
<loading-fallback 
  show="{{pageLoading}}"
  loading-text="正在加载页面..."
/>
```

### 2. 数据加载过程

```xml
<!-- 在获取数据时显示 -->
<loading-fallback 
  show="{{dataLoading}}"
  loading-text="获取最新数据..."
  progress-text="正在同步服务器数据"
  show-progress="{{true}}"
  progress="{{syncProgress}}"
/>
```

### 3. 文件下载进度

```xml
<!-- 在下载文件时显示 -->
<loading-fallback 
  show="{{downloading}}"
  loading-text="下载中..."
  progress-text="正在下载剧本资源"
  footer-text="请保持网络连接"
  show-progress="{{true}}"
  progress="{{downloadProgress}}"
/>
```

### 4. 长时间操作

```xml
<!-- 在处理复杂操作时显示 -->
<loading-fallback 
  show="{{processing}}"
  loading-text="处理中..."
  progress-text="正在生成AI回复"
  footer-text="首次生成可能需要更长时间"
/>
```

## 🎨 自定义样式

可以通过 `custom-class` 属性添加自定义样式：

```xml
<loading-fallback 
  show="{{loading}}"
  custom-class="custom-loading"
/>
```

```css
/* 自定义样式 */
.custom-loading .fallback-logo {
  color: #your-color !important;
}

.custom-loading .fallback-loading-text {
  font-size: 32rpx !important;
}
```

## ⚡ 性能优化

### 1. 避免频繁显示/隐藏

```javascript
// ❌ 不好的做法
setInterval(() => {
  this.setData({ loading: !this.data.loading });
}, 100);

// ✅ 好的做法  
this.setData({ loading: true });
await this.loadData();
this.setData({ loading: false });
```

### 2. 合理使用进度更新

```javascript
// ❌ 过于频繁的进度更新
for (let i = 0; i <= 100; i++) {
  this.setData({ progress: i });
}

// ✅ 适度的进度更新
const steps = [20, 40, 60, 80, 100];
for (const step of steps) {
  this.setData({ progress: step });
  await this.processStep();
}
```

## 🚨 注意事项

1. **避免长时间显示**: 加载页面不应该显示超过10秒，超时应该提供重试选项
2. **提供用户反馈**: 在长时间操作时，使用进度条和描述文字告知用户当前状态
3. **错误处理**: 当加载失败时，及时隐藏加载页面并提供错误信息
4. **内存管理**: 组件会自动清理定时器，但在页面卸载时确保隐藏加载页面

## 🔄 与性能优化结合使用

结合之前的性能优化方案，可以这样使用：

```javascript
// 结合快速客户端使用
const { getFastDeepSeekClient } = require('../../utils/fast-deepseek-client');

Page({
  async loadWithFallback() {
    this.setData({ loading: true });
    
    try {
      const fastClient = getFastDeepSeekClient();
      const response = await fastClient.fastChat(messages);
      
      // 快速响应，立即隐藏加载页面
      this.setData({ loading: false });
      
    } catch (error) {
      // 降级到显示加载页面
      this.setData({ 
        loading: true,
        progressText: '正在重试...' 
      });
      
      // 使用备用方案
      await this.fallbackMethod();
      this.setData({ loading: false });
    }
  }
});
```

通过这个组件，可以完全解决页面加载时的紫色缓存帧问题，提供统一、优雅的白色底加载体验！ 