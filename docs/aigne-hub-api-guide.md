# 在 API 中调用 AIGNE Hub 完整指南

本文档基于 `arcsphere-chat` 项目的实际代码，详细介绍如何在 Express API 中集成和使用 AIGNE Hub 框架构建 AI 对话系统。

## 目录

- [依赖包总览](#依赖包总览)
- [核心概念](#核心概念)
- [1. AIGNEHubChatModel — 模型层](#1-aignehubchatmodel--模型层)
- [2. AIAgent — 单一智能体](#2-aiagent--单一智能体)
- [3. FunctionAgent — 函数智能体](#3-functionagent--函数智能体)
- [4. TeamAgent — 团队编排](#4-teamagent--团队编排)
- [5. Router Agent — 路由分发](#5-router-agent--路由分发)
- [6. AIGNE 引擎 — 运行时容器](#6-aigne-引擎--运行时容器)
- [7. AIGNEHTTPServer — HTTP 流式传输](#7-aignehttpserver--http-流式传输)
- [8. AIGNEObserver — 可观测性](#8-aigneobserver--可观测性)
- [9. PromptBuilder — 提示词管理](#9-promptbuilder--提示词管理)
- [10. 完整接入示例](#10-完整接入示例)
- [11. 进阶模式](#进阶模式)

---

## 依赖包总览

```json
{
  "@aigne/core": "^1.72.0",           // 核心：AIAgent, TeamAgent, FunctionAgent, AIGNE, PromptBuilder
  "@aigne/aigne-hub": "^0.10.16",     // 模型层：AIGNEHubChatModel（统一接入多模型供应商）
  "@aigne/transport": "^0.15.25",     // 传输层：AIGNEHTTPServer（HTTP 流式响应）
  "@aigne/observability-api": "^0.11.14", // 可观测性：AIGNEObserver（链路追踪）
  "@aigne/agentic-memory": "^1.1.6",  // 记忆：Agent 上下文记忆
  "@aigne/default-memory": "^1.4.0"   // 默认记忆实现
}
```

---

## 核心概念

AIGNE 框架的调用层次如下：

```
HTTP Request
  └─ AIGNEHTTPServer          # 处理 HTTP 请求/响应、流式传输
       └─ AIGNE Engine        # 运行时引擎，绑定模型、管理 Agent
            └─ TeamAgent      # 编排多个 skill 的执行流程
                 ├─ AIAgent   # 由 LLM 驱动的智能体
                 ├─ FunctionAgent  # 纯函数逻辑的智能体
                 └─ Router Agent   # 根据输入自动路由到合适的子 Agent
```

---

## 1. AIGNEHubChatModel — 模型层

`AIGNEHubChatModel` 是对多模型供应商的统一封装，通过 AIGNE Hub 代理访问 OpenAI、Google Gemini 等模型。

### 基本用法

```typescript
import { AIGNEHubChatModel } from '@aigne/aigne-hub';

// 创建模型实例（注意 await）
const model = await new AIGNEHubChatModel({
  model: 'google/gemini-3-flash-preview',  // 供应商/模型名 格式
  modelOptions: { temperature: 0.5 },
});
```

### 支持的模型名称格式

模型名遵循 `供应商/模型名` 的命名规范：

| 供应商 | 示例 |
|--------|------|
| OpenAI | `openai/gpt-4.1-nano-2025-04-14`, `openai/gpt-4o-mini` |
| Google | `google/gemini-3-flash-preview`, `google/gemini-2.0-flash-lite` |

### 直接调用模型（不通过 Agent）

在简单场景下，可以直接调用模型进行对话：

```typescript
// 同步调用
const result = await model.invoke({
  messages: [{ role: 'user', content: '你好' }],
});
console.log(result.text); // 模型回复文本

// 流式调用
const stream = await model.invoke(
  { messages: [{ role: 'user', content: '你好' }] },
  { streaming: true }
);

let fullText = '';
for await (const chunk of stream) {
  const text = chunk.delta?.text?.text;
  if (text) {
    fullText += text;
  }
  // 结构化 JSON 输出
  if (chunk.delta?.json) {
    Object.assign(jsonResult, chunk.delta.json);
  }
}
```

> **来源**: [api/src/libs/ai-models.ts](../api/src/libs/ai-models.ts)

### 动态选择模型

项目通过 HTTP 请求头动态指定模型：

```typescript
const modelName = (req.headers['x-model-name'] as string)
  || process.env.MODEL
  || 'google/gemini-3-flash-preview';

const model = await new AIGNEHubChatModel({
  model: modelName,
  modelOptions: { temperature: 0.5 },
});
```

> **来源**: [api/src/routes/chat.ts:82-99](../api/src/routes/chat.ts#L82-L99)

---

## 2. AIAgent — 单一智能体

`AIAgent` 是由 LLM 驱动的核心智能体，用于对话、分析、生成等任务。

### 构造方式一：`new AIAgent()`

当需要作为模块级变量直接导出时使用：

```typescript
import { AIAgent, PromptBuilder } from '@aigne/core';
import { z } from 'zod';
import { join } from 'node:path';

export const chatbot = new AIAgent({
  name: 'chatbot',

  // 输入 schema — 定义 Agent 接收的参数
  inputSchema: z.object({
    currentTab: z.string(),
    openTabs: z.string(),
    language: z.string(),
  }),

  // 输出 schema — 定义 Agent 返回的结构化字段
  outputSchema: z.object({
    transferAgent: z.boolean().optional()
      .describe('Whether to transfer to page agent'),
  }),

  // 系统提示词（从 Markdown 文件加载）
  instructions: PromptBuilder.from({
    path: join(process.env.BLOCKLET_APP_DIR!, '/prompts/arcsphere.md'),
  }),

  inputKey: 'message',        // 用户消息对应的输入字段名
  outputKey: 'text',           // 模型回复文本对应的输出字段名
  structuredStreamMode: true,  // 启用结构化流式输出（同时输出文本和 JSON）

  // 当 transferAgent=true 时不输出文本（将由下游 Agent 接管）
  ignoreTextOfStructuredStreamMode: (output) => output.transferAgent === true,

  // 启用上下文记忆
  useMemoriesFromContext: true,

  // 任务标题（用于 UI 显示）
  taskTitle: ({ language }) =>
    language?.includes('zh') ? '思考中...' : 'Thinking...',
});
```

> **来源**: [api/src/agents/chatbot.ts](../api/src/agents/chatbot.ts)

### 构造方式二：`AIAgent.from()`

当需要异步初始化或在工厂函数中创建时使用：

```typescript
const getKeyWordsAgent = AIAgent.from({
  name: 'get_key_words_from_user_question',
  description: 'Get the key words from the user question',
  instructions: PromptBuilder.from({
    path: join(process.env.BLOCKLET_APP_DIR!, '/prompts/get-keywords-from-question.md'),
  }),
  outputSchema: z.object({
    keywords: z.array(z.string()).describe('The topic of the request'),
  }),
  inputKey: 'message',
});
```

> **来源**: [api/src/agents/search-agent.ts:85-95](../api/src/agents/search-agent.ts#L85-L95)

### 关键配置项说明

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `name` | `string` | Agent 唯一标识，用于路由和日志 |
| `description` | `string` | Agent 功能描述，Router Agent 依据此决定分发 |
| `instructions` | `PromptBuilder` | 系统提示词，定义 Agent 行为 |
| `inputSchema` | `z.ZodObject` | 输入参数的 Zod schema |
| `outputSchema` | `z.ZodObject` | 结构化输出的 Zod schema |
| `inputKey` | `string` | 将用户消息映射到此字段名 |
| `outputKey` | `string` | 将模型文本回复映射到此字段名 |
| `structuredStreamMode` | `boolean` | 是否同时流式输出文本和 JSON |
| `useMemoriesFromContext` | `boolean` | 是否使用上下文记忆 |
| `skills` | `Agent[]` | 子 Agent 列表（可作为工具被调用） |
| `toolChoice` | `AIAgentToolChoice` | 工具选择策略 |
| `taskTitle` | `function` | 动态任务标题，用于 UI 状态展示 |

---

## 3. FunctionAgent — 函数智能体

`FunctionAgent` 用于封装不需要 LLM 的纯逻辑操作（API 调用、数据转换等）。

```typescript
import { FunctionAgent } from '@aigne/core';
import { z } from 'zod';
import axios from 'axios';

export const searchFromGoogle = FunctionAgent.from({
  name: 'search_from_google',
  description: 'Search from Google',

  inputSchema: z.object({
    keywords: z.array(z.string()).describe('The keywords to search'),
  }),

  // process 是核心执行函数
  process: async (input: { keywords: string[] }) => {
    const searchQuery = input.keywords.join(' ');

    // 调用外部 API
    const { data } = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google',
        q: searchQuery,
        api_key: process.env.SERP_API_KEY,
        num: 5,
      },
    });

    return {
      links: data.organic_results,
      resultStr: JSON.stringify(data.organic_results),
    };
  },
});
```

> **来源**: [api/src/agents/search-agent.ts:21-82](../api/src/agents/search-agent.ts#L21-L82)

**FunctionAgent vs AIAgent 的选择**:
- 需要 LLM 推理 → `AIAgent`
- 纯逻辑/API 调用 → `FunctionAgent`
- FunctionAgent 的输出会自动传递给流水线中的下一个 Agent

---

## 4. TeamAgent — 团队编排

`TeamAgent` 将多个 Agent 编排为一个协作流水线，支持顺序执行和并行执行。

### 顺序流水线（Sequential Pipeline）

前一个 Agent 的输出自动成为下一个 Agent 的输入：

```typescript
import { TeamAgent, ProcessMode } from '@aigne/core';

const searchAgent = TeamAgent.from({
  name: 'search_agent',
  description: '调用 Google API 进行搜索',
  includeAllStepsOutput: true,  // 最终输出包含所有步骤的结果

  skills: [
    getKeyWordsAgent,       // Step 1: 从问题中提取关键词 → { keywords }
    searchFromGoogle,       // Step 2: 调用 Google 搜索    → { links, resultStr }
    summarySearchResult,    // Step 3: 总结搜索结果         → { summary }
    reviewResult,           // Step 4: 审查并修正总结       → { text }
  ],
  mode: ProcessMode.sequential,  // 顺序执行
});
```

> **来源**: [api/src/agents/search-agent.ts:122-130](../api/src/agents/search-agent.ts#L122-L130)

**数据流示意**:
```
用户输入 { message: "什么是区块链" }
  → getKeyWordsAgent       → { keywords: ["区块链", "blockchain"] }
  → searchFromGoogle       → { links: [...], resultStr: "..." }
  → summarySearchResult    → { summary: "区块链是..." }
  → reviewResult           → { text: "最终回复内容" }
```

### includeAllStepsOutput

当 `includeAllStepsOutput: true` 时，最终输出是所有步骤输出的合并：

```typescript
// 最终输出包含所有中间步骤的字段
{
  keywords: ["区块链"],
  links: [...],
  resultStr: "...",
  summary: "...",
  text: "最终回复"
}
```

### 在 AIGNE 引擎中内联 TeamAgent

TeamAgent 也可以在引擎配置中直接内联定义，配合自定义中间件和 generator 函数：

```typescript
const engine = new AIGNE({
  model,
  agents: [
    TeamAgent.from({
      includeAllStepsOutput: true,
      name: 'chatbot',
      skills: [
        // Skill 1: 纯函数 — 注入系统上下文
        (input) => ({
          ...input,
          systemContext: [
            'You are an agent created by ArcBlock',
            `The current date is ${new Date().toISOString()}`,
            input.systemContext || '',
          ].join('\n'),
        }),

        // Skill 2: AIAgent — 主对话
        chatbot,

        // Skill 3: Generator 函数 — 条件路由
        async function* transferToRouter(input, options) {
          if (input.transferAgent === true) {
            yield* await options.context.invoke(chatRouterAgent, input, {
              streaming: true,
            });
          }
          return {};
        },
      ],
    }),
  ],
});
```

> **来源**: [api/src/routes/chat.ts:118-146](../api/src/routes/chat.ts#L118-L146)

**三种 Skill 类型**:

| 类型 | 示例 | 说明 |
|------|------|------|
| 普通函数 | `(input) => ({ ...input, extra: 'data' })` | 同步数据转换，无需 LLM |
| AIAgent / FunctionAgent | `chatbot` | Agent 实例 |
| Generator 函数 | `async function* fn(input, options) { ... }` | 支持流式 yield 和条件路由 |

---

## 5. Router Agent — 路由分发

Router Agent 是一种特殊的 AIAgent，根据用户输入自动选择调用哪个子 Agent。

```typescript
import { AIAgent, AIAgentToolChoice, Agent, PromptBuilder } from '@aigne/core';
import { z } from 'zod';

const routerAgent = async (skills: Agent[]) => {
  return AIAgent.from({
    name: 'chat_router_agent',
    description: '结合用户的提问选择合适的 agent 进行对话',

    inputSchema: z.object({
      currentTab: z.string(),
      openTabs: z.string(),
      language: z.string(),
    }),

    instructions: PromptBuilder.from({
      path: join(process.env.BLOCKLET_APP_DIR!, '/prompts/chat-router.md'),
    }),

    // 关键配置：将子 Agent 作为 skills 传入
    skills,

    // 路由模式：LLM 自动判断应该调用哪个 skill
    toolChoice: AIAgentToolChoice.router,

    inputKey: 'message',
  });
};
```

> **来源**: [api/src/agents/router-agent.ts](../api/src/agents/router-agent.ts)

**工作原理**:
1. Router Agent 收到用户消息
2. LLM 根据 `instructions` 和各子 Agent 的 `description` 判断应该调用哪个
3. 自动将消息转发给选中的子 Agent
4. 返回子 Agent 的执行结果

**动态组装 skills**:

```typescript
const agents = [chatAboutCurrentTabAgent];

if (isSearchEnabled) {
  agents.push(await getSearchAgent());
}

const chatRouterAgent = await getChatRouterAgent(agents);
```

> **来源**: [api/src/routes/chat.ts:101-116](../api/src/routes/chat.ts#L101-L116)

---

## 6. AIGNE 引擎 — 运行时容器

`AIGNE` 是整个框架的运行时引擎，负责绑定模型和管理 Agent。

### 基本用法

```typescript
import { AIGNE } from '@aigne/core';

const engine = new AIGNE({
  model,     // AIGNEHubChatModel 实例
  agents: [  // 注册 Agent 列表
    postComposerAgent,
    chatbotTeamAgent,
  ],
});
```

### 直接调用（非 HTTP 场景）

```typescript
const aigne = new AIGNE({ model });
const suggestAgent = await getSearchSuggestAgent();

// invoke 直接返回 Agent 输出
const result = await aigne.invoke(suggestAgent, {
  question: '什么是区块链',
});

console.log(result.keywords); // ["区块链", "分布式", "去中心化"]
```

> **来源**: [api/src/routes/auto-complete.ts:17-19](../api/src/routes/auto-complete.ts#L17-L19)

### 通过 HTTP 服务调用

更常见的方式是配合 `AIGNEHTTPServer` 处理 HTTP 请求（见下一节）。

---

## 7. AIGNEHTTPServer — HTTP 流式传输

`AIGNEHTTPServer` 将 AIGNE 引擎包装为 HTTP 端点，自动处理请求解析和流式响应。

```typescript
import { AIGNEHTTPServer } from '@aigne/transport/http-server/index.js';

const aigneServer = new AIGNEHTTPServer(engine);

router.post('/', auth({}), user(), async (req, res) => {
  return aigneServer.invoke(req, res, {
    // 注入用户上下文（可在 Agent 中通过 context 访问）
    userContext: { userId: userDid },

    // 生命周期钩子
    hooks: {
      // 成功完成时调用
      onEnd: async (result) => {
        // 注入额外数据到输出
        if (result.output) {
          result.output.traceId = result?.context?.id;
          result.output.traceUrl = '...';
        }
        return result; // 必须返回 result
      },

      // 出错时调用
      onError: async (result) => {
        logger.error('chat failed', { error: result.error });
      },
    },
  });
});
```

> **来源**: [api/src/routes/chat.ts:148-225](../api/src/routes/chat.ts#L148-L225)

### hooks 详解

| 钩子 | 触发时机 | 参数 | 返回值 |
|------|---------|------|--------|
| `onEnd` | Agent 执行成功完成 | `{ output, context }` | 修改后的 result（会发送给客户端） |
| `onError` | Agent 执行出错 | `{ error, context }` | 无 |

**onEnd 的典型用途**:
- 注入追踪信息（traceId、traceUrl）
- 记录 token 用量
- 消费积分/计费
- 向客户端注入额外元数据

---

## 8. AIGNEObserver — 可观测性

`AIGNEObserver` 提供链路追踪能力，记录 Agent 执行过程。

```typescript
import { AIGNEObserver } from '@aigne/observability-api';

// 设置追踪数据导出函数
AIGNEObserver.setExportFn(async (messages) => {
  // messages 是 Agent 执行链路的追踪数据
  await call({
    name: OBSERVABILITY_DID,
    method: 'POST',
    path: '/api/trace/tree',
    data: messages.map((x) => ({
      ...x,
      componentId: CHAT_BLOCKLET_DID,
    })),
  });
});

// 设置追踪数据更新函数
AIGNEObserver.setUpdateFn(async (id, data) => {
  await call({
    name: OBSERVABILITY_DID,
    method: 'PATCH',
    path: `/api/trace/tree/${id}`,
    data,
  });
});
```

> **来源**: [api/src/routes/chat.ts:29-66](../api/src/routes/chat.ts#L29-L66)

**追踪数据包含**:
- Agent 名称、ID
- 输入/输出内容
- 执行耗时
- 调用层级关系（树形结构）

---

## 9. PromptBuilder — 提示词管理

`PromptBuilder` 从 Markdown 文件加载系统提示词，支持变量插值。

```typescript
import { PromptBuilder } from '@aigne/core';
import { join } from 'node:path';

const instructions = PromptBuilder.from({
  path: join(process.env.BLOCKLET_APP_DIR!, '/prompts/arcsphere.md'),
});
```

### 提示词文件组织

```
prompts/
├── arcsphere.md              # 主聊天机器人提示词
├── arcsphere.zh.md           # 中文版本
├── chat-router.md            # 路由 Agent 提示词
├── chat-about-tab.md         # 页面上下文 Agent
├── post-composer.md          # 帖子创作 Agent
├── get-keywords-from-question.md  # 关键词提取
├── get-suggest-words.md      # 搜索建议
├── search-summary.md         # 搜索结果总结
├── review-summary.md         # 总结审查
└── review-chat-about-tab.md  # 页面上下文审查
```

### 变量注入

在提示词 Markdown 中使用 `{{变量名}}` 占位符，Agent 的 `inputSchema` 中定义的字段会自动注入：

```markdown
<!-- prompts/arcsphere.md -->
你是一个 AI 助手。

用户当前打开的页面：{{currentTab}}
用户打开的所有标签页：{{openTabs}}
用户语言：{{language}}
```

---

## 10. 完整接入示例

以下是一个从零开始接入 AIGNE Hub 的完整示例：

### 场景：创建一个带搜索能力的聊天 API

#### Step 1: 定义 Agent

```typescript
// agents/my-chatbot.ts
import { AIAgent, PromptBuilder } from '@aigne/core';
import { z } from 'zod';
import { join } from 'node:path';

export const myChatbot = new AIAgent({
  name: 'my_chatbot',
  instructions: PromptBuilder.from({
    path: join(process.env.BLOCKLET_APP_DIR!, '/prompts/my-chatbot.md'),
  }),
  inputSchema: z.object({
    language: z.string(),
  }),
  outputSchema: z.object({
    needSearch: z.boolean().optional()
      .describe('是否需要搜索'),
  }),
  inputKey: 'message',
  outputKey: 'text',
  structuredStreamMode: true,
});
```

#### Step 2: 定义工具 Agent

```typescript
// agents/my-search.ts
import { FunctionAgent } from '@aigne/core';
import { z } from 'zod';

export const mySearchTool = FunctionAgent.from({
  name: 'my_search_tool',
  description: '搜索互联网获取最新信息',
  inputSchema: z.object({
    query: z.string(),
  }),
  process: async (input) => {
    const results = await fetch(`https://api.example.com/search?q=${input.query}`);
    return { searchResults: await results.json() };
  },
});
```

#### Step 3: 组装引擎

```typescript
// routes/my-chat.ts
import { AIGNE, TeamAgent } from '@aigne/core';
import { AIGNEHubChatModel } from '@aigne/aigne-hub';
import { AIGNEHTTPServer } from '@aigne/transport/http-server/index.js';
import { Router } from 'express';
import { myChatbot } from '../agents/my-chatbot';
import { mySearchTool } from '../agents/my-search';

const router = Router();

router.post('/', async (req, res) => {
  // 1. 创建模型
  const model = await new AIGNEHubChatModel({
    model: 'google/gemini-3-flash-preview',
    modelOptions: { temperature: 0.5 },
  });

  // 2. 组装引擎
  const engine = new AIGNE({
    model,
    agents: [
      TeamAgent.from({
        name: 'chat_pipeline',
        includeAllStepsOutput: true,
        skills: [
          myChatbot,
          async function* conditionalSearch(input, options) {
            if (input.needSearch) {
              yield* await options.context.invoke(mySearchTool, input, {
                streaming: true,
              });
            }
            return {};
          },
        ],
      }),
    ],
  });

  // 3. 通过 HTTP 服务处理请求
  const server = new AIGNEHTTPServer(engine);
  return server.invoke(req, res, {
    userContext: { userId: req.user?.did },
    hooks: {
      onEnd: async (result) => {
        console.log('Chat completed');
        return result;
      },
    },
  });
});

export default router;
```

#### Step 4: 挂载路由

```typescript
// routes/index.ts
import { Router } from 'express';
import myChatRouter from './my-chat';

const router = Router();
router.use('/my-chat', myChatRouter);

export default router;
```

---

## 11. 进阶模式

### 模式 A：简单调用（无流式、无 HTTP）

适用于后台任务、自动补全等不需要流式响应的场景：

```typescript
const model = await new AIGNEHubChatModel({
  model: 'openai/gpt-4o-mini',
  modelOptions: { temperature: 0.5 },
});

const aigne = new AIGNE({ model });
const agent = await getMyAgent();
const result = await aigne.invoke(agent, { question: 'Hello' });
// result 直接是 Agent 的输出对象
```

> **参考**: [api/src/routes/auto-complete.ts](../api/src/routes/auto-complete.ts)

### 模式 B：TeamAgent 顺序流水线

适用于多步骤任务（搜索 → 总结 → 审查）：

```typescript
TeamAgent.from({
  name: 'pipeline',
  includeAllStepsOutput: true,
  skills: [step1Agent, step2Agent, step3Agent],
  mode: ProcessMode.sequential,  // 顺序执行
});
```

> **参考**: [api/src/agents/search-agent.ts](../api/src/agents/search-agent.ts)

### 模式 C：Router + 动态 Skills

适用于需要根据配置动态开关能力的场景：

```typescript
const skills = [baseAgent];
if (config.enableSearch) skills.push(searchAgent);
if (config.enablePost) skills.push(postAgent);

const router = AIAgent.from({
  name: 'router',
  skills,
  toolChoice: AIAgentToolChoice.router,
  instructions: routerPrompt,
});
```

> **参考**: [api/src/routes/chat.ts:101-116](../api/src/routes/chat.ts#L101-L116)

### 模式 D：Generator 函数实现条件路由

在 TeamAgent 内部使用 generator 函数实现条件分支：

```typescript
TeamAgent.from({
  skills: [
    mainAgent,
    async function* conditionalBranch(input, options) {
      if (input.shouldTransfer) {
        // 流式转发到另一个 Agent
        yield* await options.context.invoke(otherAgent, input, {
          streaming: true,
        });
      }
      return {};  // 必须返回一个对象
    },
  ],
});
```

> **参考**: [api/src/routes/chat.ts:135-142](../api/src/routes/chat.ts#L135-L142)

### 模式 E：函数中间件注入上下文

在流水线开头使用普通函数注入额外上下文：

```typescript
TeamAgent.from({
  skills: [
    (input) => ({
      ...input,
      systemContext: `当前日期: ${new Date().toISOString()}`,
      extraData: 'some value',
    }),
    mainAgent,  // mainAgent 会收到注入后的输入
  ],
});
```

> **参考**: [api/src/routes/chat.ts:126-133](../api/src/routes/chat.ts#L126-L133)

---

## 快速参考

### 常用 import

```typescript
// 核心
import { AIAgent, AIGNE, TeamAgent, FunctionAgent, PromptBuilder, ProcessMode, AIAgentToolChoice } from '@aigne/core';
import type { Agent, AgentOutput } from '@aigne/core';

// 模型
import { AIGNEHubChatModel } from '@aigne/aigne-hub';

// HTTP 传输
import { AIGNEHTTPServer } from '@aigne/transport/http-server/index.js';

// 可观测性
import { AIGNEObserver } from '@aigne/observability-api';

// Schema 验证
import { z } from 'zod';
```

### 最小可运行代码

```typescript
import { AIAgent, AIGNE } from '@aigne/core';
import { AIGNEHubChatModel } from '@aigne/aigne-hub';

const model = await new AIGNEHubChatModel({ model: 'google/gemini-3-flash-preview' });
const agent = AIAgent.from({ name: 'hello', instructions: '你是一个友好的助手' });
const engine = new AIGNE({ model });
const result = await engine.invoke(agent, { message: '你好' });
console.log(result.text);
```
