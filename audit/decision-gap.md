# Decision Gap Audit  titanium.blog

> 目标：沿真实采购/工程决策链，判断网站在哪些节点有知识资产、哪些节点断裂。不评文章数量，只评决策支撑能力。

## 1. 决策链节点 vs 站内资产

```text
Problem  Requirement  Material Selection  Process Selection  Design/DFM  Tolerance  Inspection  Procurement  Supplier  RFQ
```

| 节点 | 站内资产（集合/路由） | 状态 |
|---|---|---|
| Problem/Failure | failure-analysis(/failures/ 6)、corrosion(/corrosion/ 6) | 🟢 覆盖 |
| Requirement | material-selection(/select/ 8)、applications(4，未渲染) | 🟡 部分 |
| Material Selection | materials(/grades/ 14)、guides、comparisons(/compare/ 16) | 🟢 强 |
| Process Selection | processes(/processes/ 15)、guides | 🟢 强 |
| Design/DFM | guides(dfm-titanium-guide)、procurement(drawing-best-practices 未渲染) | 🟡 部分 |
| Tolerance | processes.tolerances、evidence(machining-tolerances 未渲染) | 🟡 部分 |
| Inspection | procurement(cmm-inspection 等 未渲染)、cases | 🟡 部分 |
| **Procurement** | **procurement(25，全部未渲染)** | 🔴 断裂 |
| **Supplier** | 无（无供应商/制造能力实体页面） | 🔴 断裂 |
| **RFQ** | **无任何 rfq 页面/路由** | 🔴 完全缺失 |

## 2. 三个真正的断裂点

1. **Procurement 断裂**：`procurement` 集合有 25 个高质量 RFQ 准备/认证/交期/检验内容，但**零页面渲染**  采购决策者无法访问。
2. **RFQ / 商业转化断裂**：KnowledgeQuote 漏斗的最后一步 RFQ 在代码库中不存在（历史 build 日志曾有 `/rfq/request-quote`、`/rfq/upload-drawing`，当前源码已无）。采购决策做到一半，无法落地成询价。
3. **Supplier/制造能力断裂**：没有任何供应商资质、产能、设备、案例的权威页面（cases 15 个未渲染；solutions 偏营销文案）。

## 3. 哪些内容真正帮工程师/采购做决定？

**能直接支持决策的（已渲染）**：
- `comparisons/*`（grade-5-vs-grade-23 等）：有 quickAnswer + 决策框架（`if medical  Grade 23`），直接回答选哪个。
- `material-selection/*`、`select/`：材料选择的决策入口。
- `guides/dfm-titanium-guide`：DFM 决策。

**能支持决策但完全不可见（未渲染）**：
- `procurement/*`（RFQ checklist、MOQ、lead-time、certification、inspection report 等 25 篇）。
- `evidence/*`（tolerance、cutting parameters、surface roughness 等 30 篇）。
- `cases/*`（16 篇制造案例，含 tolerance/leadTime/keyMetrics）。

## 4. 关键洞察

> 网站最像制造证据与采购决策的内容，恰恰是唯一没有被接线渲染的内容。
> KnowledgeDecisionServiceRFQ 漏斗：**前 2 段很强，后 3 段（Tolerance/Inspection/Procurement/RFQ）断裂。**

## 5. 限制

- 节点有无资产基于集合路由映射（scan 结果）与抽样阅读，非逐个页面语义打分。
