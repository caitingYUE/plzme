import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

def generate_script_from_prompt(prompt_text):
    try:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
        }
        
        payload = {
            "model": "deepseek-chat",
            "temperature": 0.3,  # 降低温度以获得更稳定的输出
            "messages": [
                {
                    "role": "system", 
                    "content": "你是一个心理剧本创作专家。请严格按照用户提供的JSON格式返回内容。注意：1. 必须返回合法的JSON字符串 2. 所有字符串必须用双引号包裹 3. 不要添加任何额外的解释或说明文字 4. 确保所有必需字段都存在且格式正确"
                },
                {"role": "user", "content": prompt_text}
            ],
            "response_format": {"type": "json_object"}  # 强制要求返回JSON格式
        }

        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        result = response.json()['choices'][0]['message']['content'].strip()
        
        # 预处理：移除可能的前后缀非JSON内容
        result = result.strip()
        if result.startswith('```json'):
            result = result[7:]
        if result.startswith('```'):
            result = result[3:]
        if result.endswith('```'):
            result = result[:-3]
        result = result.strip()
        
        # 验证返回的内容是否为有效的JSON
        try:
            json_result = json.loads(result)
            # 确保所有必需字段都存在
            required_fields = ['title', 'summary', 'tags', 'roles', 'scripts', 'inner_monologue', 'final_report']
            missing_fields = [field for field in required_fields if field not in json_result]
            if missing_fields:
                raise ValueError(f"缺少必需字段: {', '.join(missing_fields)}")
                
            # 验证scripts数组的结构
            if not isinstance(json_result['scripts'], list):
                raise ValueError("scripts必须是数组类型")
            for scene in json_result['scripts']:
                if not isinstance(scene, dict):
                    raise ValueError("每个场景必须是对象类型")
                required_scene_fields = ['scene', 'dialogue', 'choices']
                missing_scene_fields = [field for field in required_scene_fields if field not in scene]
                if missing_scene_fields:
                    raise ValueError(f"场景缺少必需字段: {', '.join(missing_scene_fields)}")
                if not isinstance(scene['choices'], list):
                    raise ValueError("choices必须是数组类型")
                for choice in scene['choices']:
                    if not isinstance(choice, dict):
                        raise ValueError("每个选项必须是对象类型")
                    if 'option' not in choice or 'result' not in choice or 'reply' not in choice:
                        raise ValueError("选项必须包含option、reply和result字段")
            # 校验final_report为对象类型
            if not isinstance(json_result['final_report'], dict):
                raise ValueError("final_report必须为对象类型，key为选择路径，value为总结报告")
            # 确保返回的是格式化的JSON字符串
            return json.dumps(json_result, ensure_ascii=False, indent=2)
        except json.JSONDecodeError as e:
            raise ValueError(f"AI返回的内容不是有效的JSON格式: {str(e)}")
        except Exception as e:
            raise ValueError(f"JSON验证失败: {str(e)}")
            
    except requests.exceptions.RequestException as e:
        raise ValueError(f"API请求失败: {str(e)}")
    except Exception as e:
        raise ValueError(f"生成剧本失败: {str(e)}")