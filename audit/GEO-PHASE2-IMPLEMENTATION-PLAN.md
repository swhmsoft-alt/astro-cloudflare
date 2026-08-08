# GEO Phase 2 Implementation Plan - titanium.blog

> 性质：设计文档（不改代码 / 不建页面 / 不写内容 / 不翻译 / 不 refactor）。
> 目标：基于 GEO Master Audit 的真实资产，设计把 evidence/procurement/cases/applications/comparisons/decision/tolerance/inspection/RFQ/i18n 恢复成可公开、可索引、可引用、可形成 Entity Graph 的生产架构。
> 依据：scan.mjs 扫描 188 内容文件 + src/pages 路由消费关系 + 直读关键文件。

---

# 第一部分：逐模块现状

> Status: LIVE=已渲染可访问; SCAFFOLD=有内容有schema但无URL; PARTIAL=部分; MISSING=不存在。

## 1. evidence (30 files)
```text
Collection: evidence
Content Files: 30 (src/content/derived/evidence/*)
Existing Schema: YES (content.config: evidenceCategory, source, sourceUrl, dataPoints[{property,value,unit,notes}], faqs, relatedMaterials/Processes/Standards)
Existing Renderer: NONE
Existing Components: NONE
Existing Route: NONE
Existing URL Pattern: NONE
Existing Internal Links: frontmatter relation only (无落点)
Existing Sitemap Logic: NO (无路由)
Status: SCAFFOLD
```

## 2. procurement (25 files)
```text
Collection: procurement
Content Files: 25
Existing Schema: YES (procurementCategory, audience, quickAnswer, checklist[], typicalValues[{label,value,notes}], relatedServices[], relatedStandards[], faqs)
Existing Renderer: NONE
Existing Components: NONE
Existing Route: NONE
Existing URL Pattern: NONE
Existing Internal Links: relation only
Existing Sitemap Logic: NO
Status: SCAFFOLD (内容平均 17 词，偏薄，需 renderer 撑结构)
```

## 3. cases (15 files)
```text
Collection: cases
Content Files: 15
Existing Schema: YES (industry, application, material, processes, equipment, surfaceFinish, standards, quantity, tolerance, leadTime, challenge, solution, result, keyMetrics[{label,before,after,unit}], lessonsLearned, relatedEntities/Services/Materials/Standards/Evidence/Comparisons)
Existing Renderer: NONE
Existing Route: NONE
Status: SCAFFOLD (平均 37 词，偏薄)
```

## 4. applications (4 files)
```text
Collection: applications
Content Files: 4 (aerospace-structural, industrial-components, medical-implants, semiconductor-vacuum)
Existing Schema: YES (industry, image, order)
Existing Renderer: NONE
Existing Route: NONE
Status: SCAFFOLD
```

## 5. comparisons (16 files)
```text
Collection: comparisons
Content Files: 16
Existing Schema: YES (comparisonType, entityA/B, quickAnswer, entityALink/BLink, relatedX, faqs)
Existing Renderer: compare/[slug].astro + compare.astro
Existing Components: MarketingLayout, JsonLd, buildTechArticle/buildFAQ/buildBreadcrumb
Existing Route: /compare/ + /compare/[slug]/
Existing URL Pattern: /compare/<slug>/
Existing Internal Links: entityALink/BLink + relatedX (部分指向 /knowledge/standards/ 死链)
Existing Sitemap Logic: auto (astro sitemap)
Status: LIVE (含内嵌 FAQ + 决策框架，GEO 强项)
```

## 6. decision layer
```text
Status: PARTIAL
组成: comparisons(LIVE) + material-selection(/select/ LIVE) + guides/dfm(LIVE) + procurement(SCAFFOLD)
决策链前段强，后段(公差/检验/采购/RFQ)断裂
```

## 7. tolerance
```text
Status: PARTIAL
现状: processes 的 tolerances 字段 + evidence(machining-tolerances, 5-axis-tolerances) SCAFFOLD
无独立可链接实体页
```

