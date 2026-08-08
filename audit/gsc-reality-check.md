# GSC Reality Check - 代码世界 vs Google 世界

> 性质：执行前验证。
> 重要边界：**Cline 无法访问 Google Search Console。** 以下给出代码已知事实+ 需由你提供的 GSC 数据列 + 决策框架。
> 原则：Code Reality + Google Reality + User Intent + Entity Strategy = Decision（不因代码审计单方面删 URL）。

## 1. 代码已知 URL 清单（代码世界）

| URL 类别 | 代码状态 | 说明 |
|---|---|---|
| / (home), /grades/, /processes/, /industries/, /standards/, /finishes/, /select/, /corrosion/, /failures/, /heat-treatment/ | LIVE | 知识 Hub/Detail |
| /compare/, /compare/[slug]/ | LIVE | 决策页（footer 有 /knowledge/standards/ 死链） |
| /guides/, /guides/[slug]/, /faq/, /blog/, /tools/, /docs/ | LIVE | 其他内容 |
| /solutions/, /pricing/, /contact/, /about/, /privacy/, /terms/ | LIVE | 服务/商业/法律 |
| /evidence/, /procurement/, /cases/, /applications/ | 无 URL | SCAFFOLD（待接线） |
| /rfq/request-quote/, /rfq/upload-drawing/ | DEAD | 历史 build 日志曾有，当前源码无 |
| /knowledge/*（llms.txt 引用） | DEAD | llms 死链，历史可能被索引 |
| 16 locale 前缀 (/{de,ja,fr,...}) | 部分空壳 | 仅 en/de/es 有内容 |
| /robots.txt /sitemap-index.xml /rss.xml /llms.txt /og/* | LIVE | 系统 |

## 2. 需由你提供的 GSC 数据（每 URL 或 URL 前缀）

```text
URL | Clicks | Impressions | CTR | Position | Indexed? | Last crawl | Top Queries
```
优先导出：
- 16 locale 根（判断哪些空壳语言已有 impressions/索引）
- /compare/ 全家族
- 历史 /rfq/* 与 /knowledge/*（是否有历史流量/backlinks）
- evidence/procurement/cases/applications 是否有历史索引（理论上无，但确认）

## 3. 决策框架

对每一 URL 类，按代码状态 x GSC 现实决策：

| 场景 | 决策 |
|---|---|
| LIVE + 有印象/点击 | KEEP + 加强 |
| LIVE + 无点击 + 高内容价值 | KEEP + 加强内链 |
| 空壳 locale + 无印象 | 暂停（从 sitemap/hreflang 移除；路由若保留则 noindex 或 canonical 到 en） |
| 空壳 locale + 有印象/backlinks | 不删；redirect 到对应 en 或保留 en 内容 + canonical |
| DEAD (/rfq/*, /knowledge/*) + 有历史索引 | 处理：要么恢复对应路由（rfq 恢复、knowledge 改为扁平），要么 301 到替代 URL |
| DEAD + 无索引 | 无需处理（仅确保不重新链接） |
| SCAFFOLD (evidence 等) | 接线公开（先上可见，再引用性清洗） |

## 4. 结论

- 先补 GSC 数据，再决定 i18n 删除/保留、旧 /knowledge/* 与 /rfq/* 的处理。
- 在拿到 GSC 之前，不执行删除 13 语言或删旧 URL之类不可逆操作。

## 5. 你需要做的

1. 导出 GSC：Performance（Pages + Queries）+ URL Inspection（关键 URL 的 Indexed? / Last crawl）。
2. 提供站点 Search Console 访问范围（主域名 titanium.blog + 可能的历史域名）。
3. 提供后，我据实更新此表并给出逐类决策。
