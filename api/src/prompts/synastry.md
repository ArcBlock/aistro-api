# Synastry Report Agent Prompts

> Source: Report/Synastry/* (多个子 agent)
> 用途: 合盘配对分析 (config.templates.synastry)
> 编排 agent: Generate Synastry Report (20240725232844-1IhJfL, type: function)
> 说明: synastry 是一个编排型 agent，调用多个子 prompt agent 来生成完整的合盘报告

## 子 Agent 1: Generate Synastry Report Title

> ID: 20240725232330-7U4ZEW
> 输入参数: userStars, secondaryUserStars, language

我的星盘是{{userStars}},我的好友星盘是{{secondaryUserStars}}，请用一句话总结一下我们两个的合盘

要求：
1. 请使用 {{language}} 输出
2. 字数控制在 30 个以内

## 子 Agent 2: Generate Synastry Report Section Title

> ID: 20240725232548-qxIAuv
> 输入参数: topic, language, userStars, secondaryUserStars

我的星盘是{{userStars}}，我朋友的星盘是{{secondaryUserStars}}，请告诉我和我的朋友之间关于 {{topic}} 的一句话总结，字数在 50 字以内，请使用 {{language}} 输出

## 子 Agent 3: Generate Synastry Report Section Description

> ID: 20240725232626-0X0JvA
> 输入参数: topic, language, userStars, secondaryUserStars

你是一名专业的占星师，我的星盘是{{userStars}}，我朋友的星盘是{{secondaryUserStars}}，请告诉我和朋友之间关于{{topic}}的占星解释，请限制在100字左右，请使用 {{language}} 输出

## 子 Agent 4: Generate Synastry Report Section Similarity

> ID: 20240725232648-c8gdKg
> 输入参数: topic, language, userStars, secondaryUserStars

你是一名专业的占星师，我的星盘是{{userStars}}，我朋友的星盘是{{secondaryUserStars}}，请兴奋的告诉我和朋友之间关于{{topic}}的相似之处，请限制在100字左右，请使用 {{language}} 输出

## 子 Agent 5: Generate Synastry Report Section Different

> ID: 20240725232701-dZoQgW
> 输入参数: topic, language, userStars, secondaryUserStars

你是一名专业的占星师，我的星盘是{{userStars}}，我朋友的星盘是{{secondaryUserStars}}，请告诉我和朋友之间关于{{topic}}的不同之处，请限制在100字左右，请使用 {{language}} 输出

## 子 Agent 6: Generate Synastry Report Score

> ID: 20240813115104-Fa8cLd
> 输入参数: userStars, SecondaryUserStars, userId
> 类型: function (非 AI prompt)
> 逻辑: `const score = crypto.randomInt(40, 101); return { score };`

---

## 编排逻辑 (Generate Synastry Report)

报告生成流程：
1. 调用 `Get Horoscope` 获取双方星盘数据
2. 调用 `Synastry Report Score` 生成配对分数
3. 调用 `Synastry Report Title` 生成标题
4. 遍历 topics [sun, moon, mercury, venus, mars, jupiter, saturn]：
   - 调用 `RunAgentAndTranslateToLanguage` 包裹各子 agent 生成 title/description/similarity/different
   - 生成 Blender 图片
5. 组装 JSON 结果，存入 `$storage`

报告 ID 格式: `synastry_{userId}_{md5(userBirth+secondaryUserBirth+coordinates)}`
Synastry topics: sun, moon, mercury, venus, mars, jupiter, saturn
