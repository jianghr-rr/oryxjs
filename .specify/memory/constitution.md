# oryxjs Constitution

`oryxjs` 是一个 **TypeScript 原生、可私有部署的 AI Agent Harness OS**。它在核心概念、协议与目录规范上与 OryxOS 保持对齐（`AGENT.md` 定义 Agent、`.oryxjs/` 工作区、`MEMORY.md` 长期记忆、MCP 工具接入、统一 ReAct 内核），采用更轻量的 JS/TS 全栈架构落地。

## Core Principles

### I. 单机内核优先，范围明确（YAGNI）

首阶段开发**必须（MUST）**聚焦可完整运行、可验证的单机运行内核（Provider、ReAct、Memory、Tool、Web Service 五大核心能力及基础 Web 管理台查看与运行控制）。

- 具体业务场景（如天气查询、日报生成等）**必须（MUST）**通过 `AGENT.md` 指令与工具组合表达，**严禁（MUST NOT）**写死在通用运行时引擎中。
- 分布式协调、多租户、SSO、容器/microVM 强隔离、复杂工作流编排均不属于首阶段范围，**严禁（MUST NOT）**在当前任务中提前引入或预埋复杂度。
- **理由**：防止过早抽象与范围蔓延，确保单机内核以最小复杂度跑通端到端闭环。

### II. ReAct 与工具执行由 oryxjs 统一掌控

核心 ReAct 推理循环与工具调度**必须（MUST）**由 `oryxjs` 自实现，**严禁（MUST NOT）**引入接管控制流的重型 Agent 编排框架（如 LangChain、LangGraph 等）。

- 调用底层模型 SDK（如 Vercel AI SDK 或厂商官方 SDK）时，**必须（MUST）**关闭 SDK 内置的自动工具执行（auto tool execution），将其严格限定为协议适配与 Schema 转换层，杜绝同一工具被重复执行。
- ReAct 循环**必须（MUST）**具备明确的终止条件与可配置的最大迭代上限，并在每轮调用中保证 `tool-call ID` 与工具结果消息的配对完整性。
- **理由**：保证执行确定性、可观测性与安全拦截点的唯一性。

### III. 能力职责分离，契约与接口优先

系统按 `pnpm + Turborepo` Monorepo 组织为 `packages/*`（核心内核与能力包）与 `apps/*`（应用接入层），各层**必须（MUST）**通过显式接口与契约解耦。

- Provider **必须（MUST）**按名称显式映射模型配置，禁止隐式回退到未声明的默认模型。
- 内置工具与 MCP 工具**必须（MUST）**统一实现同一套 Tool 契约。
- `packages/*`（如 `core`、`provider`、`memory`、`tool`、`storage`）之间**必须（MUST）**通过清晰接口依赖，**严禁（MUST NOT）**循环依赖，且**严禁（MUST NOT）**反向依赖 React 或 TanStack。
- `apps/web`（TanStack Start）、`apps/cli` 与定时任务（Scheduler）**必须（MUST）**复用同一条 Agent 执行内核，仅作为接入层，**严禁（MUST NOT）**复制推理循环或工具调度逻辑。
- **理由**：确保内核可独立测试与复用，避免多入口行为分叉。

### IV. 工具操作受控，安全与密钥零容忍

所有文件读写、Shell 执行、HTTP 请求与外部通知操作在产生任何副作用前，**必须（MUST）**先通过应用层 `Sandbox` 白名单校验与 Zod 参数校验。

- 被 `Sandbox` 或参数校验拒绝的操作**必须（MUST）**立即中止且不产生任何副作用。
- Shell 命令调用**严禁（MUST NOT）**通过拼接字符串并启用 `shell: true` 执行，**必须（MUST）**采用参数数组安全传参。
- **严禁（MUST NOT）**在代码、配置模板、测试夹具或提交历史中硬编码明文密钥；任何密钥**严禁（MUST NOT）**进入 Prompt、结构化日志、审计表或前端响应。
- **理由**：Agent 具备自主调用工具的能力，最小权限与密钥零泄漏是私有部署的底线。

### V. 分阶段落实审计，持久化结果可恢复

核心运行状态与关键调用链**必须（MUST）**落盘持久化，并在进程重启后可完整恢复。

- 核心阶段**必须（MUST）**持久化 Session 状态、长期记忆（`MEMORY.md`）以及 `llm_calls` / `tool_invocations` 审计表。
- 写入审计记录前**必须（MUST）**对敏感参数执行脱敏，**严禁（MUST NOT）**伪造 token 用量、耗时或成功状态。
- 本地 SQLite 表结构变更**必须（MUST）**通过显式、可追踪的迁移脚本管理，**严禁（MUST NOT）**在运行时隐式同步或静默改写表结构。
- **理由**：确保排障可追溯、行为可审计、状态不因重启丢失。

### VI. 每个用户故事都可演示、可检查

任何用户故事或任务**严禁（MUST NOT）**仅以“编译通过 / 类型检查通过”作为验收依据。

- 每个用户故事**必须（MUST）**提供可复现的验证方式（集成测试、CLI 命令或实际 HTTP / Web 管理台操作）。
- 验收记录**必须（MUST）**明确区分基于 Mock Provider 的自动化验证与真实模型 / 真实 MCP Server 的联调结果。
- **理由**：避免“纸面通过”导致的集成断层与隐性缺陷。

### VII. 规格、方案、任务与实现保持一致

