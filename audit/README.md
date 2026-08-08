# Titanium.blog GEO Master Audit  产物索引

> 机器级只读取证审计。未改动任何 src/ / public/ / astro.config / content.config / schema / 内部链接。
> 审计脚本：`scripts/geo-audit/{scan.mjs, generate.mjs, generate2.mjs}`（`node scripts/geo-audit/scan.mjs` 重新生成）。

## 机器级产物

| 文件 | 说明 |
|---|---|
| `raw-data.json` | 188 内容文件原始数据（frontmatter/词数/表格/关系/渲染状态） |
| `page-inventory.csv` | 页面清单（189 行） |
| `entity-inventory.csv` | 实体清单（122 行，按出现次数） |
| `entity-page-matrix.csv` | 实体页面矩阵（660 行） |
| `knowledge-graph.json` | 知识图谱（309 节点 / 659 边） |
| `information-gain.csv` | 信息增益评分（189 行） |
| `ai-citation-readiness.csv` | AI 可引用性评分（189 行） |
| `page-purpose-audit.csv` | 页面目的审计（189 行） |
| `content-overlap.csv` | 同实体重叠（4 对） |
| `internal-link-graph.csv` | 语义内链（660 行） |

## 分析报告

| 文件 | 说明 |
|---|---|
| `GEO-MASTER-REPORT.md` | 最终报告（含 10 维评分 / Top10 / Do Not Do / 单一瓶颈 / 单一机会） |
| `module-reality-audit.md` | 逐模块真实状态（A/B/C/D 取证） |
| `i18n-reality-audit.md` | 多语言现实（16 vs 3） |
| `decision-gap.md` | 决策链断裂审计 |
| `do-not-create.md` | 不应创建的页面类型 |
| `site-architecture.md` | 站点结构 |
| `geo-content-gap.md` | 实体/关系/决策缺口 |
| `commercial-knowledge-flow.md` | 商业漏斗 |
| `schema-entity-audit.md` | schema 接线 |
| `offsite-authority-map.md` | 站外实体权威计划 |

## 评分与置信

- IG / AI-Citation / 实体关系为启发式（见各 CSV score + scoring factors），用于排序，非绝对。
- 渲染判定基于 src/pages getCollection 调用 + 直读路由，高置信。
- 内链/死链需 `astro build` 后抓 HTML 复核（本审计为 frontmatter relation 推断）。

## 执行前验证（Reality Checks）

| 文件 | 说明 |
|---|---|
| `cases-reality.csv` / `cases-reality.md` | 15 个案例真实性取证（0 带 provenance；约 5 对近似重复） |
| `evidence-source-reality.csv` / `evidence-source-reality.md` | 30 个证据来源取证（2 真实外链；~18 内部 stub；~5 dataPoints） |
| `gsc-reality-check.md` | URL 清单 + GSC 决策框架（需用户提供 GSC 数据） |
| `scripts/geo-audit/reality.mjs` | 生成上述 reality 数据的脚本 |

> 结论：Evidence/Procurement 维持 P0；Cases 降为 P0/P1（先补真实性元数据+去重）；Applications 降 P1。Evidence 公开前需引用性清洗。
