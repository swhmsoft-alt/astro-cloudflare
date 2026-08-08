# Schema / Entity Markup Audit

> 判断 schema 是否真实表达页面实体，而不是追求数量。

## 现状：schema 库（src/lib/schema.ts）支持

WebSite, Organization, Person, BlogPosting, FAQPage, BreadcrumbList, Product, Service, DefinedTerm, DefinedTermSet, CollectionPage, ItemList, TechArticle

## 实际接线到页面

| 页面类型 | 使用的 schema | 评价 |
|---|---|---|
| 实体详情页 (grades/[slug] 等) | DefinedTerm + Product（materials/standards） | 合理，表达了实体身份 |
| Hub 页 (grades/index 等) | CollectionPage + ItemList | 合理 |
| compare/[slug] | BreadcrumbList + TechArticle + FAQPage | 合理（FAQ 是内嵌 faqs） |
| guides/[slug] | TechArticle | 可接受 |
| blog | BlogPosting | 合理 |
| 全局 | WebSite + Organization + Breadcrumb | 合理 |
| /faq/ | FAQPage | 合理 |
| **evidence/comparisons/procurement/cases 详情页** | 无 schema（因无路由） | 缺失（内容层不可见所致） |

## 结论

- schema 数量/覆盖在**已渲染页面**上是健康的，未过度。
- 真正的 schema 缺失不是缺类型，而是 **evidence/procurement/cases 根本没有页面去挂 schema**。
- 无需新增 schema 类型；需要接线来让现有内容拥有 URL + schema。

## 限制

- schema 接线判定基于直接阅读路由文件与 schema 库，未抓取渲染后 HTML 逐页验证。
