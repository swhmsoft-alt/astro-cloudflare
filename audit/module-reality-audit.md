# Module Reality Audit  titanium.blog

> 机器级取证：判定每个模块/集合在当前代码库中的真实状态（是否声明、有内容、有渲染器、有路由、有链接、可被索引）。
> 数据来源：`scripts/geo-audit/scan.mjs`（遍历 src/content + src/pages），覆盖 188 个内容文件、17 个集合。

## 1. 核心结论（回答你关心的 A/B/C/D 问题）

**结论：Evidence / Procurement / Cases 属于状态 B只有 schema + 内容，但没有页面/路由/渲染器的 SCAFFOLD 模块。** 不是 A（已迁移）、不是 C（被删除）、也不是 D（collection 未声明）。

- 内容存在：`src/content/derived/{evidence(30), procurement(25), cases(15)}`
- collection 已声明：`content.config.ts` 的 `evidence/comparisons/procurement/guides/cases` loader 指向 `derived/*`
- **但没有任何页面渲染它们**：全 `src/pages/**` 中没有 `getCollection("evidence")` / `getCollection("procurement")` / `getCollection("cases")`
- 因此：没有路由、没有生成 URL、没有 sitemap 条目、没有被爬取/索引、无法被 AI 引用。

> 这是当前最大的内容资产浪费：**最高信息增益的内容（evidence 平均 IG=80 分）恰好是 0% 可被访问的内容。**

## 2. 逐模块状态表

| Module/Collection | Declared | Content | Renderer | Route | Linked? | Indexed Candidate | Status |
|---|---|---|---|---|---|---|---|
| materials (/grades/) | YES | 14 | _EntityDetail | YES | YES | YES | LIVE |
| processes (/processes/) | YES | 15 | _EntityDetail | YES | YES | YES | LIVE |
| industries (/industries/) | YES | 8 | _EntityDetail | YES | YES | YES | LIVE |
| standards (/standards/) | YES | 12 | _EntityDetail | YES | YES | YES | LIVE |
| surfaceFinishes (/finishes/) | YES | 7 | _EntityDetail | YES | YES | YES | LIVE |
| materialSelection (/select/) | YES | 8 | _EntityDetail | YES | YES | YES | LIVE |
| failureAnalysis (/failures/) | YES | 6 | _EntityDetail | YES | YES | YES | LIVE |
| heatTreatment (/heat-treatment/) | YES | 6 | _EntityDetail | YES | YES | YES | LIVE |
| corrosion (/corrosion/) | YES | 6 | _EntityDetail | YES | YES | YES | LIVE |
| comparisons (/compare/) | YES | 16 | compare/[slug] | YES | YES | YES | LIVE |
| guides (/guides/) | YES | 11 | guides/[slug] | YES | YES | YES | LIVE |
| faqs (/faq/) | YES | 2 | faq.astro | YES | YES | YES | LIVE |
| blog (/blog/) | YES | 3 | [locale]/blog | YES | YES | YES | LIVE |
| pages (solutions/legal) | YES | ~40 | solutions/[slug] | YES | YES | YES | LIVE |
| settings | YES | 1 | config | n/a | n/a | n/a | LIVE |
| docs (/docs/) | YES | 10 | starlight | YES | YES | YES | LIVE |
| **evidence (/evidence/)** | YES | **30** | **NO** | **NO** | **NO** | **NO** | **SCAFFOLD** |
| **procurement (/procurement/)** | YES | **25** | **NO** | **NO** | **NO** | **NO** | **SCAFFOLD** |
| **cases (/cases/)** | YES | **15** | **NO** | **NO** | **NO** | **NO** | **SCAFFOLD** |
| **applications (/applications/)** | YES | **4** | **NO** | **NO** | **NO** | **NO** | **SCAFFOLD** |
| **equipment** | **NO collection** | **0** | 仅 schema 引用 | **NO** | nav 宣称 | NO | **GHOST/UNKNOWN** |

## 3. 深挖：equipment  被宣称但不存在

- 首页把Equipment列为六大知识入口之一（与你给的定位一致）。
- `_EntityDetail.astro` 的 Props 类型与 `buildProductSchema` 都处理 `equipment` 集合。
- 但 `content.config.ts` 的 `collections` 导出里**没有 `equipment`**；`src/content` 下也无 equipment 目录。
- 结论：**Equipment 是 GHOST 入口导航/ schema 承诺了它，但内容层完全不存在。**

## 4. 深挖：RFQ / 商业层

- 仓库根目录历史 build 日志（`out.txt`）显示曾生成 `/rfq/request-quote`、`/rfq/upload-drawing`（全 16 locale）。
- **但当前 `src/pages/**` 中没有任何 rfq 路由文件，`src/content` 中也没有 rfq 内容。**
- 结论：RFQ 层在代码库中**当前不存在**（或已被移除/尚未重建）。procurement 内容里大量引用RFQ/quote/lead-time概念，但没有落地页面。这是 KnowledgeCommercial 漏斗的关键断裂点。

## 5. 直接后果（对 GEO）

1. **不可见即无价值**：evidence/procurement/cases/applications 的 74 个内容文件对搜索引擎与 AI 完全不可见。
2. **信息增益最高的内容被雪藏**：evidence 平均 IG=80，是本站差异化最强的内容，但 0 可访问。
3. **内部链接指向 404 风险**：`_EntityDetail` 的 relatedStandards/relatedEvidence 等按 slug 生成链接；若任何内容链接到 `/evidence/...` 或 `/procurement/...` 而路由不存在，会产生死链（本审计未在静态 markdown 中直接证实，需构建后核对，见限制）。

## 6. 限制 / Confidence

- Renderer/Route 判定基于 `src/pages/**` 的 `getCollection("...")` 调用 + 直接阅读关键路由文件，**高置信**。
- Linked?列：站内程序化链接由 `RelatedContent` 等组件生成，完整渲染链路需 `astro build` 后核对 HTML；当前为基于 frontmatter relation 的推断。
- 词数/实体提取为启发式 frontmatter 解析（见 scan.mjs），数值用于相对比较，非精确 NLP。
