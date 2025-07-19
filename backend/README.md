# PlzMe 后端服务 - 心理剧本管理系统

## 📋 项目概述

PlzMe 后端服务是一个基于 Flask 的 Web 应用，为 PlzMe 微信小程序提供剧本管理、内容生成和数据存储服务。系统支持用户故事投稿、AI 剧本生成、剧本管理和 API 接口服务。

## ✨ 核心功能

- **剧本管理系统**: Web界面管理剧本内容
- **AI内容生成**: 集成OpenAI API自动生成剧本内容
- **图片上传处理**: 支持剧本封面图片上传和管理
- **REST API服务**: 为小程序提供数据接口
- **SQLite数据库**: 轻量级数据存储解决方案
- **CORS支持**: 跨域资源共享配置

## 🛠️ 技术架构

### 后端技术栈
- **Web框架**: Flask 2.0+
- **数据库**: SQLite + SQLAlchemy ORM
- **AI集成**: OpenAI API / DeepSeek API
- **文件处理**: Python Pillow (图片处理)
- **跨域支持**: Flask-CORS

### 核心模块
- `app.py` - Flask应用主文件
- `models/models.py` - 数据模型定义
- `extensions.py` - Flask扩展配置
- `prompts_builder.py` - AI提示词构建
- `ai_script_generator.py` - AI内容生成
- `image_prompt_generator.py` - 图片提示词生成

## 🚀 快速开始

### 环境要求
- Python 3.8+
- pip 包管理器
- SQLite 3

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd Scripts_Creator_备份
```

2. **创建虚拟环境**
```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate     # Windows
```

3. **安装依赖**
```bash
pip install -r requirements.txt
```

4. **配置环境变量**
创建 `.env` 文件：
```bash
# AI API配置
DEEPSEEK_API_KEY=your_deepseek_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Flask配置
FLASK_ENV=development
FLASK_DEBUG=True
```

5. **初始化数据库**
```bash
python app.py
# 首次运行会自动创建数据库表
```

6. **启动服务**
```bash
python app.py
```

服务将在 `http://127.0.0.1:5001` 启动

## 📁 项目结构

```
Scripts_Creator_备份/
├── app.py                    # Flask应用主文件
├── requirements.txt          # Python依赖列表
├── extensions.py            # Flask扩展配置
├── prompts_builder.py       # AI提示词构建器
├── ai_script_generator.py   # AI内容生成器
├── image_prompt_generator.py # 图片提示词生成器
├── models/                  # 数据模型
│   ├── __init__.py
│   └── models.py           # SQLAlchemy模型定义
├── templates/              # HTML模板
│   ├── base.html          # 基础模板
│   ├── index.html         # 首页模板
│   ├── list.html          # 剧本列表模板
│   └── detail.html        # 剧本详情模板
├── static/                # 静态文件
├── uploads/               # 上传文件目录
│   └── .gitkeep          # 保留目录结构
└── instance/             # Flask实例文件夹
    └── plzme.db          # SQLite数据库文件
```

## 🔧 API接口

### 剧本相关接口

#### 获取剧本列表
```http
GET /api/scripts
```

**响应示例:**
```json
{
  "success": true,
  "list": [
    {
      "id": 1,
      "title": "剧本标题",
      "tag": "标签1,标签2",
      "summary": "剧本简介",
      "image_url": "http://127.0.0.1:5001/uploads/image.jpg",
      "created_at": "2024-07-19T15:43:35.426161",
      "updated_at": "2024-07-19T15:43:35.426161"
    }
  ],
  "total": 1
}
```

#### 获取单个剧本详情
```http
GET /api/scripts/{id}
```

**响应示例:**
```json
{
  "id": 1,
  "title": "剧本标题",
  "content": "原始故事内容",
  "tag": "标签1,标签2",
  "image_url": "http://127.0.0.1:5001/uploads/image.jpg",
  "roles": [
    {
      "name": "角色名",
      "personality": "性格描述"
    }
  ],
  "summary": "剧本简介",
  "scripts": [
    {
      "scene": "场景描述",
      "dialogue": ["对话1", "对话2"],
      "choices": [
        {
          "option": "选项描述",
          "reply": "回复内容",
          "result": "结果描述"
        }
      ]
    }
  ],
  "inner_monologue": "内心独白",
  "final_report": {
    "路径": "结果报告"
  }
}
```

### 内容生成接口

#### 生成图片提示词
```http
POST /api/generate_image_prompt
Content-Type: application/json

{
  "content": "故事内容"
}
```

#### 生成剧本内容
```http
POST /api/generate_script
Content-Type: application/json

{
  "content": "故事内容",
  "roles": [
    {
      "name": "角色名",
      "personality": "性格特点"
    }
  ]
}
```

## 🗄️ 数据库设计

### Script 模型
```python
class Script(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)      # 原始故事内容
    tag = db.Column(db.String(100))                   # 标签
    roles_json = db.Column(db.Text)                   # 角色设定(JSON)
    result_json = db.Column(db.Text)                  # AI生成结果(JSON)
    image_url = db.Column(db.String(255))             # 图片路径
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

## 🔒 安全配置

### CORS配置
- 允许跨域请求
- 支持微信小程序域名
- 配置安全headers

### 文件上传安全
- 限制文件类型
- 文件大小限制
- 安全文件名处理

## 🐛 常见问题

### 1. 数据库连接失败
- 检查SQLite文件权限
- 确认instance目录存在
- 查看Flask日志

### 2. AI API调用失败
- 验证API密钥配置
- 检查网络连接
- 确认API额度

### 3. 图片上传失败
- 检查uploads目录权限
- 确认文件大小限制
- 验证文件格式

## 📊 开发工具

### 数据库管理
```bash
# 进入Python交互环境
python
>>> from app import app, db
>>> with app.app_context():
...     db.create_all()  # 创建表
...     db.drop_all()    # 删除表
```

### API测试
```bash
# 测试剧本列表接口
curl http://127.0.0.1:5001/api/scripts

# 测试单个剧本接口
curl http://127.0.0.1:5001/api/scripts/1
```

## 📝 更新日志

### v1.0 (2024-07)
- ✅ Flask应用基础架构
- ✅ SQLite数据库集成
- ✅ 剧本CRUD操作
- ✅ AI内容生成功能
- ✅ 图片上传处理
- ✅ REST API接口
- ✅ Web管理界面

## 🚀 部署指南

### 开发环境
```bash
export FLASK_ENV=development
python app.py
```

### 生产环境
```bash
# 使用Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5001 app:app

# 使用uWSGI
pip install uwsgi
uwsgi --http :5001 --module app:app
```

## 📄 许可证

MIT License

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

**开发团队**: PlzMe Team  
**技术支持**: support@plzme.com  
**API文档**: 详见 `API_DOCS.md`  
**最后更新**: 2024年7月 