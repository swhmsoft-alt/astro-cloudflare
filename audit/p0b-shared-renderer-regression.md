# P0-B Shared Renderer Regression Audit

> 本轮修改了 _EntityDetail / _EntityPillar / RelatedContent。检查旧实体页是否被意外改变。
> 注意：当前环境 build 失败，无法对 dist 逐页 diff；以下为源码级判定。

## 1. 修改内容 vs 影响面

| 组件 | 修改 | 影响的集合 |
|---|---|---|
| _EntityPillar | union + collectionLabels 增加 3 个新集合 | 仅新集合（旧集合 label 不变） |
| _EntityDetail | 新增 evidence 专属渲染（source/dataPoints/relatedProcesses/Standards）+ 在 jsonLd 增加 Breadcrumb+FAQ | evidence/applications（新）；grades/processes/standards/industries/finishes/select/failures/heat-treatment/corrosion（旧） |
| RelatedContent | 内容池加入 procurement/applications | 所有 detail 页（新集合可被推荐） |

## 2. 旧实体页判定（grades/processes/standards/industries/finishes/material-selection/failure-analysis/heat-treatment/corrosion）

| 检查项 | 是否变化 | 判定 |
|---|---|---|
| title | 不变（data.title） | EXPECTED |
| H1 | 不变 | EXPECTED |
| canonical | 不变（siteConfig.url + resolveRoute） | EXPECTED |
| breadcrumb | 新增 BreadcrumbList JSON-LD（原 _EntityDetail 无） | **EXPECTED（增强，非回归）** |
| JSON-LD | 新增 FAQ/Breadcrumb；DefinedTerm/Product 逻辑不变 | EXPECTED（增强） |
| internal links | RelatedContent 池变大（可推荐到新集合） | EXPECTED（新增，非破坏） |
| visible content | 不变（properties/related 区块逻辑未动） | EXPECTED |

- 我的 _EntityDetail 中所有 evidence 专属逻辑都用 `collectionName === "evidence"` 保护，旧集合不进入。
- 唯一对旧集合的变化是 jsonLd 里**增加了** Breadcrumb+FAQ（增强，不影响索引/渲染正确性）。

## 3. 结论

- 未发现旧实体页的 UNEXPECTED 回归。所有变化为 EXPECTED（增强/新增）。
- 但因 build 失败，**无法做 HTML 级 diff 验证**，标注为 EXPECTED（源码判定）/ UNKNOWN（构建验证缺失）。
