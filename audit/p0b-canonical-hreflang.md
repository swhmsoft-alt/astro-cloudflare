# P0-B Canonical / Hreflang Audit

> 性质：只读分析。由于当前环境 build 失败（esbuild EPIPE，见 P0B-INDEXATION-REPORT），本分析基于源码路由逻辑（可直接验证），非 dist 抓取。

## 1. Canonical 现状（evidence/procurement/applications  locale）

| 页面 | canonical | 判断 |
|---|---|---|
| /evidence/<slug>/（根，en） | https://titanium.blog/evidence/<slug>/ | self canonical，正确 |
| /en/evidence/<slug>/ | https://titanium.blog/evidence/<slug>/（指向根） | canonical 到 en 根，安全（收敛） |
| /de|ja|.../evidence/（hub） | 待定（空页） | 空内容，index 无意义 |
| /de|ja|.../evidence/<slug>/ | **不存在**（[locale] detail 仅生成 /en/） | 无页面，hreflang 指向它会 404 |

- 关键：非 en locale 的 **detail 页根本不存在**（[locale]/[slug] 的 getStaticPaths 只对 en 内容生成 params.locale="en"）。
- 因此 /de/evidence/ 等 15 个 hub 是**空壳**，/de/evidence/<slug>/ 是 404。

## 2. Hreflang 问题（高风险）

- `SEO.astro` 对每个页面调用 `hreflangLinks(path)`，为 path 生成 **全部 16 locale 的 hreflang 链接**。
- 对 /evidence/<slug>/，会输出指向 /de/evidence/<slug>/、/ja/evidence/<slug>/ 等 **不存在的 URL**。
- 结论：**hreflang 指向 404**，属于 broken hreflang（Google 会忽略或误判）。

## 3. 结论

- root en 的 canonical 是自引用、正确。
- /en/ 前缀页 canonical 到 root（收敛安全），但**与 root 内容完全重复**，浪费 crawl。
- **hreflang 不安全**：16-locale 输出指向不存在的非 en detail。

## 4. 建议（本轮不执行）

- 仅对"真实存在且本地化的 locale"输出 hreflang；否则不输出。
- 关闭/不生成空壳 locale hub 与 /en/ 重复前缀，或对它们 noindex。
