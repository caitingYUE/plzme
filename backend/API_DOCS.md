# 剧本详情接口技术文档

## 接口说明

- **接口地址**：`/api/scripts/<int:script_id>`
- **请求方法**：GET
- **接口用途**：获取指定剧本的全部详细内容，供本地应用或前端"上传"功能调用。

---

## 请求参数

| 参数名      | 类型   | 必填 | 说明           |
| ----------- | ------ | ---- | -------------- |
| script_id   | int    | 是   | 剧本ID（路径参数） |

---

## 返回数据（JSON）

| 字段名            | 类型         | 说明                                   |
|-------------------|--------------|----------------------------------------|
| id                | int          | 剧本ID                                 |
| title             | string       | 剧本标题                               |
| tag               | string       | 剧本标签，逗号分隔                     |
| content           | string       | 原始内容（用户输入的故事）             |
| image_url         | string       | 剧本配图的完整可访问URL                |
| roles             | array[object]| 角色设定，数组，每项包含name/personality |
| summary           | string       | AI生成的剧本简介                       |
| scripts           | array[object]| AI分场景内容，结构见下                  |
| inner_monologue   | string       | 暗恋对象的内心独白                     |
| final_report      | object       | 选择路径分支的最终关系报告，key为路径   |
| created_at        | string       | 创建时间（ISO格式）                    |
| updated_at        | string       | 更新时间（ISO格式）                    |

---

### scripts 字段结构示例

```
[
  {
    "scene": "第一轮场景描述",
    "dialogue": [
      "角色A：对话内容",
      "角色B：对话内容"
    ],
    "choices": [
      {
        "option": "选项1描述",
        "reply": "角色对用户选择的即时回复文本",
        "result": "选择此项的剧情发展"
      },
      ...
    ]
  },
  ...
]
```

---

### final_report 字段结构示例

```
{
  "ABA": "用户依次选择A、B、A时的最终关系总结报告",
  "ACB": "用户依次选择A、C、B时的最终关系总结报告"
}
```

---

## 示例返回

```
{
  "id": 1,
  "title": "办公室里的隐秘情愫",
  "tag": "暗恋,办公室恋情,自我成长",
  "content": "原始故事内容...",
  "image_url": "http://localhost:5000/uploads/xxx.png",
  "roles": [
    {"name": "主角", "personality": "内向敏感"},
    {"name": "暗恋对象", "personality": "温柔体贴"}
  ],
  "summary": "剧本简介...",
  "scripts": [
    {
      "scene": "第一轮场景描述",
      "dialogue": ["主角：...", "暗恋对象：..."],
      "choices": [
        {"option": "主动打招呼", "reply": "暗恋对象微笑回应", "result": "关系更进一步"},
        {"option": "保持沉默", "reply": "气氛有些尴尬", "result": "错失机会"}
      ]
    }
  ],
  "inner_monologue": "我其实早就注意到了你...",
  "final_report": {
    "ABA": "你们成为了朋友。",
    "ACB": "关系更进一步。"
  },
  "created_at": "2024-06-01T12:00:00",
  "updated_at": "2024-06-01T12:30:00"
}
```

---

## 备注

- `image_url` 为完整URL，前端可直接用于 `<img src=...>`。
- `roles`、`scripts`、`final_report` 等均为结构化数据，便于应用侧直接解析和展示。
- 若某些字段无内容，则返回空字符串、空数组或空对象。 