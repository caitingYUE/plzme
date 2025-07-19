# PlzMe 小程序与后台数据打通技术方案

## 1. 现状分析

### 小程序端（plzme_v2）
- 剧本数据全部本地静态存储（JS/MD文件），通过 ScriptManager 管理。
- 页面（如剧本列表、详情）均从本地获取剧本数据，未对接后端API。
- 已有全局 apiURL 配置，但剧本相关功能未实际调用后端API。

### 后台（Scripts_Creator）
- Flask + SQLAlchemy，SQLite 存储。
- 剧本数据通过 Script 模型管理，支持Web管理和部分API访问。
- `/api/scripts/<id>` 已支持单剧本JSON接口，缺少剧本列表JSON接口。

---

## 2. 目标与原则

- 实现后台剧本数据同步到小程序端，支持动态拉取和展示。
- 保持两端数据结构兼容，便于后续扩展。
- 优先保证数据安全、接口稳定、易于维护。

---

## 3. 后端API设计与改造

### 3.1 剧本列表接口
- **接口路径**：`GET /api/scripts`
- **功能**：返回所有剧本的简要信息，支持分页、筛选（可选）。
- **返回格式**：JSON，字段包括 id、title、tag、image_url、created_at、updated_at 等。
- **示例返回**：
```json
{
  "list": [
    {
      "id": 1,
      "title": "剧本标题",
      "tag": "情感治愈",
      "image_url": "http://.../uploads/xxx.jpg",
      "created_at": "2024-06-18T12:00:00Z"
    }
  ],
  "total": 100
}
```

### 3.2 剧本详情接口
- **接口路径**：`GET /api/scripts/<id>`
- **功能**：返回单个剧本的完整信息，包含AI生成内容、图片等。
- **返回格式**：JSON，字段需与小程序端适配。

### 3.3 图片访问
- **接口路径**：`/uploads/<filename>`
- **说明**：返回剧本封面等图片，需保证公网可访问。

### 3.4 兼容性与扩展
- 字段命名、数据类型需与小程序端适配。
- 可预留扩展字段（如 description、tags、emotions、benefits 等）。

---

## 4. 小程序端数据获取与适配

### 4.1 ScriptManager 改造
- 增加 API 拉取剧本列表、详情的方法（如 fetchAllScriptsFromAPI、fetchScriptDetailFromAPI）。
- 支持本地缓存，API失败时可降级为本地数据。
- 适配后端返回字段，转换为小程序端所需格式。

### 4.2 页面逻辑调整
- 剧本列表、详情页优先通过 API 获取数据。
- 处理图片URL、标签、角色等字段的映射。
- 兼容本地自定义剧本与后端剧本的混合展示。

---

## 5. 数据结构映射与兼容性

| 后端字段         | 小程序端字段         | 说明                     |
|------------------|----------------------|--------------------------|
| id               | id                   | 剧本唯一标识             |
| title            | title                | 标题                     |
| tag              | tags                 | 标签，需转为数组         |
| image_url        | coverImage           | 封面图片URL              |
| content          | description          | 简要描述                 |
| roles_json       | mainCharacters/roles | 角色信息，需解析         |
| result_json      | scenes/scripts等      | AI生成内容，需解析       |
| created_at       | createTime           | 创建时间                 |
| updated_at       | updateTime           | 更新时间                 |

- 需在 ScriptManager 中做字段转换和兼容性处理。
- 对于AI生成的结构（如 result_json），需解析为小程序端可用的结构体。

---

## 6. 安全与部署建议

- 后端API需支持CORS，保证小程序端可跨域访问。
- 图片资源需保证公网可访问，或配置反向代理。
- 建议对API增加鉴权（如Token），防止数据泄露。
- 部署时注意接口稳定性和高可用。

---

## 7. 里程碑与分工建议

1. 后端API补全与测试（负责人：后端开发）
2. 小程序端 ScriptManager 及页面适配（负责人：小程序开发）
3. 联调与兼容性测试（前后端协作）
4. 上线前安全与性能检查

---

如有补充需求或特殊场景，请在本方案基础上补充说明。 