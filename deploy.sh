#!/bin/bash

# PlzMe 全栈项目一键部署脚本
# 版本: 1.0.0
# 作者: PlzMe Team

echo "�� PlzMe 全栈项目部署脚本 v1.0.0"
echo "====================================="

# 检查Python环境
check_python() {
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3 未安装，请先安装 Python 3.8+"
        exit 1
    fi
    echo "✅ Python 环境检查通过"
}

# 安装后端依赖
install_backend() {
    echo "📦 安装后端依赖..."
    cd backend/
    pip3 install -r requirements.txt
    echo "✅ 后端依赖安装完成"
    cd ..
}

# 启动后端服务
start_backend() {
    echo "🚀 启动后端服务..."
    cd backend/
    nohup python3 app.py > ../plzme_backend.log 2>&1 &
    echo $! > ../plzme_backend.pid
    echo "✅ 后端服务已启动 (端口: 5001)"
    echo "📋 日志文件: plzme_backend.log"
    cd ..
}

# 检查服务状态
check_status() {
    echo "🔍 检查服务状态..."
    if curl -s http://localhost:5001/ > /dev/null; then
        echo "✅ 后端服务运行正常"
    else
        echo "❌ 后端服务未运行"
    fi
}

# 停止服务
stop_services() {
    echo "⏹️  停止后端服务..."
    if [[ -f "plzme_backend.pid" ]]; then
        kill $(cat plzme_backend.pid) 2>/dev/null || true
        rm -f plzme_backend.pid
        echo "✅ 后端服务已停止"
    fi
}

# 主函数
case "${1:-help}" in
    "install")
        check_python
        install_backend
        echo "🎉 安装完成！运行 './deploy.sh start' 启动服务"
        ;;
    "start")
        start_backend
        echo "🎯 请用微信开发者工具打开 frontend/ 目录"
        ;;
    "stop")
        stop_services
        ;;
    "status")
        check_status
        ;;
    "restart")
        stop_services
        sleep 2
        start_backend
        ;;
    *)
        echo "用法: ./deploy.sh [install|start|stop|status|restart]"
        ;;
esac
