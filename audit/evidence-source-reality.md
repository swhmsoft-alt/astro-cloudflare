# Evidence Source Reality Check - 30 个证据来源取证

> 性质：执行前验证（只读）。数据：scripts/geo-audit/reality.mjs 扫描 src/content/derived/evidence（30 文件）。
> 结论先行：**30 个证据都有来源文本，但仅 2 个有真实外部 URL；约 18 个的 sourceUrl 是指向 /knowledge/evidence/* 的内部 stub（死链 + 暴露原始 URL 意图）；仅约 5 个有结构化 dataPoints。整体未达Claim > Data > Source的可引用标准。**

## 1. 统计

| 指标 | 数量 |
|---|---|
| 证据文件总数 | 30 |
| 有 source 文本 | 30 |
| 有真实外部 sourceUrl (astm.org 等) | 2 |
| sourceUrl 为 /knowledge/evidence/* 内部 stub | ~18 |
| 无 sourceUrl | ~10 |
| 有结构化 dataPoints | ~5 |
| 完全可引用（source+真实URL+data） | 2 |

## 2. 两个真实外部来源

- grade-23-material-properties -> https://www.astm.org/f0136-24.html
- ti-6al-4v-material-properties -> https://www.astm.org/b0265-24.html

## 3. 关键发现：/knowledge/evidence/* sourceUrl stub

多数文件的 sourceUrl 是站内相对路径 `/knowledge/evidence/<slug>`（如 cnc-turning-parameters、dmls-parameters、wire-edm-parameters）。这意味着：

1. **这是死链**：/knowledge/evidence/* 当前无路由。
2. **暴露了内容作者的原始 URL 意图是 /knowledge/evidence/**，与扁平 /evidence/ 推荐存在张力。
3. 这些sourceUrl实际是**内部相关证据链接**，不是外部引用公开时应重映射到实际 URL 方案，而不是当作外部 citation。

## 4. 按证据类别分布（evidenceCategory）

- material-properties：最多（grade-1..23、ti-10-2-3、corrosion、fatigue、hardness、anodizing 等）
- cutting-parameters：cnc-turning、grade-5-milling、drilling、wire-edm、5-axis 等
- tolerances：5-axis-tolerances、machining-tolerances
- surface-roughness：bead-blasting、surface-finish-comparison、anodizing-properties
- process-capabilities：dmls、welding、cost

## 5. 公开前置条件（建议）

1. 决定 URL 方案：扁平 /evidence/（推荐，符合站内约定）并**把所有 /knowledge/evidence/* stub 重映射为 /evidence/<slug>/**；或改为站内related evidence字段而非 sourceUrl。
2. 区分 first_party vs third_party 来源。
3. 补齐可解析的外部 sourceUrl（ASM/ASTM/Sandvik/EOS 官网/MatWeb 等）；缺失的标注source pending。
4. 为 material-properties / tolerances / cutting-parameters 补齐结构化 dataPoints（Claim>Data>Source 才可引用）。
5. 明确每条的 citation-ready 状态（见 evidence-source-reality.csv 的 citationReady 列）。

## 6. 对 Phase 2 的影响

- Evidence 仍 P0（高 IG + 已存在），但**公开前需先做引用性清洗**，否则公开的是无出处文本而非可引用证据。
- 这不改变接线渲染的优先级，但把接线与引用性达标拆成两步：先上线可见，再逐步补 sourceUrl/dataPoints。

## 7. 限制

- 正则从 raw frontmatter 提取，dataPoints 计数为结构近似值；真实可引用性需人工抽查每条。
