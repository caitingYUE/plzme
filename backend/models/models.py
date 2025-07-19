# models/models.py
from datetime import datetime
from extensions import db

class Script(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    tag = db.Column(db.String(100))
    roles_json = db.Column(db.Text)  # 新增：存储角色与属性
    result_json = db.Column(db.Text)  # 存储 AI 返回剧本
    image_url = db.Column(db.String(255))  # 新增：存储图片路径
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Script {self.id} - {self.title}>"
    
