---
description: 适用于 Astro 框架的项目开发规范，减少无效代码生成
globs: src/**/*.{astro,ts,js}, astro.config.mjs
---

# Astro 开发与 Token 优化规范

## 1. 语法与组件规范
- **Astro 组件结构**：严格遵守 Frontmatter (---) 与 HTML 模板的分离原则。
- **客户端 JS**：必须在 `<script>` 标签内编写。除非必要，严禁在 HTML 元素上使用 `onClick={...}` 这种 React 语法。
- **孤岛架构 (Islands)**：
  - 默认情况下所有组件均为静态。
  - 仅在需要交互时使用 `client:load`、`client:visible` 或 `client:only`。不要滥用客户端指令。

## 2. 路由与数据获取
- **内容集合 (Content Collections)**：优先使用 `getCollection()` 获取数据，严禁手动用 `fs` 模块去读取 `src/content/` 目录。
- **API 路由**：在 `src/pages/` 中编写端点时，导出 `GET`、`POST` 等明确的方法函数。

## 3. 防浪费执行检查
- **修改配置**：在修改 `astro.config.mjs` 前，先检查现有的集成（Integrations），不要重复安装或引入已有的 Tailwind/Sitemap 等插件。
- **类型安全**：确保所有组件属性（Props）都有 TypeScript 接口（Interface Props）定义，防止运行时错误引发反复调试。
