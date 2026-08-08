# GEO Phase 3-A  Evidence Authority Audit

> 只读审计（不改代码/内容）。逐篇评估 30 个 Evidence 的 Claim 明确性、Data Point 真实性、Source 真实性/权威/支撑、第一三方、可引用性、关系、处置建议。
> 数据：逐篇通读全部 30 篇 + 前端 source/sourceUrl/dataPoints；产物 `geo-phase3a-evidence-authority.csv`。

## 1. 结论摘要（30 篇）

| 指标 | 数量 |
|---|---|
| Citation-Ready（真实外部 URL + 来源 + 数据） | 2 |
| 有来源文本但无真实 URL | 28 |
| 其中：内部 stub（/knowledge/evidence/*，非外部引用） | ~18 |
| 真实第三方权威来源（手册/标准/厂商数据） | 22 |
| 第一方/不可验证声称（production data / empirical / industry practice / LME） | 8 |

### 处置建议分布
- CITATION_ASSET：2（ti-6al-4v-material-properties、grade-23-material-properties）
- CLEAN：14（补真实 URL / 结构化 dataPoints 即可引用）
- STRENGTHEN：7（切削/工艺参数，需连厂商权威来源）
- VERIFY：4（公差/检验/阳极化的第一方能力声称）
- VERIFY_OR_REWRITE：2（grade-5-milling-roughing、surface-finish-comparison）
- REWRITE_OR_DROP：1（titanium-cost-data，来源误导）

## 2. Source Authority 分级

| 等级 | 来源类型 | 篇数 | 代表 |
|---|---|---|---|
| HIGH | 真实标准 + 可解析 URL | 2 | ti-6al-4v / grade-23 material-properties（astm.org） |
| MEDIUM | 权威手册/标准/厂商数据（无 URL） | 20 | ASM Handbook、ASTM、AMS、AWS D1.9、ISO、Sandvik/Metcut/Seco/Guhring/GF/EOS/DMG MORI |
| LOW | 模糊/第一方声称 | 7 | Industry StandardsEmpirical TestingProduction validation dataIndustry Practice |
| MISLEADING | 来源不支撑 | 1 | titanium-cost-data（引用 London Metal Exchange，但 LME 不交易钛材） |

## 3. First-party vs Third-party

- 22 篇为第三方来源（手册/标准/厂商） 可作为外链/Citation 对象。
- 8 篇含第一方不可验证声称：
  - 5-axis-tolerances / machining-tolerances（production validation dataindustry practice承载可达到公差）
  - surface-finish-comparison（empirical testing）
  - titanium-anodizing-properties（industry standards）
  - titanium-inspection-data（0.001mm 等能力声称）
  - titanium-cost-data（LME）
  - grade-5-milling-roughing-data（empirical testing Seco）
   这些能力/经验声称没有公开出处，是**引用风险**最高的一类。

## 4. Claim 明确性 / Data Point

- 29/30 有明确、可量化的 Claim（表格式数值）。
- 仅约 5-7 篇有结构化 dataPoints frontmatter（5-axis-tolerances、bead-blasting、grade-5-milling、grade-23、ti-6al-4v、grade-5-milling-roughing 等）；其余数据在 body 表格。
- 多数数值合理可信；titanium-cost-data 的 $/kg 数据无真实出处（高险）。

## 5. Evidence  Entity 关系覆盖

- material-properties：普遍关联到对应 grade（/grades/）。
- cutting-parameters：关联 grade + process（/processes/）。
- tolerances/inspection：关联 process + ISO/ASME。
- welding：AWS D1.9。corrosion：ASTM。fatigue：ASM。
- 关系总体健康；缺的是证据到标准/决策的可解析外部引用落点。

## 6. 哪些值得建设 / 可成为 AI Citation Asset

### Tier 1  立即作为 Citation Asset（已可引用）
- ti-6al-4v-material-properties、grade-23-material-properties（真实 astm.org URL + dataPoints + faqs）

### Tier 2  补真实 URL 后成为 Citation Asset（CLEAN，14 篇）
- 其余 grade material-properties（连 MatWeb/ASM/ASTM）
- bead-blasting（ASM Vol5）、corrosion（ASTM）、fatigue（ASM Vol19）、welding（AWS D1.9）、surface-roughness-standards（ASME B46.1/ISO1302）、ti-6al-4v-hardness（ASM Vol4）

### Tier 3  连厂商权威来源后成为可引用参数表（STRENGTHEN，7 篇）
- 5-axis-machining-data（DMG MORI）、cnc-turning / grade-5-turning（Sandvik）、grade-5-milling（Metcut/Sandvik）、drilling（Guhring/OSG）、wire-edm（GF）、dmls（EOS）

### 应改造或放弃
- VERIFY（4）：5-axis-tolerances、machining-tolerances、titanium-anodizing、titanium-inspection  需核实/重述第一方能力声称（或标注typical/indicative）
- VERIFY_OR_REWRITE（2）：grade-5-milling-roughing、surface-finish-comparison  无可靠出处，需重写来源或降级
- REWRITE_OR_DROP（1）：titanium-cost-data  LME 引用误导，需用真实钛价来源或删除

## 7. 值得连接的外部权威来源

- 标准：ASTM B265/B348/F136、AMS 4911/4928/4983、AWS D1.9、ISO 2768/286/1302、ASME B46.1/Y14.5、AS9100D、ASTM E 系列（NDT）
- 手册：ASM Handbook Vol 2/4/5/19、Machining Data Handbook (Metcut)
- 厂商数据：Sandvik Coromant、Seco Tools、Guhring、OSG、GF Machining Solutions、EOS、DMG MORI
- 材料数据：MatWeb

## 8. 下一步建议（供决策，本轮不执行）

1. 先把 2 篇 Tier-1 + 补 URL 后的 14 篇 Tier-2 建成 Citation Asset（补真实 sourceUrl + dataPoints）。
2. 对 7 篇 Tier-3 连厂商来源（external sourceUrl）。
3. 对 8 篇第一方声称做verify 或降级为 typical/indicative，避免不可验证能力承诺。
4. 处理 titanium-cost-data（换真实来源或删除）。
5. 之后才考虑站外 Citation 连接（不提前做）。
