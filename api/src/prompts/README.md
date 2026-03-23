# Aistro Agent Prompts

从 AIGNE Studio 备份 (`aigne-studio-prompts/`) 中提取的 AI Agent system prompts。
提取日期: 2026-03-23

## 文件清单

### 已提取的 Prompt (对应迁移计划 §4.1 的 agent)

| 文件 | 迁移计划 Agent | 优先级 | 说明 |
|------|---------------|--------|------|
| `question.md` | config.templates.question | P0 | 通用问答 (Susan Miller 占星师人设) |
| `predict.md` | config.templates.predict | P0 | 运势报告 (含 7 个子 prompt) |
| `natal.md` | config.templates.natal | P0 | 本命星盘解读 (含 5 个子 prompt) |
| `synastry.md` | config.templates.synastry | P0 | 合盘配对分析 (含 5 个子 prompt + score) |
| `translate.md` | config.templates.translate | P0 | 翻译 |
| `guide.md` | config.templates.guide | P1 | 新用户引导 |
| `suggest-questions.md` | config.templates.suggestQuestions | P1 | 推荐后续问题 (Chat 场景) |
| `guide-suggest-questions.md` | (Guide 子 agent) | P1 | 推荐后续问题 (Guide 场景) |
| `moon-phase.md` | (Chat 子流程) | P0 | 月相报告 (含 2 个子 prompt) |
| `chat-context-router.md` | (Chat 路由) | P0 | 问题路由逻辑 |

### 备份中未找到的 Agent (需重新编写)

| 迁移计划 Agent | 优先级 | 建议 |
|---------------|--------|------|
| config.templates.sessionChat | P0 | Chat Main 是 function 编排，无独立 prompt；复用 question.md |
| config.templates.summary | P0 | 需新写：报告摘要 prompt |
| config.templates.longTermMemory | P1 | 需新写：长期记忆管理 prompt |
| config.templates.aiUpdateUserInfo | P2 | 需新写：AI 自动更新用户资料 prompt |
| config.templates.snakeYear | P2 | 需新写：蛇年运势 prompt |
| config.templates.dragonYear | P2 | 需新写：龙年运势 prompt |
| config.templates.newYear | P2 | 需新写：新年运势 prompt |

### 辅助 Agent (非 AI prompt，为 function 类型工具)

这些 agent 的逻辑已记录在对应的报告 prompt 文件的"编排逻辑"部分：

| 备份 Agent | ID | 说明 |
|-----------|-----|------|
| I18N Translations | 20240725204148-1TTAhS | 静态翻译字典 (代码中硬编码) |
| Constants | 20240725194641-eEuGqV | 常量配置 (icons, blender, points 等) |
| Get Horoscope | 20240725221556-qVD9xO | 星盘计算 (bundled JS library) |
| Get Moon Phase | 20240726014107-1UuNIh | 月相计算 (bundled JS library) |
| Get User Info | 20240726003538-75ESfi | 调用 /api/user 获取用户信息 |
| Get Blender Url | 20240725215243-bLhMBj | 生成 Blender 图片 URL (迁移后移除) |
| Add Points | 20240821083914-tWbFLC | 调用积分组件 |
| Get Feedback Status | 20240814231925-jc2lTA | 获取反馈状态 |
| Get Report Section Status | 20240812231531-Kamgid | 获取报告段落锁定/购买状态 |
| RunAgentAndTranslateToLanguage | 20240906104812-9Qq3Ch | 运行子 agent 后翻译结果 |
| Query remaining count | 20240905121327-0RFoCR | 查询每日剩余对话次数 |