## 8. inspection
```text
Status: PARTIAL/MISSING
现状: procurement(cmm-inspection, fai-guide, inspection-report-guide) SCAFFOLD；无独立页
```

## 9. RFQ
```text
Status: MISSING
现状: 无 collection / 无 route / 无 content。历史 build 日志曾有 /rfq/request-quote、/rfq/upload-drawing，源码已无
```

## 10. i18n
```text
Status: 16 语言路由生成，仅 en 完整，de/es 页面级部分，其余 13 语言空壳
配置分叉：site-config.ts(titanium.blog) vs lib/site-config.ts(starter 占位域名)
llms.txt 引用 /knowledge/* 死链（真实路由为扁平 URL）
```

---

# 第二部分：Route Architecture Design

> 原则：遵循站内既有扁平顶级 URL约定（/grades/ /compare/ /guides/），不引入 /knowledge/ 前缀（llms.txt 的 /knowledge/* 是死链，不作为依据）。

## 2.1 evidence
```text
URL:  /evidence/  (hub)  |  /evidence/<slug>/  (detail)
Parent: Home
Page Type: Hub = CollectionPage+ItemList; Detail = DefinedTerm+Dataset+FAQ
Primary Entity: Evidence data point / material property set
Breadcrumb: Home > Evidence > <title>
Canonical: https://titanium.blog/evidence/<slug>/
Sitemap: auto (route 存在即入 sitemap)
Internal Link Sources: materials/processes/standards 页的 relatedEvidence 引用
Internal Link Targets: 同级 evidence 互链、relatedMaterials/Processes/Standards、对应 material 页
Schema: DefinedTerm + Dataset(material-properties) + FAQPage; 或 Schema.org Dataset/Table
```

## 2.2 procurement
```text
URL:  /procurement/  (hub)  |  /procurement/<slug>/  (detail)
Parent: Home
Page Type: Detail = TechArticle/HowTo + FAQ; Hub = CollectionPage+ItemList
Primary Entity: Procurement concept (RFQ checklist, certification, lead-time, inspection)
Breadcrumb: Home > Procurement > <title>
Canonical: https://titanium.blog/procurement/<slug>/
Internal Link Sources: comparisons/decision 页 -> procurement (leads_to); standards -> procurement
Internal Link Targets: relatedStandards, relatedServices, 同级 procurement
Schema: HowTo(checklist) 或 TechArticle + FAQPage + BreadcrumbList
```

## 2.3 cases
```text
URL:  /cases/  (hub)  |  /cases/<slug>/  (detail)
Parent: Home
Page Type: Detail = Article/TechArticle + defined metrics; Hub = CollectionPage+ItemList
Primary Entity: Manufacturing case / capability evidence
Breadcrumb: Home > Cases > <title>
Canonical: https://titanium.blog/cases/<slug>/
Internal Link Sources: industries/processes/materials -> cases; evidence -> cases
Internal Link Targets: relatedMaterials/Processes/Standards/Evidence/Comparisons, relatedServices
Schema: Article + defined metrics (可扩展 ItemList/DefinedTerm)
```

## 2.4 applications
```text
URL:  /applications/  (hub)  |  /applications/<slug>/  (detail)
Parent: Home (或 Industry hub)
Page Type: Detail = DefinedTerm; Hub = CollectionPage+ItemList
Primary Entity: Application (aerospace-structural 等)
Breadcrumb: Home > Applications > <title>
Canonical: https://titanium.blog/applications/<slug>/
Internal Link Sources: industries -> applications; materials -> applications
Internal Link Targets: related industry, materials
Schema: DefinedTerm + Organization context
```

## 2.5 comparisons（保持现状，修死链）
```text
URL:  /compare/ + /compare/<slug>/  (不变)
Internal Link 修正: compare/[slug] footer 的 relatedStandards 链接由 /knowledge/standards/ 改为 /standards/
```

## 2.6 decision layer
```text
URL: 保持 /select/, /compare/, /guides/ 不变；procurement 接线后作为 decision 的落点
decision 页本身不新建（现有 comparisons/material-selection 已覆盖），以链路打通代替新页面
```

## 2.7 tolerance / inspection
```text
建议: 不新建独立实体页，改为在 evidence(/evidence/tolerances) 与 procurement(/procurement/cmm-inspection) 接线时，把 tolerance/inspection 作为可链接实体(anchor) 暴露，并被 material/process 页 related 引用
理由: 避免制造更多薄页；先让现有 evidence/procurement 承载这两个实体
```

## 2.8 RFQ
```text
URL(后续):  /rfq/request-quote/ , /rfq/upload-drawing/  (商业层, 决策后实施)
Parent: Home / Contact
Page Type: 表单 + Service schema
Status: MISSING -> 列入 P1
```

---

# 第三部分：Renderer Strategy（最小复杂度 + 最大一致性）

| 模块 | Hub | Detail | 复用/新建 |
|---|---|---|---|
| evidence | 复用 _EntityPillar | 扩展 _EntityDetail 或新建 EvidenceDetail | 复用 shell + 新增 dataPoints/source 渲染 |
| procurement | 复用 _EntityPillar | 新建 ProcurementDetail | 新 renderer（结构差异大） |
| cases | 复用 _EntityPillar | 新建 CaseStudyDetail | 新 renderer（metrics/challenge/solution） |
| applications | 复用 _EntityPillar | 复用 _EntityDetail | 直接复用 |
| comparisons | 复用 compare.astro | 复用 compare/[slug].astro | 保持 |

要点：
- 共享：MarketingLayout, JsonLd, buildDefinedTerm/buildTechArticle/buildFAQ/buildCollectionPage/buildItemList, RelatedContent（需扩展支持 evidence/procurement/cases relation）。
- 不重复：不新建每模块专属 card 组件，统一用 entity-card；不复制 schema 构建函数。
- _EntityPillar 扩展点：Props 的 collectionName union + collectionLabels（加 evidence/procurement/cases/applications）+ i18n key。
- _EntityDetail 扩展点：加 dataPoints 表、source/sourceUrl、relatedProcesses/relatedStandards/relatedEvidence 区块（现有已渲染 relatedMaterials/Standards/Industries）。
- 新 renderer 只做结构渲染，所有样式/布局复用现有 token 与 layout。

---

# 第四部分：Entity Graph Design

详见 `docs/geo-phase2-entity-graph.md`（本仓新增）。
核心主线：Material -> Process -> Evidence -> Decision -> Procurement -> Service -> RFQ，支线 Industry/Application/Standard/Tolerance/Inspection/Certification。接线后 frontmatter relation 自动产出约 659 条潜在内链。

---

# 第五部分：Internal Link Blueprint（Top 50 高价值语义链接）

> 格式：source -> target | anchor | relationship | reason | priority
> 目标：Entity->Evidence, Evidence->Entity, Entity->Comparison, Comparison->Decision, Decision->Procurement, Procurement->Service, Service->RFQ, RFQ->Technical Knowledge。

### Entity -> Evidence
1. /grades/grade-5-titanium/ -> /evidence/ti-6al-4v-material-properties/ | Mechanical properties | supported_by | 材料页需证据支撑 | P0
2. /grades/grade-5-titanium/ -> /evidence/grade-5-milling-parameters/ | Cutting parameters | supported_by | 加工证据 | P0
3. /grades/grade-23-titanium/ -> /evidence/grade-23-material-properties/ | ELI properties | supported_by | P0
4. /grades/grade-2-titanium/ -> /evidence/grade-2-properties/ | properties | supported_by | P1
5. /grades/grade-9-titanium/ -> /evidence/grade-9-properties/ | properties | supported_by | P1
6. /processes/5-axis-machining/ -> /evidence/5-axis-tolerances/ | tolerance capability | supported_by | P0
7. /processes/cnc-machining/ -> /evidence/machining-tolerances/ | tolerances | supported_by | P0
8. /processes/cnc-turning/ -> /evidence/cnc-turning-parameters/ | parameters | supported_by | P1
9. /processes/wire-edm/ -> /evidence/wire-edm-parameters/ | parameters | supported_by | P1
10. /processes/dmls/ -> /evidence/dmls-parameters/ | parameters | supported_by | P1
11. /finishes/titanium-anodizing/ -> /evidence/titanium-anodizing-properties/ | finish properties | supported_by | P1
12. /finishes/bead-blasting/ -> /evidence/bead-blasting-surface-roughness/ | roughness | supported_by | P1
13. /standards/astm-b265/ -> /evidence/ti-6al-4v-material-properties/ | spec basis | specified_by | P1

### Evidence -> Entity
14. /evidence/ti-6al-4v-material-properties/ -> /grades/grade-5-titanium/ | Grade 5 | supports | P0
15. /evidence/ti-6al-4v-material-properties/ -> /standards/astm-b265/ | ASTM B265 | specified_by | P0
16. /evidence/grade-5-milling-parameters/ -> /processes/cnc-milling/ | Milling | supports | P0
17. /evidence/machining-tolerances/ -> /processes/cnc-machining/ | Tolerances | supports | P1
18. /evidence/titanium-welding-data/ -> /processes/titanium-welding/ | Welding | supports | P1
19. /evidence/titanium-fatigue-data/ -> /grades/grade-5-titanium/ | Fatigue | supports | P1

### Entity -> Comparison
20. /grades/grade-5-titanium/ -> /compare/grade-5-vs-grade-23/ | vs Grade 23 | compared_with | P0
21. /grades/grade-5-titanium/ -> /compare/grade-5-vs-stainless-304/ | vs 304 | compared_with | P1
22. /grades/grade-2-titanium/ -> /compare/grade-2-vs-grade-5/ | vs Grade 5 | compared_with | P1
23. /grades/grade-9-titanium/ -> /compare/grade-9-vs-grade-5/ | vs Grade 5 | compared_with | P1
24. /processes/5-axis-machining/ -> /compare/5-axis-vs-3-axis-machining/ | vs 3-axis | compared_with | P0
25. /finishes/titanium-anodizing/ -> /compare/anodizing-vs-passivation/ | vs passivation | compared_with | P1
26. /materials grade-selection -> /compare/cp-titanium-vs-alloy-titanium/ | CP vs alloy | compared_with | P2

### Comparison -> Decision
27. /compare/grade-5-vs-grade-23/ -> /select/grade-selection-guide/ | Which grade | informed_by | P0
28. /compare/grade-2-vs-grade-5/ -> /select/grade-selection-guide/ | Selection | informed_by | P1
29. /compare/5-axis-vs-3-axis-machining/ -> /guides/dfm-titanium-guide/ | Process choice | informed_by | P1
30. /compare/titanium-vs-aluminum/ -> /select/titanium-vs-aluminum/ | Weight/cost | informed_by | P1 (注意与 materialSelection 重叠，差异化) |

### Decision -> Procurement
31. /select/grade-selection-guide/ -> /procurement/rfq-checklist/ | RFQ prep | leads_to | P0
32. /select/titanium-grades-chart/ -> /procurement/material-certification-guide/ | Cert | leads_to | P1
33. /guides/dfm-titanium-guide/ -> /procurement/drawing-best-practices/ | Drawing | leads_to | P0
34. /guides/dfm-titanium-guide/ -> /procurement/cad-file-requirements/ | CAD | leads_to | P1
35. /compare/grade-5-vs-grade-23/ -> /procurement/coa-vs-coc/ | Cert documents | leads_to | P2

### Procurement -> Service / RFQ
36. /procurement/rfq-checklist/ -> /procurement/how-to-submit-rfq/ | Submit RFQ | leads_to | P0
37. /procurement/how-to-submit-rfq/ -> /rfq/request-quote/ | Request quote | leads_to | P1 (RFQ 建成后)
38. /procurement/production-lead-time/ -> /rfq/upload-drawing/ | Upload drawing | leads_to | P1
39. /procurement/supplier-qualification/ -> /cases/ | capability proof | leads_to | P1
40. /procurement/material-certification-guide/ -> /standards/astm-b265/ | Spec | certified_by | P1

### RFQ -> Technical Knowledge（回流）
41. /rfq/request-quote/ -> /grades/grade-5-titanium/ | Specify material | feeds_back | P2
42. /rfq/upload-drawing/ -> /guides/dfm-titanium-guide/ | DFM best practice | feeds_back | P2

### Cross-hub backbone
43. /industries/aerospace-titanium-parts/ -> /applications/aerospace-structural/ | Application | used_for | P0
44. /industries/medical-device/ -> /applications/medical-implants/ | Application | used_for | P0
45. /industries/semiconductor-manufacturing/ -> /applications/semiconductor-vacuum/ | Application | used_for | P0
46. /cases/aerospace-bracket-case/ -> /processes/5-axis-machining/ | Capability | evidences | P1
47. /cases/medical-implant-dmls-case/ -> /processes/dmls/ | AM | evidences | P1
48. /grades/grade-5-titanium/ -> /cases/ | Grade 5 case studies | evidences | P1
49. /standards/as9100d/ -> /procurement/ppap-for-titanium-parts/ | PPAP | certified_by | P1
50. /standards/nadcap/ -> /procurement/supplier-qualification/ | Special process | certified_by | P2

---

# 第六部分：Decision Layer

```text
Problem        -> failure-analysis(/failures/) EXISTS
Requirement    -> material-selection(/select/), applications(SCAFFOLD) PARTIAL
Material       -> materials(/grades/) EXISTS
Process        -> processes(/processes/) EXISTS
DFM            -> guides/dfm-titanium-guide EXISTS
Tolerance      -> processes.tolerances + evidence(SCAFFOLD) PARTIAL
Inspection     -> procurement(cmm-inspection, fai) SCAFFOLD PARTIAL
Procurement    -> procurement(SCAFFOLD) MISSING(接线前)
Supplier       -> (无实体) MISSING
RFQ            -> (无路由) MISSING
```

> 结论：不新建 decision 页（现有 comparisons/material-selection 覆盖）。缺失的是 tolerance/inspection 的可链接落点与 procurement/supplier/rfq 链路。先接线 evidence+procurement，把 tolerance/inspection 作为实体暴露，供应商/RFQ 留 P1。

---

# 第七部分：i18n Strategy

目标：保实体/内容/索引质量，而非支持更多语言。

## 保留 / 暂停
- 保留 en（默认，完整内容，canonical 锚）。
- 保留 de/es：仅页面级有真实译文，可继续；但 knowledge 核心内容仍 en。建议核心知识先 en 为主。
- 暂停 13 个空壳语言（ja/fr/pt/it/ko/nl/pl/ru/ar/pt-br/tr/cs/sv）：不生成/不索引空壳变体。

## 处理（13 空壳语言）
- Sitemap：只包含有真实内容的 locale URL；空壳 locale 不加入 sitemap。
- hreflang：只为有内容的 locale 输出 hreflang + x-default=en；空壳 locale 不声明。
- canonical：空壳 locale 若仍生成路由，rel=canonical 指向 en 版本；或直接对空壳页 noindex。
- 最稳做法：从 SITE_CONFIG.locales / astro sitemap i18n / hreflang 中移除未启用语言，停止生成空壳路由。

## 配置分叉修复（先决条件）
- 统一 `lib/site-config.ts` SITE_CONFIG 的 url/name 为 titanium.blog（消除 canonical/路由解析域名不一致）。
- llms.txt：把 /knowledge/* 死链改为真实扁平 URL（/grades/ /processes/ 等）。

## 真正需要翻译的（P2）
- 若做多语言，优先 1~2 个高价值语言，且只翻译核心 entity 页（grades/processes/standards），非全部页面。

---

# 第八部分：Implementation Priority

## P0（必须立即做）
1. 接线 evidence/procurement/cases/applications 路由 + hub + detail renderer + i18n label
   Why: 74 文件内容从 0 可见变可见，是单一最大瓶颈
   Files: content.config(无), 新增 src/pages/{evidence,procurement,cases,applications}/index+[slug].astro, 扩展 _EntityPillar/_EntityDetail, 新增 ProcurementDetail/CaseStudyDetail, 扩展 RelatedContent, i18n/ui, schema(新增 buildDatasetSchema)
   Risk: 中（renderer 新代码，schema/校验需过 pnpm lint + check:kpis）
   GEO impact: 高（证据/决策内容进入索引，可被引用）
   SEO impact: 高（新增可索引 URL + 内链）
   Effort: M-L   Deps: 无
2. 扩展 RelatedContent 支持 evidence/procurement/cases relation，启用 backbone 内链
   Why: 让 659 条潜在关系变成真实链接
   Files: src/components/sections/RelatedContent.astro
   Risk: 低   Effort: M
3. 修正 llms.txt /knowledge/* 死链为真实 URL
   Why: 消除 AI 抓取 404；恢复 llms 覆盖
   Files: src/pages/llms.txt.ts
   Risk: 低   Effort: S
4. 统一 SITE_CONFIG 域名为 titanium.blog
   Why: canonical/路由一致性
   Files: src/lib/site-config.ts
   Risk: 低(需复核所有引用)   Effort: S
5. 收敛/关闭 13 空壳语言（sitemap+hreflang+canonical/noindex）
   Why: 消除重复内容与 crawl 浪费
   Files: astro.config sitemap i18n, src/i18n, 相关 hreflang 组件
   Risk: 中（影响多语言路由）   Effort: M

## P1（P0 后做）
6. 修 compare/[slug] 的 /knowledge/standards/ 死链为 /standards/
   Why: 消除比较页死链
   Files: src/pages/compare/[slug].astro   Effort: S
7. 建 Decision->Procurement->Service->RFQ 桥（先 procurement 接线，RFQ 路由立项）
   Why: 打通商业漏斗
   Files: 新增 /rfq/{request-quote,upload-drawing} + Service schema + procurement 相关链接
   Risk: 中   Effort: M-L
8. tolerance/inspection 作为可链接实体暴露（evidence/procurement 内 anchor）
   Why: 补齐决策链后段
   Files: evidence/procurement renderer
   Risk: 低   Effort: M
9. equipment 决策：补内容或从导航移除
   Why: 消除 GHOST 入口
   Files: 导航/registry/内容
   Risk: 低   Effort: S-M
10. 为新增模块补 sitemap/llms/rss 覆盖与 OG
   Why: 索引与 AI 可引用性
   Files: llms.txt.ts, 各 renderer
   Risk: 低   Effort: S-M

## P2（以后做）
11. 加深薄内容（cases 37 词、procurement 17 词）或合并
12. 翻译核心 entity 页到 1~2 个高价值语言
13. 供应商/制造能力实体页（衔接 cases + 资质）
14. content-overlap 差异化（materialSelection vs comparisons 同实体）

## 每项格式
> Change / Why / Files likely affected / Risk / Expected GEO impact / Expected SEO impact / Effort / Dependencies 均已在上方逐项列明。

---

# 附：校验要求（进入执行阶段后）
- 每项变更需过 `pnpm build`、`pnpm lint`（含 `check:kpis`）、`pnpm run lint:css`。
- 新增路由必须 en + [locale] 双写；但本轮为设计，不产生代码。
- 不得为通过检查而修改现有设计约定。
