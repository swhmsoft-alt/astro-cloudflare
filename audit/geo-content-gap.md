# GEO Content Gap  按实体/关系/决策维度，非关键词维度

## 1. Entity Gap（网站根本没有覆盖的实体）

| Entity | 现状 | 判断 |
|---|---|---|
| Equipment（机床/设备） | 首页列为六大入口之一，但无集合/内容/路由 | **ENTITY_GAP（GHOST）** |
| Supplier / Manufacturing Capability | 无任何供应商资质/产能/设备权威页面 | **ENTITY_GAP** |
| Procurement Decision 实体 | procurement(25) 有内容但无 URL | 关系/接线缺口（见下） |

## 2. Relationship Gap（实体已存在，但重要关系缺失/不可达）

> 关系已编码于 frontmatter（如 grade-5  cnc-machining  standards），但因为 evidence/procurement/cases 未渲染，这些关系没有可点击落点。

| 关系 | 状态 | 类型 |
|---|---|---|
| Ti-6Al-4V  CNC Machining / ASTM / Heat Treatment / DFM | frontmatter 有，但 evidence/DFM 页不可见 | RELATIONSHIP_GAP |
| Material  Procurement/RFQ | procurement 不可见 + 无 RFQ | RELATIONSHIP_GAP |
| Material  Case (制造证据) | cases 不可见 | RELATIONSHIP_GAP |
| Evidence  Standard/Process | evidence 不可见 | RELATIONSHIP_GAP |
| Entity  Equipment | equipment 不存在 | RELATIONSHIP_GAP |

## 3. Decision Gap

见 decision-gap.md。核心：KnowledgeDecision 强，Tolerance/Inspection/Procurement/RFQ 断裂。

## 4. 优先级建议

| 优先级 | 动作 | 类型 |
|---|---|---|
| P0 | 给 evidence/procurement/cases/applications 接线（路由 + hub + 渲染器） | 关系/接线 |
| P0 | 收敛或关闭 13 个无内容语言的 hreflang/路由 | i18n |
| P0 | 处理 equipment：补内容 或 从导航移除 | Entity |
| P1 | 恢复/重建 RFQ 漏斗（request-quote / upload-drawing） | Decision/Commercial |
| P1 | 建 Supplier/制造能力实体页（衔接 cases + 资质） | Entity |
| P2 | 加深薄内容（cases 平均 37 词）或合并 | Content |
| DO NOT | 新增 Knowledge 文章/FAQ/关键词变体/空壳多语言 | 见 do-not-create.md |
