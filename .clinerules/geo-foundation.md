# GEO Foundation Blueprint

> 版本：v1.0.0 | 技术基座：Astro (SSG/SSR) | 核心战略：GEO (生成引擎优化)
> 来源：基于本仓库从传统 SEO 向 GEO 的实践沉淀（Evidence Citation Model / Material Evidence Cluster / Relationship Engineering）。
> 本规范优先级高于普通页面/内容约定，作为 Astro 中新增页面、内容、组件时的 GEO 硬约束。

## 一、GEO 战略方向 (GEO Vision)

- **核心目标**：在传统 SEO 完善的基础上，让全站内容在生成式 AI 搜索（Perplexity / Gemini / ChatGPT 等）中被识别为高可信度"物证集群（Material Evidence Cluster）"。
- **实体定位**：titanium.blog 向 AI 宣告的核心实体是  **独立的 Titanium Engineering Knowledge Hub**，以"Material (Grade)  Evidence (Citation Asset)  Standard  Decision  Process"为骨架的知识实体与证明集群。
- **验证状态**：所有发布内容必须达到 `VALIDATED（内容/关系层）` 标准；具备 citation-ready（可引用）。HTML/Indexation 层由 CI Render Gate 验证。

## 二、架构推导思路 (Astro GEO Mindset)

- **语义优先于视觉**：Astro 架构必须服务"AI 语义网"。任何前端交互（Island 孤岛、水合组件）不得破坏底层 HTML 的语义完整性；**核心实体/证据语义必须在 SSG/SSR 阶段直出为静态 HTML**，不得由客户端异步获取后才生成。
- **关系显式化 (Explicit Relationships)**：在内容层（Markdown/MDX frontmatter）与组件层，必须显式声明实体间关系（relatedMaterials / relatedProcesses / relatedStandards / relatedDecisions），把结构化图谱"喂"给 AI，而非让它自行推断。
- **内容纯净度原则**：减少多余 DOM 嵌套，保持 Astro 渲染 HTML 骨架清晰（Quick Answer  dataPoints  Source  Evidence Basis  Engineering Interpretation  Related），利于 LLM 爬虫解析（LLM-friendly Parsing）。

## 三、研发与内容方法论 (GEO Methodology for Astro)

### 3.1 内容集合定义 (Content Collections)
- 必须在 `src/content/config.ts` 用 **zod 严格校验 GEO 元数据字段**，例如 evidence 类集合至少含：
  - `source` / `sourceUrl`（来源 + 可解析 URL）
  - `sourceAuthority`（HIGH / MEDIUM / LOW）
  - `claimSupport`（SUPPORTED / PARTIALLY_SUPPORTED / NOT_SUPPORTED / UNVERIFIED）
  - `claimScope`（GENERAL_PROPERTY / STANDARD_REQUIREMENT / TYPICAL_VALUE / MANUFACTURER_RECOMMENDATION / ENGINEERING_INTERPRETATION / FIRST_PARTY_CAPABILITY）
  - `dataPoints: {metric, value, unit, notes/condition}[]`
  - `relatedEntities` / `relatedMaterials` / `relatedProcesses` / `relatedStandards` / `relatedDecisions`

### 3.2 结构化数据注入 (JSON-LD)
- 构建通用 Astro 基础组件 `<GeoSchema />` / 复用 `JsonLd`，按页面内容自动生成 Schema.org（DefinedTerm、FAQPage、BreadcrumbList、CollectionPage、ItemList 等）并注入 `<head>`。
- 不为追求数量堆砌 schema；schema 必须真实表达页面实体与关系。

### 3.3 AI 锚点 (Anchor) 设计
- 核心结论 / 关系定义用符合 AI 抓取习惯的语义标签包裹（`<strong>`、`<dfn>`、`<article>`）。
- 页面顶部放 **Direct Answer / Quick Answer**；关键数据用表格（dataPoints）。
- 权威事实与站点解释分离：`Engineering Interpretation` 必须显式标注 `(titanium.blog)`，不得把站点工程判断伪装成第三方来源结论。

## 四、全局规范 (Global Guardrails & Constraints)

1. **[约束1] 严禁动态"黑盒"内容**：禁止把核心 GEO 文本放在仅客户端 API 异步获取的组件中；所有知识点必须在 Astro 编译期（SSG）或服务端（SSR）直出为静态 HTML。
2. **[约束2] 引用与交叉验证规范**：页面任何核心断言必须底部附带 `## Evidence Basis`（Based on [source]），并列出可被 AI 交叉验证的权威来源；
   - 来源 URL 无法可靠验证时 **KEEP THE GAP**（不编造、不猜、不用聚合站）。
   - `claimSupport` 必须独立判断，**不得因来源权威就默认 SUPPORTED**（权威来源  支撑该具体数值）。
3. **[约束3] Cline 协作规则**：Cline 编写任何 Astro 组件、页面或 MDX 前，必须先自检"该变更是否符合 GEO 语义层的 VALIDATED 标准"（claim/interpretation 分离、claimScope、来源完整性、关系显式）。
4. **[约束4] 关系 > 链接数量 (Relationship > Link Count)**：只建立能回答"为什么这两个实体在工程知识上存在关系"的边；不做机械性/全站批量内链；无目标时不制造薄页（No target = no edge）。
5. **[约束5] 项目隔离**：titanium.blog 为独立知识项目，不与任何其它品牌/组织/供应商实体建立实体、Schema、知识图谱关联（见 `system/globals/project-isolation.md`）。
