# GEO Phase 2 - P0A Implementation Report (Knowledge Exposure & Graph Backbone)

> 本轮执行范围：Evidence + Procurement + Applications（仅接线）+ Internal Semantic Graph + 旧 /knowledge/* 死链修复。
> 未执行：Cases、i18n 删除/翻译、Equipment、Tolerance/Inspection/Supplier 新页、RFQ UI、内容扩写、外部 SEO。

## 1. Files changed

### 新建
- `src/pages/_shared/_ProcurementDetail.astro`（轻量采购渲染器）
- `src/pages/evidence/index.astro` + `[slug].astro`
- `src/pages/procurement/index.astro` + `[slug].astro`
- `src/pages/applications/index.astro` + `[slug].astro`
- `[locale]/evidence/{index,[slug]}.astro`、`[locale]/procurement/{index,[slug]}.astro`、`[locale]/applications/{index,[slug]}.astro`（16 locale 镜像）

### 修改
- `src/pages/_shared/_EntityPillar.astro`：Props union + collectionLabels 增加 evidence/procurement/applications
- `src/pages/_shared/_EntityDetail.astro`：重写，加入 Evidence 来源模型 + dataPoints + relatedProcesses/relatedStandards/evidenceCategory 渲染；applications 复用
- `src/components/sections/RelatedContent.astro`：内容池/路径映射加入 procurement、applications
- 死链修复（/knowledge/*  扁平 URL）：`guides.astro`、`[locale]/guides.astro`、`compare/[slug].astro`、`[locale]/compare/[slug].astro`、`[locale]/index.astro`、industries/*/index.astro（en + 16 locale 镜像）、`llms.txt.ts`（共 22 个文件经 patch-knowledge.mjs 统一替换）
- 辅助脚本（audit 用，非运行时代码）：`scripts/geo-audit/{patch-related, patch-knowledge, patch-llms}.mjs`

## 2. Routes created
- `/evidence/`（hub）、`/evidence/<slug>/`（30 篇 detail）
- `/procurement/`（hub）、`/procurement/<slug>/`（25 篇 detail）
- `/applications/`（hub）、`/applications/<slug>/`（4 篇 detail）
- 以上各含全部 16 locale 变体（`/en/...`、`/de/...` 等），与既有 grades/processes 模式一致。

## 3. Components reused
- `_EntityPillar`（三个 hub 全部复用，仅加 label）
- `_EntityDetail`（evidence + applications 复用并扩展）
- `MarketingLayout` / `SEO` / `JsonLd` / `RelatedContent` / `buildDefinedTerm` / `buildTechArticle` / `buildFAQ` / `buildBreadcrumb` / `buildCollectionPage` / `buildItemList`

## 4. Components changed
- `_EntityPillar`（union + labels）
- `_EntityDetail`（evidence 渲染扩展）
- `RelatedContent`（加入 procurement/applications）
- 新增 `_ProcurementDetail`（唯一新 renderer，procurement 结构差异大，未复制 _EntityDetail）

## 5. Schema changes
- 未新增 schema 类型（不堆砌）。
- Evidence detail：DefinedTerm + FAQ + BreadcrumbList；applications：DefinedTerm；procurement：TechArticle + FAQ + BreadcrumbList；hub：CollectionPage + ItemList。复用现有构建函数。

## 6. Sitemap changes
- **既有阻塞项：`astro.config.ts` 未设顶层 `site`，@astrojs/sitemap 未产出任何 sitemap 文件（dist 仅有 rss.xml）。**
- 新页面因此无法进入 sitemap。这在本轮未自动改 astro.config（属配置层，需你确认）。

## 7. Internal link changes
- `RelatedContent` 现可跨 evidence/procurement/applications 互相链接。
- `_EntityDetail` 为 evidence 渲染 relatedMaterials（/grades/）、relatedProcesses（/processes/）、relatedStandards（/standards/）。
- `_ProcurementDetail` 渲染 relatedStandards（/standards/）。
- 清除 guides/compare/industries 中的 /knowledge/* 死链（现指向真实扁平 URL）。

## 8. Old stub mappings
- 18 个 evidence 的 `sourceUrl=/knowledge/evidence/<slug>` 被视为旧内部 stub，**在渲染层绝不作为外部 source 发射**（_EntityDetail.resolveEvidenceSource 拦截，标记为Internal reference - external citation pending，url 清空）。
- `/knowledge/materials|processes|industries|standards|surface-finishes|material-selection|failure-analysis|heat-treatment|corrosion|evidence|procurement|cases|` 在 guides/compare/industries/llms 中全部重映射为扁平 URL（22 文件）。
- Decision log：`/knowledge/evidence/<slug>` 不作为 external citation；不生成 /knowledge/evidence/* 输出（已在 dist 验证）。

## 9. Evidence exposure status
- 30/30 已公开于 `/evidence/<slug>/` + hub，全部 locale。
- 来源模型：2 个真实外部 sourceUrl（astm.org）；约 18 个 internal-ref-pending；约 10 个无 url（显示Source not stated / Cited (no URL)）；不伪造。
- dataPoints 已渲染（存在时）；缺数据的不伪造。

## 10. Procurement exposure status
- 25/25 已公开于 `/procurement/<slug>/` + hub，全部 locale。
- quickAnswer / checklist / typicalValues / faqs / relatedStandards 已渲染。

## 11. Build result
- `pnpm build`：**通过**。dist 已生成 `/evidence/`、`/procurement/`、`/applications/` 全部页面（根 + 16 locale）。
- 验证：dist 中 **0 处 `/knowledge/evidence/`、0 处 `/knowledge/`** 引用。

## 12. Lint result
- `pnpm lint`（含 eslint/type-check/check:kpis 等链）：eslint 阶段输出为 warning（no-console / no-unused-vars / no-explicit-any），绝大多数在既有文件；新文件 `(e: any)` 遵循现有路由约定，未出现 error。
- 说明：受 PowerShell 缓冲限制，完整链退出码未可靠捕获；无 error 输出。

## 13. Remaining risks
- sitemap 未生成（既有 astro.config 缺 `site`），新页暂时不在 sitemap 中。
- 新页面尚未加入 Header/Footer 导航（本轮只接了站内语义内链，未动导航组件）。
- RFQ 未恢复：代码库中无历史 rfq 路由/组件可安全复用（build 日志为历史状态），未重建 UI。
- evidence 引用性未全部达标（多数缺真实外部 URL/dataPoints）接线已完成，引用性清洗留后续。

## 14. Items intentionally NOT changed
- Cases（未公开，保持 NOT EXPOSED）
- i18n：未删除/未 noindex/未 redirect/未翻译任何 locale
- Equipment：未扩展
- Tolerance / Inspection / Supplier：未新建页面（沿用 contextual anchor）
- RFQ UI：未重建
- 博客/关键词/新内容：未新增
- 未做外部 backlink

## 15. NEXT ACTIONS（不自动执行）
1. astro.config 加顶层 `site`（=siteConfig.url），恢复 sitemap 生成，让新页进入 sitemap。
2. 把 Evidence/Procurement/Applications 加入 Header/Footer 导航 + nav i18n key。
3. RFQ 恢复：需先决策是否重建历史 /rfq/*（request-quote/upload-drawing），再接线 ProcurementServiceRFQ。
4. Evidence 引用性清洗：补真实外部 sourceUrl + 结构化 dataPoints，区分 first/third-party。
5. Cases：补 case_type/source_type/first_party/verified 元数据并去重后，再决定公开。
6. i18n：拿到 GSC 数据后再决定空壳 locale 收敛。
