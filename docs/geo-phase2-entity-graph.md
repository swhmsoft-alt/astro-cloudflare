# Titanium.blog GEO Phase 2  Entity Graph Design

> 目标：为 evidence/procurement/cases/applications/comparisons/decision/tolerance/inspection/RFQ 设计可落地的实体图谱，使现有知识资产恢复成可索引、可引用、可形成实体关联的生产架构。
> 性质：设计文档（不改代码/不建页面/不写内容）。基于 GEO Master Audit 的机器级数据。

## 0. 约定

- 实体用方括号 `[实体名]`，关系用有向边 `->`。
- 关系类型（边标签）：`used_for` / `manufactured_by` / `specified_by` / `requires` / `compared_with` / `used_in` / `supported_by` / `certified_by` / `processed_by` / `informed_by` / `leads_to`。
- 标注 `(EXISTS)` = 已渲染可访问；`(SCAFFOLD)` = 有内容但无 URL（接线后转 EXISTS）。

## 1. 核心主线（Backbone）

```text
[Material] --manufactured_by--> [Process]
    |                            |
    | used_for                  | supported_by
    v                            v
[Industry]                    [Evidence]
    |                            |
    | specified_by               | supported_by
    v                            v
[Standard] <--specified_by-- [Tolerance / Inspection]
    |
    |
[Comparison] --informed_by--> [Decision] --leads_to--> [Procurement] --leads_to--> [Service] --leads_to--> [RFQ]
```

## 2. 逐模块实体关系

### 2.1 Material (EXISTS, /grades/)
```text
[Grade 5] --manufactured_by--> [CNC Milling] [5-Axis] [Turning] [Wire EDM] [DMLS] [Welding]
[Grade 5] --specified_by--> [ASTM B265] [ASTM B348] [AMS 4928] [AMS 4911]
[Grade 5] --used_in--> [Aerospace] [Medical] [Semiconductor]
[Grade 5] --compared_with--> [Grade 23] [Grade 2] (comparisons, EXISTS)
[Grade 5] --supported_by--> [Evidence: ti-6al-4v-material-properties] (SCAFFOLD)
```

### 2.2 Process (EXISTS, /processes/)
```text
[5-Axis] --requires--> [Tool Coating] --controlled_by--> [Cutting Parameters] (evidence)
[5-Axis] --capable_of--> [Tolerance] (evidence: 5-axis-tolerances)
[Welding] --requires--> [Inert Gas Shielding] --informed_by--> [Evidence: titanium-welding-data]
```

### 2.3 Evidence (SCAFFOLD -> 接线后 EXISTS, 建议 /evidence/)
```text
[Evidence: grade-5-milling-parameters] --supports--> [Grade 5] --used_in--> [Aerospace]
[Evidence: machining-tolerances] --supports--> [Tolerance] --specified_by--> [Standard]
[Evidence: titanium-surface-roughness-standards] --informs--> [Finish Selection]
```

### 2.4 Decision Layer (PARTIAL)
```text
[Comparison: grade-5-vs-grade-23] --informed_by--> [Evidence] --leads_to--> [Decision]
[Decision] --depends_on--> [Material Selection] [Process Selection] [DFM]
[Decision] --leads_to--> [Tolerance] [Inspection]
```

### 2.5 Procurement (SCAFFOLD -> 接线后 EXISTS, 建议 /procurement/)
```text
[Decision] --leads_to--> [Procurement: rfq-checklist] [material-certification] [lead-time] [cmm-inspection]
[Procurement] --certified_by--> [AS9100D] [ISO 9001] [NADCAP]
[Procurement] --leads_to--> [Service] [Supplier]
```

### 2.6 Service / RFQ (MISSING)
```text
[Procurement] --leads_to--> [Service: CNC Manufacturing] --leads_to--> [RFQ]
[RFQ] --feeds_back_to--> [Technical Knowledge] (参数/公差回流)
```

### 2.7 Supporting entities
```text
[Industry] --requires--> [Application] (SCAFFOLD)
[Industry] --specified_by--> [Standard]
[Application] --used_for--> [Component] --manufactured_by--> [Case] (SCAFFOLD)
[Case] --evidences--> [Capability] --certified_by--> [Certification]
```

## 3. 关系命名建议（供 schema/link 复用）

| 关系 | 方向 | 语义 | 复用点 |
|---|---|---|---|
| used_for | Entity -> Industry/Application | 用途 | 卡片/related 区块 |
| manufactured_by | Material -> Process | 加工 | processes 页 |
| specified_by | Entity -> Standard | 规范 | standards 页 |
| supported_by | Entity -> Evidence | 证据 | evidence 接线后 |
| compared_with | Entity -> Comparison | 对比 | comparisons |
| informed_by | Evidence -> Decision | 依据 | decision 层 |
| leads_to | Decision -> Procurement -> Service -> RFQ | 漏斗 | 商业链路 |
| requires | Process -> Tooling/Inspection/Tolerance | 前置 | DFM/质检 |
| certified_by | Entity -> Certification | 认证 | procurement/cases |

## 4. 关键缺口（图谱层面）

- Evidence 实体：存在但无节点（接线即补）。
- Tolerance / Inspection：目前是 evidence/procurement 内的属性，建议提升为可链接实体（evidence:tolerances、procurement:cmm-inspection）。
- Service / Supplier / RFQ：完全缺失，需商业层补（决策后再建）。
- Equipment：被宣称但无实体，需在补 content 或移除两者间决策。

## 5. 图谱落地原则

- 每个关系都要有可点击落点（URL），否则不算关系。
- evidence/procurement/cases 接线后，frontmatter 里已编码的 relation 将自动生成 659 条潜在内链（见 internal-link-graph.csv）。
- 优先打通主线 backbone，再补支线。
