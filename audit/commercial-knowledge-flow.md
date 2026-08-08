# Commercial Knowledge Flow  站内商业知识漏斗

> 判断 Knowledge  Decision  Service  RFQ 的端到端是否打通。

## 现状

```text
Knowledge (grades/processes/standards/finishes/select)  -->  强
        |
Decision (comparisons + material-selection)  -->  强
        |
Tolerance / Inspection (evidence + procurement, 未渲染)  -->  断裂
        |
Procurement (25 篇, 未渲染)  -->  断裂
        |
Service (solutions/systems, 营销文案)  -->  弱
        |
RFQ (无任何路由/页面)  -->  完全缺失
```

## 逐环节判断

1. **Knowledge  Decision**：打通（comparisons 的 quickAnswer + 决策框架直接回答选型）。
2. **Decision  Tolerance/Inspection**：未打通（evidence 30 篇 + procurement 的 cmm-inspection/quality 未渲染）。
3. **Procurement  Supplier**：未打通（无供应商/产能权威页面）。
4. **Supplier  RFQ**：断裂（RFQ 路由在源码中不存在）。
5. **Knowledge  Service**：弱（solutions 偏营销，无实体/证据支撑）。

## 结论

> 前端知识漏斗强、后端商业漏斗断裂。最高价值路径读资料  选型  公差/检验  询价在 Tolerance/Procurement/RFQ 三处断掉。

## 限制

- 基于集合路由映射 + 抽样阅读；服务/营销层未逐页语义评估。
