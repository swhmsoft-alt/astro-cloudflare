# GEO Phase 2 - P0-B Indexation & Localization Reality Report

> 只读验证。未执行任何 indexation/canonical/hreflang/sitemap/robots/redirect/删除 修改。
> 重要：本环境 `pnpm build` 复现失败（esbuild EPIPE，见下），dist 无法用于逐页抓取；本报告基于源码路由逻辑 + 内容事实（可直接验证）。

## 0. 立即阻塞项：构建失败

- build2 / build3 均在 vite "Building static entrypoints" 阶段报 `esbuild EPIPE`（`The service was stopped: write EPIPE`）并在 3-6s 内失败。
- 根因：16 locale  巨量静态页使 esbuild 在此环境内存耗尽。
- 后果：astro 构建会清空 dist，当前 dist 残缺，**无法遍历实际 dist 做 indexation 现实验证**。
- 这是 P0-B 最大发现，也是继续 indexation 的硬前提。

## A. 16 locale 中哪些真正值得 index？

- **只有默认 en（无前缀）真正值得 index**（有完整内容）。
- /en/ 前缀：内容与 en 完全重复，应 canonical 到 root，不值得独立 index。
- **其余 15 个 locale（de/ja/fr/...）不值得 index**：evidence/procurement/applications 内容全是 en，非 en hub 为空壳（coming soon），非 en detail 根本不存在。

## B. Evidence/Procurement/Applications 实际推荐 index 多少 URL？

- **推荐 62 个**：evidence 31（hub+30）、procurement 26（hub+25）、applications 5（hub+4）。
- 不推荐：/en/ 重复 62 + 空壳 hub 45。

## C. 是否存在大规模 English fallback？

- **是，且更严重**：非 en 页面不是英文回退，而是**空壳**（无 detail、hub 空）。
- /en/ 前缀是 100% 英文重复（similarity=1）。
- 不存在真实翻译（content 全 en）。

## D. canonical / hreflang 是否安全？

- canonical：root en 自引用正确；/en/ 页 canonical 到 root（安全收敛）。
- **hreflang 不安全**：输出 16-locale 链接，指向不存在的非 en detail（404）。
- 结论：canonical 基本安全，hreflang 需修复（本轮不改）。

## E. 共享 renderer 是否产生 regression？

- 源码判定：_EntityDetail 的 evidence 逻辑均以 collectionName==="evidence" 保护，旧实体页（grades/processes/.../corrosion）渲染不变；仅 jsonLd 增加 Breadcrumb/FAQ（增强）。
- 标记：EXPECTED（无 UNEXPECTED 回归）。但因 build 失败，HTML 级验证为 UNKNOWN。

## F. /knowledge/* migration 是否存在语义错误？

- 除 `/knowledge/cases/  /compare/` 外，其余迁移语义等价（旧死链真实扁平 URL）。
- `/knowledge/cases/` 本应指向未公开的 cases，暂指向 /compare/（**PARTIAL，非等价**，需在 cases 公开后修正）。
- 其余无语义错误。

## G. Evidence 哪些真正 citation-ready？

- 仅 **2/30** 是 VERIFIED_EXTERNAL（真实外部 URL，astm.org）。
- 16/30 INTERNAL_REFERENCE（/knowledge/evidence/* stub，不可作为外部引用）。
- 12/30 SOURCE_TEXT_ONLY（有来源文本，无真实 URL）。
- 结论：绝大多数 evidence **未达 citation-ready**，需后续补来源/URL（本轮不补）。

## H. 下一步是否可以生成 sitemap？

- **暂不能**。原因： astro.config 缺 `site`，sitemap 未生成； build 在此环境失败，无有效 dist； 即便生成，会包含 62 重复 /en/ + 45 空壳。
- 应先：修复 build（收敛 locale 或资源） 加 `site`  仅对 en-root 生成 sitemap / 排除空壳。

## 最终结论

> **BLOCKED - FIX REQUIRED**
> 直接原因：构建在本环境失败（esbuild EPIPE）+ 16-locale 空壳/重复造成大量不可索引 URL + hreflang 指向 404。在构建恢复并收敛 locale 之前，不应生成 sitemap 或提交 indexation。
