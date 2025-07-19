import os
from ai_script_generator import DEEPSEEK_API_KEY, DEEPSEEK_API_URL
import requests

def generate_image_prompt(story_content):
    """
    根据故事内容生成适合AIGC文生图的prompt，要求中文、简洁、20-50字
    """
    try:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
        }
        
        system_prompt = (
            "你是专业的AIGC文生图提示词专家。请根据用户输入的故事内容，提炼出最具画面感的场景，用简洁、具体、具象的中文描述生成一条图片prompt，20-50字，不要解释，不要加引号，不要输出多条。"
        )
        story_prompt = f"故事内容：{story_content}\n请直接输出图片描述。"

        payload = {
            "model": "deepseek-chat",
            "temperature": 0.6,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": story_prompt}
            ]
        }

        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        return response.json()['choices'][0]['message']['content'].strip()
    except Exception as e:
        return f"图片描述生成失败：{str(e)}" 