#!/bin/bash

echo "🔧 修复前后端ID不匹配问题"
echo "=========================="

# 修复 enhanced-chat-manager.js
echo "修复 enhanced-chat-manager.js..."
sed -i.bak 's/script_1/1/g' frontend/utils/enhanced-chat-manager.js

# 修复 chat.js 中的剧本获取逻辑
echo "修复 chat.js..."  
sed -i.bak 's/script_1/1/g' frontend/pages/chat/chat.js

echo "✅ 修复完成！"
echo "现在重新启动小程序测试..."
