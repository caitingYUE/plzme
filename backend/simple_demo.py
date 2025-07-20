# PlzMe 简化版后端生成示例
# 这是一个简化版的剧本生成示例

def generate_simple_script_demo(user_content):
    """
    简化版剧本生成示例
    只生成基本信息，不包含复杂互动逻辑
    """
    return {
        "title": "根据内容生成的剧本标题",
        "tags": "相关标签,用逗号分隔",
        "roles": [
            {
                "name": "角色名称",
                "gender": "性别",
                "description": "角色描述"
            }
        ],
        "optimized_content": "优化后的剧本内容，300字以内",
        "image_prompt": "英文图片提示词"
    }

# 使用示例
if __name__ == "__main__":
    content = "用户输入的原始故事内容"
    result = generate_simple_script_demo(content)
    print("简化版剧本生成结果:", result)
