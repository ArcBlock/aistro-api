# Aistro Agent Prompts

从 AIGNE Studio 备份 (`aigne-studio-prompts/`) 中提取的 AI Agent system prompts。
提取日期: 2026-03-23

## 目录结构

每个 .md 文件对应一次 `model.invoke()` 调用，按使用场景分类：

### chat/ — 聊天场景（流式输出）

| 文件 | 说明 |
|------|------|
| `question.md` | 通用问答 (Susan Miller 占星师人设) |
| `guide.md` | 新用户引导 |
| `context-router.md` | 问题路由参考文档（实际路由由 TypeScript 实现） |

### report/ — 报告生成（批量调用，拼装 JSON）

| 文件 | 说明 |
|------|------|
| `predict-title.md` | 运势报告标题 |
| `predict-summary.md` | 运势报告摘要 |
| `predict-overview.md` | 运势概述（按维度） |
| `predict-houses.md` | 宫位解读（按维度） |
| `predict-strengths.md` | 优势分析（按维度） |
| `predict-challenges.md` | 挑战分析（按维度） |
| `natal-title.md` | 本命报告标题 |
| `natal-description.md` | 本命星体描述 |
| `natal-gift.md` | 本命星体机遇 |
| `natal-challenge.md` | 本命星体挑战 |
| `synastry-title.md` | 合盘报告标题 |
| `synastry-section-title.md` | 合盘段落标题 |
| `synastry-description.md` | 合盘占星解释 |
| `synastry-similarity.md` | 合盘相似之处 |
| `synastry-different.md` | 合盘差异之处 |
| `moon-phase-summary.md` | 月相概述 |
| `moon-phase-retrograde.md` | 逆行解读 |

### util/ — 工具调用（同步取文本）

| 文件 | 说明 |
|------|------|
| `translate.md` | 翻译 |
| `summary.md` | 摘要 |
| `suggest-questions.md` | 推荐后续问题 (Chat 场景) |
| `guide-suggest-questions.md` | 推荐后续问题 (Guide 场景) |

## 模板变量语法

所有 prompt 使用 `{{variable}}` 语法。`$history` 是特殊变量，在 `ai/invoke.ts` 中处理为格式化对话历史。

## 仍需编写的 Prompt

| 文件 | 优先级 | 说明 |
|------|--------|------|
| `util/long-term-memory.md` | P1 | 长期记忆管理 |
| `util/ai-update-user-info.md` | P2 | 从对话中提取出生信息 |
| `report/fortune-snake-year.md` | P2 | 蛇年运势 |
| `report/fortune-dragon-year.md` | P2 | 龙年运势 |
| `report/fortune-new-year.md` | P2 | 新年运势 |
