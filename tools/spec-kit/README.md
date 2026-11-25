# Spec Kit 项目内隔离环境

本仓库使用项目内隔离的 [Spec Kit](https://github.com/github/spec-kit) 工具链，避免污染全局 `specify` 命令，确保团队成员与 CI 环境版本一致。

## 版本与目录约定

- **固定版本**：`specify-cli==1.2.5`（声明于 `tools/spec-kit/requirements.txt`）
- **本地虚拟环境**：`.venv-speckit/`（已在 `.gitignore` 中忽略，不入库）
- **项目包装脚本**：`./specifyw`（始终调用当前仓库 `.venv-speckit/bin/specify`）
- **入库资产**：`.specify/`、`.agents/skills/`、`.claude/skills/`、`specifyw`、`tools/spec-kit/`
- **默认集成**：已安装 `claude` 与 `codex` 双集成（关闭 `--events false`），默认激活 `codex`。如需切换为 Claude Code：
  ```bash
  ./specifyw integration use claude
  ```

## 新检出仓库重建步骤

前置要求：本机已安装 Python 3.11+ 与 `uv`。在仓库根目录执行：

```bash
uv venv --no-cache --no-python-downloads --python '>=3.11' .venv-speckit
uv pip install --no-cache --python .venv-speckit/bin/python -r tools/spec-kit/requirements.txt
chmod +x specifyw .specify/scripts/bash/*.sh
```

验证环境就绪：

```bash
./specifyw version
./specifyw integration status
```

## 常用工作流命令（Agent Skills）

在 Codex / Claude Code 中按流程使用以下 Spec Kit 技能（对应 `.agents/skills/speckit-*` 与 `.claude/skills/speckit-*`）：

| 阶段 / 技能 | 用途说明 |
| --- | --- |
| `speckit-constitution` | 建立或更新项目宪章（`.specify/memory/constitution.md`），定义架构原则与工程红线 |
| `speckit-specify` | 从自然语言需求生成或更新功能规格说明书（`spec.md`） |
| `speckit-clarify` | 针对当前功能规格中的模糊点发起定向澄清，并将结论写回 `spec.md` |
| `speckit-plan` | 基于规格说明生成技术实现方案与设计产物（`plan.md` 等） |
| `speckit-tasks` | 基于方案拆解可执行的、按依赖排序的任务清单（`tasks.md`） |
| `speckit-analyze` | 对 `spec.md`、`plan.md`、`tasks.md` 执行非破坏性跨产物一致性与质量检查 |
| `speckit-implement` | 按 `tasks.md` 逐步执行实现计划 |
| `speckit-converge` | 对照规格与代码现状评估未完成项，并向 `tasks.md` 追加剩余任务以收敛实现 |

## 常用 CLI 命令

```bash
./specifyw version                 # 查看 specify-cli 版本与模板信息
./specifyw integration status      # 查看已安装与当前激活的集成
./specifyw integration use codex   # 切换默认集成为 Codex
./specifyw integration use claude  # 切换默认集成为 Claude Code
```