项目采用 Spec-Driven Development 治理：`spec.md` 定义行为与验收，`plan.md` 定义技术方案与边界，`tasks.md` 定义可执行工作项。

- 当实现过程中发现公共契约、数据模型或功能范围需要调整时，**必须（MUST）**先更新对应 `spec.md` 与 `plan.md` 并同步 `tasks.md`，**严禁（MUST NOT）**为了迁就已写代码而悄悄改写目标行为。
- **理由**：保持规格作为单一事实来源（Single Source of Truth），防止文档与代码漂移。

## Architecture & Technology Stack Constraints

- **运行时与模块规范**：**必须（MUST）**使用 **Node.js >= 22.13** 与全仓 ESM（`"type": "module"`）。`packages/*` 面向 Node.js 服务端运行，不强求兼容 Browser 或 Edge 运行时，避免牺牲文件系统、Shell、SQLite 与 MCP stdio 能力。
- **包管理与 Monorepo**：**必须（MUST）**使用 **pnpm**（在根 `package.json` 锁定 `packageManager`，通过 `allowBuilds` 显式管控原生依赖安装脚本，**严禁（MUST NOT）**使用 npm 或 yarn），配合 **Turborepo** 统一编排 `build`、`lint`、`typecheck` 与 `test`。
- **TypeScript 严格性**：**必须（MUST）**开启 `strict: true` 与 `noUncheckedIndexedAccess: true`，**严禁（MUST NOT）**隐式 `any` 与未处理的悬空 Promise（floating promises）。所有外部输入（HTTP 请求、Tool 参数、配置文件、`AGENT.md` frontmatter 等）**必须（MUST）**使用 **Zod** 进行运行时校验并派生 TypeScript 类型。
- **Web 应用层**：`apps/web` **必须（MUST）**基于 **TanStack Start**（React 19 + TanStack Router / Query + Vite + Tailwind CSS v4）构建，承担 Web 管理台与 HTTP/REST 接入职责。
- **存储与上下文透传**：持久化**必须（MUST）**采用本地 SQLite（配合显式迁移脚本）与工作区文件系统（`.oryxjs/`）；跨异步调用的请求上下文（如 `traceId`、`ProfileContext`）**必须（MUST）**使用 Node.js 原生 `AsyncLocalStorage` 透传。
- **测试、代码规范与可观测性**：
  - 单元测试与集成测试（`test:integration`）**必须（MUST）**统一使用 **Vitest**。
  - 格式化、Lint、import 排序与基础安全规则**必须（MUST）**统一使用 **Biome**（**严禁（MUST NOT）**混用 ESLint 或 Prettier），配合 `tsc --noEmit` 作为严格类型门禁。
  - 运行时日志**必须（MUST）**使用结构化日志库（如 `pino`），业务代码**必须（MUST）**通过 Biome 规则禁止裸 `console.log`。

## Development Workflow & Quality Gates

- **强制 Spec-First 流程**：任何功能开发**必须（MUST）**按 `speckit-constitution → speckit-specify → speckit-clarify → speckit-plan → speckit-tasks → speckit-analyze → speckit-implement` 顺序推进。存在未解决的宪章冲突或阻断性需求歧义时，**严禁（MUST NOT）**进入编码实现。
- **分支与 PR 合入规范**：`main` 分支采用 PR-only 保护策略（参见 `docs/Contributing.md`），提交信息与 PR 标题**必须（MUST）**遵循 Conventional Commits。
- **本地与 CI 必过门禁**：
  - 本地 Git Hooks（`.githooks/` / `lefthook.yml`）执行防密钥泄漏、文件卫生、Conventional Commits 与禁止直推 `main` 检查。
  - 工程骨架初始化完成后，本地门禁与 GitHub Actions CI **必须（MUST）**强制执行 `pnpm verify`（按序执行 `biome check` → `typecheck` → `test` → `audit`）与 `pnpm build`，任一失败阻断合入。
- **测试覆盖要求**：核心路径（Provider 显式路由、ReAct 循环终止与防重复工具调用、Sandbox 拒绝无副作用、记忆写后可读、进程重启状态恢复）**必须（MUST）**具备自动化测试覆盖；鼓励关键逻辑先编写验收/单元测试再实现，不要求为纯静态展示代码强凑覆盖率指标。

## Governance

- **最高效力**：本宪章高于仓库内其他口头约定与局部实践；任何 `spec.md`、`plan.md`、`tasks.md` 及 PR 评审**必须（MUST）**核验其与本宪章的一致性，偏离宪章的设计复杂度**必须（MUST）**在方案文档中给出明确理由或先修订宪章。
- **修订流程**：对本宪章的任何修订**必须（MUST）**通过独立分支与 Pull Request 提交，更新版本号与修订日期；若修订导致既有规范或架构失效，**必须（MUST）**附带影响范围说明与迁移计划，经维护者批准后方可合入 `main`。
- **语义化版本规则**：
  - **MAJOR**：移除、放宽或向后不兼容地重定义核心原则或架构硬约束。
  - **MINOR**：新增核心原则、新增治理章节或实质性扩展现有约束。
  - **PATCH**：措辞澄清、排版修正或不影响语义的细节完善。
- **日常执行指引**：本地开发、Git Hooks 与 PR 操作细则参见 `docs/Contributing.md`，Spec Kit 工具链使用参见 `tools/spec-kit/README.md`。

**Version**: 1.0.0 | **Ratified**: 2026-11-25 | **Last Amended**: 2026-11-25
