/**
 * 加载兜底页面组件
 * 用于在页面加载缓慢时提供友好的白色底加载界面
 */

Component({
  properties: {
    // 是否显示加载页面
    show: {
      type: Boolean,
      value: false
    },
    
    // 主要加载文字
    loadingText: {
      type: String,
      value: '加载中...'
    },
    
    // 进度描述文字
    progressText: {
      type: String,
      value: '请稍候，正在为您准备内容'
    },
    
    // 底部提示文字
    footerText: {
      type: String,
      value: '网络较慢时请耐心等待'
    },
    
    // 是否显示进度条
    showProgress: {
      type: Boolean,
      value: false
    },
    
    // 进度百分比 (0-100)
    progress: {
      type: Number,
      value: 0
    },
    
    // 自定义样式类
    customClass: {
      type: String,
      value: ''
    }
  },

  data: {
    // 组件内部状态
    internalProgress: 0,
    animationTimer: null
  },

  lifetimes: {
    attached() {
      console.log('🔄 加载兜底页面组件已挂载');
      
      // 如果显示进度条但没有外部进度，启动模拟进度
      if (this.data.showProgress && this.data.progress === 0) {
        this.startMockProgress();
      }
    },

    detached() {
      console.log('🔄 加载兜底页面组件已卸载');
      this.clearMockProgress();
    }
  },

  observers: {
    'show': function(show) {
      if (show) {
        console.log('📱 显示加载兜底页面');
        
        // 如果需要显示进度条且没有外部进度，启动模拟进度
        if (this.data.showProgress && this.data.progress === 0) {
          this.startMockProgress();
        }
      } else {
        console.log('📱 隐藏加载兜底页面');
        this.clearMockProgress();
      }
    },

    'progress': function(newProgress) {
      // 如果有外部进度更新，停止模拟进度
      if (newProgress > 0 && this.data.animationTimer) {
        this.clearMockProgress();
      }
    }
  },

  methods: {
    /**
     * 启动模拟进度动画
     */
    startMockProgress() {
      if (this.data.animationTimer) return;
      
      console.log('🎯 启动模拟进度动画');
      
      let currentProgress = 0;
      const timer = setInterval(() => {
        currentProgress += Math.random() * 3 + 1; // 每次增加1-4%
        
        if (currentProgress >= 95) {
          currentProgress = 95; // 最多到95%，留给真实加载完成
          clearInterval(timer);
          this.setData({ animationTimer: null });
        }
        
        this.setData({ internalProgress: Math.round(currentProgress) });
      }, 100);
      
      this.setData({ animationTimer: timer });
    },

    /**
     * 清除模拟进度动画
     */
    clearMockProgress() {
      if (this.data.animationTimer) {
        clearInterval(this.data.animationTimer);
        this.setData({ 
          animationTimer: null,
          internalProgress: 0 
        });
      }
    },

    /**
     * 完成加载（进度到100%）
     */
    completeLoading() {
      this.clearMockProgress();
      this.setData({ internalProgress: 100 });
      
      // 延迟隐藏，让用户看到100%
      setTimeout(() => {
        this.triggerEvent('complete');
      }, 500);
    },

    /**
     * 手动设置进度
     */
    setProgress(progress) {
      this.clearMockProgress();
      this.setData({ internalProgress: Math.max(0, Math.min(100, progress)) });
    },

    /**
     * 更新加载文字
     */
    updateLoadingText(text) {
      this.setData({ loadingText: text });
    },

    /**
     * 更新进度文字
     */
    updateProgressText(text) {
      this.setData({ progressText: text });
    }
  }
}); 