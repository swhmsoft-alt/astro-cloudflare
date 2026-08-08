# GEO MASTER REPORT - titanium.blog

> 性质：机器级取证审计（只读，未改动任何 src/ 代码/内容）。
> 方法：`scripts/geo-audit/scan.mjs` 扫描 188 内容文件 + `src/pages` 全路由消费关系 + 直接阅读关键文件。

## A. Current State（网站现在是什么）

- 独立钛工程知识站（`siteConfig.url=https://titanium.blog`），Astro + Cloudflare，静态。
- 内容总量 188 文件 / 17 集合；**已渲染 16 集合 / 未渲染 4 集合**（evidence 30, procurement 25, cases 15, applications 4）。
- 六大知识入口（Materials/Processes/Industries/Standards/Finishes/Equipment）中 **Equipment 为空壳**。
- 语言：路由生成 16 种，**仅 en 完整，de/es 页面级部分，其余 13 种为空壳**。
- 商业层：`/solutions/` 等存在，但 **RFQ 路由在源码中不存在**。

## B. What Is Already Strong

- 知识实体结构优秀：grades/processes/standards/industries/finishes/select/corrosion/failures/heat-treatment 全部有 Hub + Detail + schema（DefinedTerm/Product/CollectionPage）。
- 决策内容好：comparisons(16) 有 quickAnswer + 决策框架，material-selection 是真实决策入口。
- **evidence(30) 信息增益最高（avg IG=80）**，是差异化最强的资产（含来源/数据点/公差/切削参数）。
- schema 库完整且未过度；sitemap/RSS/robots/llms.txt/OG 已接线。

## C. Critical Weaknesses（真正阻碍 GEO 的）

1. **内容不可见**：evidence/procurement/cases/applications 共 74 文件无 URL、无 sitemap、不可被 AI 引用。
2. **Equipment 空壳**：被 nav 承诺但不存在。
3. **RFQ 缺失**：Knowledge-to-Quote 漏斗最后一步断裂。
4. **伪多语言**：16 语言路由 vs 3 语言内容，浪费 crawl + 重复内容风险。
5. 配置分叉：`site-config.ts`(titanium.blog) vs `lib/site-config.ts`(starter 占位域名) 并存。

## D. Structural Problems

- 4 个 SCAFFOLD 集合（有内容/有 schema/无渲染器/无路由）。
- 关系已编码于 frontmatter 但无落点（grade-5  evidence/DFM/procurement 关系不可达）。
- 高价值实体（evidence/procurement）内部链接权重为 0。

## E. Content Problems

- 薄内容：cases 平均 37 词、applications 111 词、corrosion 40 词。
- 重叠：materialSelection 与 comparisons 同实体重叠（titanium-vs-aluminum 等 4 对）。
- evidence 强内容与 blog(3) 营销边界模糊。

## F. Evidence Problems

- Evidence Layer 不是没有，而是**有 30 篇但 0% 可见**；没有 evidence 路由/schema/链接。

## G. Authority Problems（站外）

- 无外部实体权威可引用，因为最高价值内容不可见、RFQ/能力页缺失。
- 站外应围绕实体（grades/standards/evidence）建 Citation，而非泛 backlink。

## H. Top 10 Actions

| # | Problem | Why it matters | Evidence | Action | Expected impact | Effort | Priority |
|---|---|---|---|---|---|---|---|
| 1 | evidence 不可见 | 差异化最强内容被雪藏 | IG avg 80, 0 URL | 加 /evidence/ 路由+hub+渲染+schema | 提升 AI 引用与抓取 | M | P0 |
| 2 | procurement 不可见 | 采购决策断裂 | 25 篇, 0 URL | 加 /procurement/ 路由+hub | 打通采购决策 | M | P0 |
| 3 | cases 不可见 | 制造证据缺失 | 15 篇, 0 URL | 加 /cases/ 路由 | 建立制造证据 | M | P0 |
| 4 | 伪多语言 | 浪费 crawl+重复 | 16 vs 3 语言 | 收敛语言或关闭空壳 hreflang | 索引质量 | S-M | P0 |
| 5 | Equipment 空壳 | 入口承诺不存在 | 无集合/内容/路由 | 补内容或移除导航 | 实体一致性 | S | P0 |
| 6 | RFQ 缺失 | 转化断裂 | 无 rfq 路由 | 重建 request-quote/upload-drawing | 商业转化 | M | P1 |
| 7 | 配置分叉 | canonical/路由域名不一致 | site-config vs site-config | 统一 SITE_CONFIG 为 titanium.blog | 一致性与信任 | S | P1 |
| 8 | 薄内容 | 低信息增益 | cases 37 词 | 加深或合并 | 内容质量 | M | P2 |
| 9 | 重叠 | cannibalization | 4 对同实体 | comparisons 与 selection 差异化 | 索引聚焦 | S | P2 |
| 10 | 站外权威 | 无 Citation 源 | 高价值内容不可见 | 先接线 1-5，再按 offsite 计划 | 实体权威 | L | P1 |

## I. Do Not Do（未来 90 天）

- 新增泛化 Knowledge 文章 / FAQ 页 / 关键词变体 / 空壳多语言页 / 为新页面加 schema。
- 在接线 evidence/procurement/cases 之前新增内容。详见 `do-not-create.md`。

## J. Single Biggest Bottleneck

> **证据/决策层内容存在但 0% 可访问**（evidence+procurement+cases 共 70 文件无 URL），导致本站最强的实体权威信号完全无法被搜索引擎与 AI 观测。

## K. Single Biggest Opportunity

> **把已写好的 Evidence + Procurement + Cases 层接线渲染**，使knowledge  evidence  decision  procurement  RFQ漏斗完整落地这是让 titanium.blog 从写文章的网站变成可被引用的制造知识实体的最快路径。

## 附：10 维评分（启发式，附依据）

| 维度 | 分/100 | 依据 |
|---|---|---|
| Technical Foundation | 85 | 静态构建/sitemap/RSS/robots/llms/schema 齐备；扣分=配置分叉 |
| Topic Coverage | 80 | 知识实体覆盖广；扣分=Equipment/RFQ 空壳 |
| Entity Coverage | 62 | 实体 121 个已提取；但 4 集合不可见 + equipment 缺失 |
| Entity Relationships | 45 | 关系编码于 frontmatter 但大量无落点（SCAFFOLD） |
| Information Gain | 68 | evidence/comparisons 强；cases/applications 薄 |
| AI Citation Readiness | 55 | 已渲染页有 quickAnswer/表格/schema；但最强内容不可见 |
| Internal Knowledge Graph | 50 | 关系丰富但一半实体指向不可见页 |
| Evidence Layer | 20 | 有内容无可见性（接线前） |
| Commercial Knowledge Flow | 30 | KnowledgeDecision 强，Procurement/RFQ 断裂 |
| External Entity Authority | 10 | 无 Citation，且无可见资产可被引用 |

> 注：评分为启发式相对值（见各 CSV 的 score 列与 scoring factors），用于排序优先级，非绝对排名。
