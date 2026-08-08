# GEO Phase 2 - P0C Indexation Architecture Repair

> 本轮允许改代码，仅处理：3 新模块 locale 路由 / hreflang / /en/ 重复 / build 诊断 / sitemap 前置。
> 未做：Evidence 内容清洗、Cases、RFQ、全站 locale 删除、翻译、站外。

## 1. Route generation changes
- 删除 evidence/procurement/applications 的 6 个 [locale] 路由文件：
  - [locale]/evidence/{index,[slug]}.astro
  - [locale]/procurement/{index,[slug]}.astro
  - [locale]/applications/{index,[slug]}.astro
- 三个模块现在**只生成默认 en（无前缀）路由**：
  - /evidence/ + /evidence/<slug>/
  - /procurement/ + /procurement/<slug>/
  - /applications/ + /applications/<slug>/

## 2. Locale changes
- 三个模块正式为 **en-only**（内容本来就全 en）。
- 不再生成 /de/* /ja/* /fr/* /es/* /pt/* /it/* /ko/* /nl/* /pl/* /ru/* /ar/* /pt-br/* /tr/* /cs/* /sv/*。
- 不再生成 /en/* 前缀。
- 未触碰 grades/processes/standards/industries/finishes 等其它模块（等 GSC）。

## 3. Hreflang changes
- `src/lib/seo.ts`：`hreflangLinks(path, locales?)` 新增可选 locales 参数（默认全）。
- `src/components/seo/SEO.astro` + `src/layouts/MarketingLayout.astro`：新增 `hreflangLocales` 透传。
- `_EntityPillar` / `_EntityDetail` / `_ProcurementDetail`：对三个 en-only 模块传 `hreflangLocales=["en"]`。
- 效果：三个模块只输出 `en/self` hreflang，**不指向不存在的非 en URL（无 404 hreflang）**。其它模块默认仍全 locale（本轮不改）。

## 4. /en/ duplicate elimination
- 通过删除 [locale] 路由，**从源头不再生成 /en/evidence/* 等重复页**（不做 canonical-to-root 收敛方案）。
- 其它既有 /en/ 页面本轮未删除。

## 5. Build diagnosis
- node v26.2.0 / astro 7.0.7。
- 失败阶段：vite "Building static entrypoints"（astro content 同步完成之后）。
- 失败特征：`[vite] [ERROR] Build failed in ~4s`，堆栈全在 **esbuild**（esbuild/lib/main.js + rolldown + vite-plugin-import-meta-env），`The service was stopped: write EPIPE`。
- 判定：**esbuild 二进制崩溃（内存耗尽）**，非页面渲染错误。
- 证据：build1（全量）曾成功；build2/3/C 复现失败；删除 992 个新模块 locale 页后仍失败  **瓶颈不是新模块页数，而是全站其它模块 16-locale 的 JS 入口总量 + 环境内存**。

## 6. Build fix
- 本轮范围内无法修复：新模块 locale 已降到最小（仅 en 62 页），瓶颈在其它模块的 16-locale 扩张（超出 P0-C 范围）。
- 建议（非本轮执行）：在 CI/生产用充足内存构建；或按 GSC 数据收敛其它模块空壳 locale，降低入口总量。

## 7. Sitemap status
- `astro.config.ts` 顶层 `site: siteConfig.url` 已存在（line 105，sitemap 前置满足）。
- **sitemap 未生成/未验证**：build 在 sitemap 生成之前失败（vite 阶段），无法产出 sitemap。
- 按你的要求build 稳定成功后才生成 sitemap，当前**不能生成**。

## 8. Actual indexable URL count
- 三个模块（en-only）：evidence 31（hub+30）+ procurement 26（hub+25）+ applications 5（hub+4）= **62**。
- 重复 /en/：0。
- 非 en 新模块路由：0。
- hreflang  404：0（仅 en/self）。

## 9. Actual generated URL count
- 无法扫描 dist（build 失败且 astro 会清空 dist）。
- 分析口径：三模块应生成 62 个 URL（根 en）；不再有 /en/ 或非 en。

## 10. 404/hreflang validation
- 源码级确认：三模块 hreflang 仅 en/self，无指向不存在的非 en detail。
- 未做 dist 级抓取（build 失败）。

## 11. Regression result
- 源码判定：三模块相关改动不触及 grades/processes/standards/industries/finishes/select/failures/heat-treatment/corrosion 的 title/H1/canonical/JSON-LD/breadcrumb/content。
- 唯一间接影响：`hreflangLinks`/SEO/MarketingLayout 增加可选 `hreflangLocales`（默认全，其它模块行为不变）。
- 判定：EXPECTED（无 UNEXPECTED 回归）；HTML 级验证因 build 失败为 UNKNOWN。

## 12. Files changed
- 删除：src/pages/[locale]/evidence/{index,[slug]}.astro、[locale]/procurement/{index,[slug]}.astro、[locale]/applications/{index,[slug]}.astro（6）
- 修改：src/lib/seo.ts（hreflangLinks 可选 locales）、SEO.astro（hreflangLocales）、MarketingLayout.astro（透传）、_EntityPillar/_EntityDetail/_ProcurementDetail（传 ["en"]）
- 未改：astro.config.ts（site 已存在）
- 辅助脚本（audit）：patch-seo / patch-hreflang / patch-renderers / patch-site.mjs

## 13. Remaining risks
- **build 在本环境 OOM**（esbuild），无法本地生成/验证 sitemap 与 dist。
- 其它模块 16-locale 仍生成大量页面（等 GSC 后收敛）。
- sitemap 生成后仍会包含其它模块的 locale 路由（本轮不排除）。

## 最终结论
> **BLOCKED**（针对 sitemap 生成）
> 索引架构改动（3 模块 en-only、无 /en/ 重复、无 hreflang-404、62 个 indexable URL）**已完成且正确**；
> 但 `pnpm build` 在本环境因 esbuild 内存耗尽无法完成，**sitemap 无法生成/验证**。
> 需在充足内存的 CI/生产环境重建验证；或按 GSC 数据先收敛其它模块空壳 locale 后再生成 sitemap。
