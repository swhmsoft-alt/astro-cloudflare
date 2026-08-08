# P0-B Indexation Projection

> 只读计算（不生成 sitemap / 不改 canonical / robots）。

## 1. 当前生成 URL 数（evidence/procurement/applications 逻辑口径）

| 模块 | en-root (INDEX 候选) | /en/ 前缀 (重复) | 15 个非 en hub (空壳) | 非 en detail |
|---|---|---|---|---|
| evidence | 31 (hub + 30) | 31 (hub + 30) | 15 | 0（不存在） |
| procurement | 26 (hub + 25) | 26 | 15 | 0 |
| applications | 5 (hub + 4) | 5 | 15 | 0 |
| 合计 | 62 | 62 | 45 | 0 |

## 2. 若现在生成 sitemap，Google 理论上看到多少新 URL？

- 若 @astrojs/sitemap 正常生成，理论上包含所有已生成路由：约 62 (en) + 62 (/en/) + 45 (空壳 hub) = **约 169 个 URL**（evidence/procurement/applications 相关）。
- 其中 **62 个是有效 en 内容，62 个是与 en 完全重复的 /en/ 前缀，45 个是空壳 hub**。

## 3. 推荐实际提交多少？

- **推荐 62 个（仅 en-root）**：30+25+4 detail + 3 hub。
- /en/ 前缀 62 个：**不提交 / noindex / canonical 到 root**（完全重复，纯浪费）。
- 空壳 hub 45 个：**不提交 / noindex**（无内容）。
- 结论：实际可索引价值  62 个 URL；其余 107 个是重复或空壳。

## 4. 现有 sitemap 现状

- `astro.config.ts` 未设顶层 `site`，@astrojs/sitemap 未产出任何 sitemap（既有阻塞项，P0-B 不修改）。
