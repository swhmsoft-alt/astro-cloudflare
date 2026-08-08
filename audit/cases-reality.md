# Cases Reality Check - 15 个制造案例真实性取证

> 性质：执行前验证（只读）。数据：scripts/geo-audit/reality.mjs 扫描 src/content/derived/cases（15 文件）。
> 结论先行：**15 个案例 0 个带任何来源/第一方/已核实标记，且存在约 5 对近似重复。不能直接公开为制造能力证据。**

## 1. 逐文件明细（cases-reality.csv）

| slug | industry | material | tolerance | qty | leadTime | hasProvenance |
|---|---|---|---|---|---|---|
| 5-axis-structural-bracket | aerospace | Grade 5 | +-0.05mm | 1200/yr | 5-6wk | NO |
| complex-5-axis-titanium-bracket | aerospace | Grade 5 | +-0.05mm | 1200/yr | 5-6wk | NO |
| aerospace-bracket-case | aerospace | Grade 5 | +-0.005mm | - | 15bd | NO |
| aerospace-thin-wall-housing | aerospace | Grade 5 | +-0.025mm | 500/yr | 6-8wk | NO |
| thin-wall-aerospace-housing | aerospace | Grade 5 | +-0.025mm | 500/yr | 6-8wk | NO |
| grade-23-orthopedic-component | medical | Grade 23 | +-0.01mm | 2000/yr | 3-4wk | NO |
| orthopedic-component | medical | Grade 23 | +-0.01mm | 2000/yr | 3-4wk | NO |
| medical-fixture | medical | Grade 23 | +-0.005mm | 200/yr | 4-6wk | NO |
| medical-implant-fixture | medical | Grade 23 | +-0.005mm | 200/yr | 4-6wk | NO |
| medical-implant-dmls-case | medical | Grade 23 | - | - | 5bd | NO |
| medical-instrument-case | medical | Grade 5 | - | - | - | NO |
| semiconductor-chamber-case | semiconductor | Grade 5 | +-0.005mm | - | - | NO |
| semiconductor-vacuum-component | semiconductor | Grade 2 | +-0.05mm | 80/yr | 10-12wk | NO |
| oil-gas-downhole-case | industrial | Grade 23 | - | - | - | NO |
| titanium-exhaust-system | industrial | Grade2+5 | - | - | - | NO |

## 2. 判定：真实 / 模拟 / 编辑型？

- 字段有具体规格（公差、数量、交期），**看起来像真实制造案例**。
- 但**无任何 source / client / oem / verified / first_party / reference 字段**（schema 里 cases 也没有 source 字段）。
- 因此**无法从代码判定真实性**。分类只能是：**未标注来源的工程案例（可能为编辑型/模拟，也可能为真实制造经验）**。
- 直接公开风险：AI/用户可能将其误读为 BOZE Metal 实际制造案例，构成虚假证据（E-E-A-T 与合规风险）。

## 3. 近似重复（须处理）

| 重复对 | 说明 |
|---|---|
| 5-axis-structural-bracket / complex-5-axis-titanium-bracket | 参数几乎一致（Grade5, +-0.05, 1200/yr, 5-6wk） |
| aerospace-thin-wall-housing / thin-wall-aerospace-housing | 同规格副本 |
| grade-23-orthopedic-component / orthopedic-component | 同规格副本 |
| medical-fixture / medical-implant-fixture | 同规格副本 |

> 若 15 个去重后可能只剩约 10-11 个唯一案例。

## 4. 公开前置条件（建议）

给 cases 增加元数据：
```text
case_type:   real | mock | editorial | anonymized
source_type: first_party | third_party | derived
first_party: true|false
verified:    true|false | 验证人/日期
client_industry_anonymous: true|false
```
并按此决定：
- real + first_party + verified：可标注为制造能力证据（关联 Supplier/Service）。
- editorial / mock：必须明确标注示例/编辑型，不可作为 BOZE Metal 实证。
- 去重后保留唯一案例，其余 MERGE 或 DROP。

## 5. 建议优先级

- Cases 从 P0 降为 P0/P1（先补齐真实性元数据 + 去重，再公开）。
- 不公开来源不明案例为制造证据；可先在 /cases/ 以engineering case examples（编辑型）名义公开并明确标识。

## 6. 限制

- 真实性判断受限于代码元数据；确认真实性需人工/BOM 佐证（超出代码审计范围）。
