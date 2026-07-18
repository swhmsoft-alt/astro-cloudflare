## AI Development System

This repo is built to be operated by AI coding agents. Stay **on-system**.

**Read before editing UI/design:**

- `system/globals/` — canonical design knowledge (colors, typography, spacing,
  interaction, imagery, effects, responsiveness, accessibility, components,
  patterns). One source of truth for all design decisions; `components.md` +
  `patterns.md` unify the component library.
- `src/config/site.config.ts` — bring-your-own-brand input; translate it into
  tokens, never inline.
- `src/registry.json` — machine-readable catalog of components, sections, pages.

**Architecture (three tiers):** Components (`src/components/ui/**`) → Sections
(`src/components/sections/**`, barrel `src/components/sections/index.ts`) → Pages
(`src/pages/**`). Build pages by composing sections; build sections from components.

**Hard rules:**

- Colors/spacing/typography come from design tokens only. No hardcoded hex/rgb and
  no Tailwind palette utilities (`bg-blue-500`). Use semantic tokens
  (`bg-primary`, `text-foreground`, `var(--muted-foreground)`).
- Dark mode must keep working (class strategy). Never hand-invert colors.
- Preserve i18n (en default + `/id/`), Cloudflare Pages, SEO/OG/RSS/sitemap,
  Pagefind, and Starlight docs.
- New routes ship in both locales: `src/pages/x.astro` **and** `src/pages/[locale]/x.astro`.

---

### Mode Operation Rules（模式操作规则）

> **优先级**：本规则与上述“Hard rules”同等重要，所有会话必须遵守。

#### 计划模式（Plan Mode）—— 只读调研与方案设计
**适用场景**：需求分析、问题诊断、技术选型、架构讨论、任务拆解、用户需求澄清。

**允许的行为**：
- 阅读、搜索、查看任何代码、配置文件、文档（`.astro`, `.ts`, `.json`, `system/`, `src/` 等）。
- 运行只读命令（`grep`, `ls`, `cat`, `tree`, `git log --stat`, `pnpm list` 等）。
- 输出问题分析、调研结论、架构草案、实施步骤清单（**以自然语言描述**，禁止使用代码块）。
- 向用户提问，收集信息，生成示意图或伪代码（仅作为回答内容，**不得写入项目文件**）。
- 若用户要求将临时方案保存为文档，必须放在 `docs/plans/` 目录，文件名含 `-plan` 后缀，且**内容不得包含可直接应用的代码**（只能描述性文本）。

**严格禁止的行为（违反即视为违规）**：
- ❌ **输出任何可执行的代码块、补丁、diff 或具体的文件修改建议**（即使不实际写入文件，只要在回答中给出修改代码，即属于“输出修改”）。
- ❌ 修改、新建、删除或重命名任何项目文件（包括源代码、配置、样式、元数据等）。
- ❌ 运行任何会产生副作用的命令（如 `pnpm install`, `git commit`, `pnpm build`, `pnpm lint --fix`, `rm -rf` 等）。
- ❌ 对 `src/config/site.config.ts`、`src/registry.json`、`package.json`、`astro.config.*` 等做任何变更。
- ❌ 要求用户手动复制粘贴补丁（因为间接输出修改同样违规）。

> 若用户要求在计划模式下执行上述操作，助手必须拒绝并提示：“此操作属于执行行为，请先切换至‘执行模式’（界面切换或口头明确）后再进行。”

#### 执行模式（Execution Mode）—— 实际变更与操作
**适用场景**：实施已确认的方案，进行代码修改、配置更新、命令运行等。

**允许的行为**：
- 所有计划模式下允许的只读操作。
- **修改、新增、删除项目文件**（任何类型）。
- **运行任何副作用命令**（构建、安装、测试、部署、git 提交等）。
- 将计划阶段生成的方案转换为实际代码，并写入文件。

**注意事项**：
- 执行前应简要列出变更清单（例如“将修改 `src/pages/index.astro`，更新 `site.config.ts` 的 title”），供用户确认（除非已授权自动执行）。
- 若执行中需调整计划，必须**暂停并切回计划模式**重新调研，待新方案确认后再切回执行模式。

---

#### 模式切换与验证
1. 用户提出需求 → 默认进入**计划模式**（调研、提问、制定方案）。
2. 方案确认后 → 通过界面或明确指令切换至**执行模式**。
3. 执行完成后 → 切回计划模式进行验证和下一步规划。

**验证要求**：任何执行模式下的变更，在提交前必须通过 `pnpm build`、`pnpm lint`（含 `pnpm check:kpis`）、`pnpm run lint:css`。`check:kpis` 是设计规范的真源，违规会导致 CI 失败。

**违规处理**：若 AI 在计划模式下输出任何可执行代码或进行了文件变更，应立即回滚并道歉，同时记录本次违规。

---

**Verify before done:** `pnpm build`, `pnpm lint` (includes `pnpm check:kpis`),
`pnpm run lint:css`. `check:kpis` is the source of truth for design conventions and
fails CI on off-system edits.

**Portable self-audit prompts:** `system/prompts/` (usable in any chat tool).