# app.py
from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory
from flask_cors import CORS
import os
from datetime import datetime
from extensions import db  # ✅ 改为从 extensions 导入
from prompts_builder import build_script_prompt
from ai_script_generator import generate_script_from_prompt
from image_prompt_generator import generate_image_prompt
from models.models import Script
import json

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///plzme.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/')
def index():
    return redirect(url_for('list_scripts'))


@app.route('/submit_story', methods=['POST'])
def submit_story():
    content = request.form.get('content')
    tag = request.form.get('tag')
    image = request.files.get('image')
    roles_json = request.form.get('roles_json')
    result_json = request.form.get('ai_result')

    if not content:
        return jsonify({'error': 'Story content is required'}), 400

    try:
        # 从AI结果中解析标题
        script_data = json.loads(result_json) if result_json else {}
        title = script_data.get('title', '未命名剧本')

        # 保存图片（可选）
        image_url = None
        if image and image.filename:
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            filename = f"{timestamp}_{image.filename}"
            image_url = os.path.join('uploads', filename)  # 存储相对路径
            save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(save_path)

        # 创建新剧本
        script = Script(
            title=title,
            content=content,
            tag=tag,
            roles_json=roles_json,
            result_json=result_json,
            image_url=image_url,  # 使用相对路径
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        db.session.add(script)
        db.session.commit()
        return redirect(url_for('list_scripts'))
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/scripts')
def list_scripts():
    scripts = Script.query.all()
    return render_template('list.html', scripts=scripts)

@app.route('/scripts/<int:script_id>')
def script_detail(script_id):
    script = Script.query.get_or_404(script_id)
    # 将相对路径转换为URL
    if script.image_url:
        script.display_image_url = '/' + script.image_url
    # 兼容模板，提供 tags 属性
    script.tags = script.tag if hasattr(script, 'tag') else ''
    # 解析AI生成的剧本结构
    if script.result_json:
        try:
            result = json.loads(script.result_json)
            script.summary = result.get('summary', '')
            script.roles = result.get('roles', [])
            script.scripts = result.get('scripts', [])
            script.inner_monologue = result.get('inner_monologue', '')
            script.final_report = result.get('final_report', {})
        except Exception:
            script.summary = ''
            script.roles = []
            script.scripts = []
            script.inner_monologue = ''
            script.final_report = {}
    else:
        script.summary = ''
        script.roles = []
        script.scripts = []
        script.inner_monologue = ''
        script.final_report = {}
    return render_template('detail.html', script=script, active_nav='edit')


# 编辑剧本的 POST 路由
@app.route('/scripts/<int:script_id>/edit', methods=['POST'])
def edit_script(script_id):
    script = Script.query.get_or_404(script_id)
    
    try:
        # 获取表单数据
        title = request.form.get('title')
        tag = request.form.get('tag')
        content = request.form.get('content')
        result_json = request.form.get('result_json')
        image = request.files.get('image')

        # 保存图片（可选）
        if image and image.filename:
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            filename = f"{timestamp}_{image.filename}"
            image_url = os.path.join('uploads', filename)  # 存储相对路径
            save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(save_path)
            script.image_url = image_url  # 使用相对路径

        # 更新 Script 对象
        script.title = title
        script.tag = tag
        script.content = content
        script.result_json = result_json
        script.updated_at = datetime.utcnow()

        # 提交到数据库
        db.session.commit()
        return redirect(url_for('script_detail', script_id=script.id))
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/submit')
def submit():
    return render_template('index.html')

@app.route('/api/generate_image_prompt', methods=['POST'])
def api_generate_image_prompt():
    try:
        data = request.get_json()
        content = data.get('content', '')
        
        if not content:
            return jsonify({
                'success': False,
                'error': 'Story content is required'
            }), 400
            
        image_prompt = generate_image_prompt(content)
        
        return jsonify({
            'success': True,
            'image_prompt': image_prompt
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/generate_script', methods=['POST'])
def api_generate_script():
    data = request.get_json()
    content = data.get('content')
    roles = data.get('roles')
    only_image_prompt = data.get('only_image_prompt', False)
    
    # 1. 生成图片prompt
    try:
        image_prompt = generate_image_prompt(content)
    except Exception as e:
        image_prompt = f"[图片描述生成失败] {str(e)}"
        
    if only_image_prompt:
        return jsonify({'success': True, 'image_prompt': image_prompt})
        
    # 2. 生成剧本
    try:
        prompt = build_script_prompt(title='', content=content, tag='', roles_json=json.dumps(roles, ensure_ascii=False))
        result = generate_script_from_prompt(prompt)
        
        # 验证返回的JSON是否有效
        try:
            json.loads(result)
        except:
            return jsonify({
                'success': False,
                'error': 'AI返回的数据不是有效的JSON格式'
            })
        
        return jsonify({
            'success': True,
            'image_prompt': image_prompt,
            'result_json': result
        })
    except Exception as e:
        return jsonify({
            'success': False, 
            'error': str(e), 
            'image_prompt': image_prompt
        })

# 添加静态文件路由
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# API: 获取所有剧本列表
@app.route('/api/scripts', methods=['GET'])
def api_get_scripts():
    try:
        scripts = Script.query.all()
        scripts_list = []
        
        for script in scripts:
            # 解析AI生成的剧本结构
            if script.result_json:
                try:
                    result = json.loads(script.result_json)
                except Exception:
                    result = {}
            else:
                result = {}
            
            # 构造完整图片URL
            image_url = ''
            if script.image_url:
                image_url = url_for('uploaded_file', filename=script.image_url[len('uploads/'):], _external=True)
            
            scripts_list.append({
                'id': script.id,
                'title': script.title,
                'tag': script.tag,
                'summary': result.get('summary', script.content[:100] if script.content else ''),
                'image_url': image_url,
                'created_at': script.created_at.isoformat() if script.created_at else '',
                'updated_at': script.updated_at.isoformat() if script.updated_at else ''
            })
        
        return jsonify({
            'success': True,
            'list': scripts_list,
            'total': len(scripts_list)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# API: 获取单个剧本详情
@app.route('/api/scripts/<int:script_id>', methods=['GET'])
def api_get_script(script_id):
    script = Script.query.get_or_404(script_id)
    # 解析AI生成的剧本结构
    if script.result_json:
        try:
            result = json.loads(script.result_json)
        except Exception:
            result = {}
    else:
        result = {}
    # 构造完整图片URL
    image_url = url_for('uploaded_file', filename=script.image_url[len('uploads/'):] if script.image_url else '', _external=True) if script.image_url else ''
    return jsonify({
        'id': script.id,
        'title': script.title,
        'tag': script.tag,
        'content': script.content,
        'image_url': image_url,
        'roles': result.get('roles', []),
        'summary': result.get('summary', ''),
        'scripts': result.get('scripts', []),
        'inner_monologue': result.get('inner_monologue', ''),
        'final_report': result.get('final_report', {}),
        'created_at': script.created_at.isoformat() if script.created_at else '',
        'updated_at': script.updated_at.isoformat() if script.updated_at else ''
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)  # 改为5001端口避免冲突