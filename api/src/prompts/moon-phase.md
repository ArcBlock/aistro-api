# Moon Phase Report Agent Prompts

> Source: Report/Moon/* (多个子 agent)
> 用途: 月相报告 (Chat 中通过 Question about Moon Phase 调用)
> 编排 agent: Generate Moon Phase Report (20240726012635-14nWbJ, type: function)

## 子 Agent 1: Generate Moon Phase Report Summary

> ID: 20240726012455-JBSEwN
> 输入参数: userStars, moonPhase, language

我的星盘是{{userStars}},今天的月相是{{moonPhase}}，生成一个简报，这个报告应该结合月相的影响和我的星盘特点，特别关注于事业、感情、财富等。

要求：
1. 请使用 {{language}} 输出；
2. 字数控制在 40 个以内，并且只有一段话；
3. 只是着重于事业、感情、财富等方向，并不是一定要有相关内容；

## 子 Agent 2: Generate Moon Phase Report Retrograde

> ID: 20240726012533-E2Na3r
> 输入参数: userStars, language, planets

我的星盘是{{userStars}},我的{{ planets }}是逆行的，生成行星逆行的解读报告

要求：
1. 请使用 {{language}} 输出；
2. 生成该行星逆行相对于我的影响报告，字数控制在 60 个以内；

---

## 编排逻辑 (Generate Moon Phase Report)

1. 计算月相 (phaseText)
2. 调用 `Moon Phase Report Summary` 生成月相概述
3. 遍历逆行行星 (retrogradeStars)，为每颗逆行行星调用 `Moon Phase Report Retrograde`
4. 返回: { phaseText, phaseReport, retrogrades[] }
