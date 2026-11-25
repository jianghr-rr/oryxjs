# Contributing

## Branch & PR Rules (`main` 保护策略)

`main` 分支采用 **PR-only** 合入策略，禁止直接向 `main` 推送或强推：

1. 从 `main` 切出主题分支开发（如 `feat/<name>`、`fix/<name>`、`docs/<name>`、`chore/<name>`）；
2. 推送分支并提交 Pull Request（自动加载 `.github/PULL_REQUEST_TEMPLATE.md`）；
3. PR 标题与提交信息需符合 **Conventional Commits**，并通过全部必过 CI 检查（`Secret Scan`、`Repo Hygiene & Commit Lint`）；
4. 推荐在 GitHub 仓库设置中开启 **Squash and merge** 并勾选 **Automatically delete head branches**，保持线性提交历史。

> 首次向空仓库初始化 `main` 分支时，可使用一次性放行开关：
> `ALLOW_MAIN_PUSH=1 git push -u origin main`

### 在 GitHub 远端生效 `main` 分支保护（Ruleset）

仓库内已预置 GitHub Repository Ruleset 配置：[`.github/rulesets/main-protection.json`](../.github/rulesets/main-protection.json)（含禁止删除、禁止强推、线性历史、必须走 PR、必过 `Secret Scan` 与 `Repo Hygiene & Commit Lint`）。

> 提示：请先完成首次 `main` 分支推送并至少触发一次 `Repo Guard` workflow，再应用以下规则。

- **方式一：通过 GitHub CLI 一键下发**
  ```bash
  brew install gh
  gh auth login
  gh api -X POST repos/jianghr-rr/oryxjs/rulesets --input .github/rulesets/main-protection.json
  ```
- **方式二：在 GitHub Web UI 配置**
  进入仓库 `Settings → Rules → Rulesets → New branch ruleset`：
  - **Enforcement status**：`Active`
  - **Target branches**：`Include default branch`（`main`）
  - 勾选 **Restrict deletions**、**Block force pushes**、**Require linear history**
  - 勾选 **Require a pull request before merging**（单人开发时 `Required approvals` 可先设为 `0`，多人协作改为 `1` 并勾选 `Require review from Code Owners` 与 `Dismiss stale pull request approvals`）
  - 勾选 **Require status checks to pass**（勾选 `Require branches to be up to date`），添加 `Secret Scan` 与 `Repo Hygiene & Commit Lint`

## Local Git Hooks

本仓库提供轻量级、语言无关的 Git Hooks 防线（`pre-commit`、`commit-msg`、`pre-push`），支持以下两种启用方式（二选一）：

### 方式一：直接使用 Git 内置 `core.hooksPath`（零依赖，推荐）

```bash
chmod +x .githooks/pre-commit .githooks/commit-msg .githooks/pre-push
git config core.hooksPath .githooks
```

### 方式二：使用 Lefthook

```bash
brew install lefthook
lefthook install
```

### 推荐安装 Gitleaks（增强本地密钥扫描）

未安装 `gitleaks` 时，`pre-commit` 会输出警告并退化为内置正则检查；安装后将自动执行 `gitleaks protect --staged --redact`：

```bash
brew install gitleaks
```

## Hooks 与 CI 检查项

- **`pre-commit`**：
  - 禁止暂存 `.env`、`.env.*`（`.env.example` 除外）、`*.pem`、`*.key` 等敏感文件；
  - 调用 `gitleaks`（或内置正则兜底）拦截疑似密钥；
  - 检查合并冲突标记（`<<<<<<<` / `=======` / `>>>>>>>`）、大于 2MB 的超大文件、以及 JSON / YAML 语法错误。
- **`commit-msg`**：
  - 校验提交信息符合 **Conventional Commits**：`<type>[(<scope>)]: <description>`；
  - 允许的类型：`feat`、`fix`、`docs`、`chore`、`refactor`、`test`、`ci`、`build`、`style`、`perf`。
- **`pre-push`**：
  - 本地拦截直接向 `refs/heads/main` 的推送，提示改走分支 + PR（首次初始化空远端可用 `ALLOW_MAIN_PUSH=1` 放行）。
- **GitHub Actions（`.github/workflows/repo-guard.yml`）**：
  - 对 `main` 分支 `push` 与所有 `pull_request` 执行 `Secret Scan` 与 `Repo Hygiene & Commit Lint`。
  - 项目骨架初始化后，将在 `.githooks/pre-commit`、`lefthook.yml` 与 `repo-guard.yml` 的预留位接入 `pnpm verify` 与 `pnpm build`。
