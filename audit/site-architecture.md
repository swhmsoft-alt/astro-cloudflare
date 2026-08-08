# Site Architecture  站点真实结构

## 1. 站点树（基于 src/pages 真实路由）

```text
Homepage (/) 
 Knowledge Hubs
    /grades/            (materials, 14)
    /processes/         (processes, 15)
    /industries/        (industries, 8 + 9 行业子页)
    /standards/         (standards, 12)
    /finishes/          (surfaceFinishes, 7)
    /select/            (material-selection, 8)
    /corrosion/         (corrosion, 6)
    /failures/          (failure-analysis, 6)
    /heat-treatment/    (heat-treatment, 6)
    /compare/           (comparisons, 16)
    /guides/            (guides, 11)
    /tools/             (grade-comparison, hardness-converter)
    /faq/               (faqs)
 Blog
    /blog/              (3 篇)
 Service / Commercial
    /solutions/ (+ /systems/5axis|additive|turn-mill)
    /pricing/
    /contact/
    /about/
 Legal
    /privacy/
    /terms/
 Docs (Starlight)
    /docs/
 System
    /robots.txt, /sitemap-index.xml, /rss.xml, /llms.txt, /og/*
 [locale]/...  (16 语言镜像)
```

## 2. 关键结构发现

- **孤立内容（无 URL）**：evidence(30)、procurement(25)、cases(15)、applications(4)、equipment(0)、RFQ(0)。这些是存在内容但无节点的孤立资产。
- **Hub 已建但空/弱**：`/tools/` 有 grade-comparison/hardness-converter；`equipment` 无 hub。
- **多语言镜像**：每个路由都有 16 语言变体，其中 13 种语言无本地化内容（见 i18n-reality）。

## 3. 点击深度 / 链接质量（推断，需构建验证）

- Hub 页(1 click from home) 链接到 detail(2 clicks) ，结构健康。
- evidence/procurement/cases 若被 content 的 relation 引用会产生指向不存在 URL的死链候选。
- 高价值内容（evidence/procurement）内部链接权重为 0（不可见）。

## 4. 限制

- click depth / in-out link 计数需渲染后抓取；此处为基于路由树的推断。
