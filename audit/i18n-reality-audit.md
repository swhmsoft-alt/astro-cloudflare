# i18n Reality Audit  titanium.blog

> 取证：配置声明的语言 vs 实际内容语言 vs 实际生成路由是否一致；是否存在伪多语言 URL。

## 1. 三处配置来源（互相不一致）

| 来源 | 域名 | 站点名 | locales | 默认前缀 |
|---|---|---|---|---|
| `src/config/site.config.ts`（astro.config 用于 sitemap/canonical） | https://titanium.blog | titanium.blog | 16 | false |
| `src/lib/site-config.ts` SITE_CONFIG（i18n/routes 使用） | **https://astro-cloudflare-starter.pages.dev** | **Astro Cloudflare** | 16 | false(硬编码) |
| `astro.config.ts` sitemap i18n |  |  | 16 | en:en-US |

**发现：存在两套并行的站点配置，且 `lib/site-config.ts` 里的 url/name 仍是 starter 占位值（astro-cloudflare-starter.pages.dev / Astro Cloudflare）。** canonical/schema 用 `siteConfig.url`（titanium.blog），路由解析用 `SITE_CONFIG`（占位域名）虽然实际可访问域名是 titanium.blog，但这是一处明确的一致性问题。

## 2. 支持的语言（16 种，非文档所述的 en+id）

en, de, ja, fr, es, pt, it, ko, nl, pl, ru, ar, pt-br, tr, cs, sv

> `system/globals`/AGENTS 描述为 en + /id/，与实际 16 语言配置不符。

## 3. 内容语言实况（机器扫描 188 文件）

- **core/derived/applications 内容：全部 `locale: en`**（抽样 grade-5、evidence、comparisons 均为 en）。
- **site/pages：仅存在 en / de / es 三种**（about、contact、pricing、privacy、terms、solutions-* 各有 -de / -es 变体）。
- blog：3 篇均 en。
- 其余 13 种语言：**0 本地化内容**。

## 4. 结论：网站实际启用了多少语言？

- **路由层面**：16 种语言路由全部生成（`[locale]` catch-all）。
- **内容层面**：只有 en 完整；de/es 仅页面级部分；**其余 13 种语言为空壳路由生成 URL 但内容几乎全是 en fallback。**
- 因此存在**伪多语言 URL**：hreflang 会声明 16 种语言，但多数变体内容与 en 相同。

## 5. 对 GEO 的影响（优先级高）

1. **Crawl budget 浪费**：16 路由放大页面总量，多数变体无差异化内容，浪费抓取配额。
2. **Duplicate content / hreflang 冲突**：近空壳变体易被判定为重复或低质量。
3. **实体一致性稀释**：同一实体的多语言 URL 指向弱内容，削弱实体信号。
4. 真实优先项应是**收敛语言**（例如先做 en + 1~2 个高价值语言），或关闭未启用语言的 hreflang，而不是让 16 语言全部空转。

## 6. 限制

- 内容 locale 判定基于 scan 的 frontmatter 解析（覆盖 188 文件）。de/es 具体覆盖率未逐文件精确统计（见 page-inventory.csv 的 locale 列）。
