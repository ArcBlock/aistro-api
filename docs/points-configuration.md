# Points 积分系统配置指南

部署新后端后，需要在 PointUp 组件中创建积分规则，然后将规则 ID 配置到 Blocklet Preferences 中。

## 环境信息

| 环境 | PointUp 管理后台 |
|------|-----------------|
| 本地开发 | https://bbqayeccuhcfcmoeqqukgmskkrcjrq3pvtrhlmehpb4.did.abtnet.io/point-up/admin/home |
| 线上测试 | https://bbqar7ag4vmnso5i3g4qxtxktn6odiwbappvpc4cnsy.did.abtnet.io/point-up/admin/home |

## 前置条件

- 已安装并启用 PointUp 组件（Component ID: `z2qa2ZST7Frp8w1XGqyw9v85u12R3mBbB2oaA`）
- 拥有 Blocklet 管理员权限

## 第一步：创建 Add Points 规则

在 PointUp 管理后台 **Add Points Rule** tab 中创建以下加分规则：

| 规则名称 | 积分 | 周期类型 | 最大次数 | Action 映射 | 说明 |
|---------|------|---------|---------|------------|------|
| 每日打卡签到 | 100 | 不限 (0) | 1 | — | 每日打卡领积分 |
| 连续签到 3 天 | 150 | 不限 (0) | 1 | — | 连续签到 3 天积分奖励 |
| 连续签到 7 天 | 300 | 不限 (0) | 1 | — | 连续签到 7 天积分奖励 |
| 连续签到 14 天 | 500 | 不限 (0) | 1 | — | 连续签到 14 天积分奖励 |
| 连续签到 21 天 | 1000 | 不限 (0) | 1 | — | 连续签到 21 天积分奖励 |
| 首次向 AI 提问 | 10 | 不限 (0) | 1 | `firstQueryAI` | 首次向 AI 提问获得积分 |
| 查看 Blog | 10 | 不限 (0) | 3 | `viewBlog` | 查看 Blog 赢取积分 |
| 邀请占星合盘 | 300 | 不限 (0) | 2 | `synastryInviter` | 邀请合盘成功，邀请人获得奖励 |
| 接受邀请占星合盘 | 150 | 不限 (0) | 1 | `synastryInvitee` | 被邀请人完成合盘后获得积分 |
| 添加好友 | 10 | 不限 (0) | 1 | `addFriend` | 添加好友获得积分 |
| 每日启动 | 10 | 不限 (0) | 1 | `dailyLaunch` | 每日启动应用获得积分 |
| 分享 | 10 | 不限 (0) | 1 | `share` | 分享内容获得积分 |
| 完善个人信息 | 10 | 不限 (0) | 1 | `completeUserInfo` | 完善个人信息获得积分 |

> **periodicType 说明**: 0 = 不限周期, 3 = 每年

### 批量创建方式（推荐）

可以在浏览器 DevTools Console 中通过 API 批量创建，无需逐个手动填写表单：

```js
// 1. 从 cookie 中获取 CSRF token
const csrfToken = document.cookie.split('; ').find(c => c.startsWith('x-csrf-token='))?.split('=').slice(1).join('=');

// 2. 调用创建 API（PUT 方法）
const res = await fetch('/point-up/api/add-point-rule/add', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
  credentials: 'include',
  body: JSON.stringify({
    points: '100',
    isLimited: 1,
    periodicType: 0,
    maxTimes: 1,
    desc: '每日打卡领积分，领取积分奖励',
    title: '每日打卡签到',
    tTranslation: JSON.stringify({"en":"Daily check-in/sign-in","zh":"每日打卡签到","zh-TW":"每日簽到/打卡","ja":"毎日のチェックイン/サインイン"})
  })
});
const data = await res.json();
console.log(data.id); // 记录返回的 ruleId
```

**关键 API 端点：**

| 操作 | 方法 | 路径 |
|------|------|------|
| 创建加分规则 | `PUT` | `/point-up/api/add-point-rule/add` |
| 查询加分规则 | `GET` | `/point-up/api/add-point-rule/list?page=1&pageSize=20` |
| 创建消费规则 | `PUT` | `/point-up/api/consume-point-rule/add` |

> **注意**: Badge 规则必须通过管理后台 UI 创建，因为 `claimedImg`（徽章图片）是必填字段，需要上传图片。

## 第二步：创建 Consume Points 规则

| 规则名称 | 积分 | 说明 |
|---------|------|------|
| 购买报告 | 100 | 购买报告消耗积分 |

## 第三步：创建 Badges（徽章）

在 PointUp 管理后台 **Badge Rule** tab 中创建以下徽章（需要上传 claimedImg 徽章图片）：

| 徽章名称 | 触发时机 |
|---------|---------|
| firstTimeLogin | 首次登录 |
| firstTimeCompleteProfile | 首次完善个人信息 |
| firstTimeSubscribe | 首次订阅 |
| firstTimeGenerateFortuneReport | 首次生成运势报告 |
| firstTimeGenerateNatalReport | 首次生成本命报告 |
| firstTimeGenerateSynastryReport | 首次生成合盘报告 |
| firstTimeRedeemReportWithPoints | 首次使用积分兑换报告 |
| firstTimeChatWithAI | 首次与 AI 聊天 |
| firstTimeDrawNFT | 首次抽取 NFT |

## 第四步：组装配置 JSON

创建完所有规则后，记录每条规则的 ID，按以下格式组装 JSON：

```json
{
  "actions": {
    "synastryInviter": {
      "ruleId": "<邀请占星合盘的规则ID>"
    },
    "synastryInvitee": {
      "ruleId": "<接受邀请占星合盘的规则ID>"
    },
    "addFriend": {
      "ruleId": "<添加好友的规则ID>"
    },
    "viewBlog": {
      "ruleId": "<查看Blog的规则ID>"
    },
    "dailyLaunch": {
      "ruleId": "<每日启动的规则ID>"
    },
    "share": {
      "ruleId": "<分享的规则ID>"
    },
    "completeUserInfo": {
      "ruleId": "<完善个人信息的规则ID>"
    },
    "firstQueryAI": {
      "ruleId": "<首次向AI提问的规则ID>"
    }
  },
  "consume": {
    "redeemReport": {
      "ruleId": "<购买报告的规则ID>"
    }
  },
  "badges": {
    "firstTimeLogin": "<firstTimeLogin徽章ID>",
    "firstTimeCompleteProfile": "<firstTimeCompleteProfile徽章ID>",
    "firstTimeSubscribe": "<firstTimeSubscribe徽章ID>",
    "firstTimeGenerateFortuneReport": "<firstTimeGenerateFortuneReport徽章ID>",
    "firstTimeGenerateNatalReport": "<firstTimeGenerateNatalReport徽章ID>",
    "firstTimeGenerateSynastryReport": "<firstTimeGenerateSynastryReport徽章ID>",
    "firstTimeRedeemReportWithPoints": "<firstTimeRedeemReportWithPoints徽章ID>",
    "firstTimeChatWithAI": "<firstTimeChatWithAI徽章ID>",
    "firstTimeDrawNFT": "<firstTimeDrawNFT徽章ID>"
  }
}
```

## 各环境已创建的配置

### 本地开发环境

```json
{
  "actions": {
    "synastryInviter": { "ruleId": "691945191111655424" },
    "synastryInvitee": { "ruleId": "691945191342342144" },
    "addFriend": { "ruleId": "691946560367362048" },
    "viewBlog": { "ruleId": "691945190776111104" },
    "dailyLaunch": { "ruleId": "691946560895844352" },
    "share": { "ruleId": "691946561185251328" },
    "completeUserInfo": { "ruleId": "691946561420132352" },
    "firstQueryAI": { "ruleId": "691945190356680704" }
  },
  "consume": {
    "redeemReport": { "ruleId": "691945305704235008" }
  }
}
```

### 线上测试环境

```json
{
  "actions": {
    "synastryInviter": { "ruleId": "691949585580425216" },
    "synastryInvitee": { "ruleId": "691949586209570816" },
    "addFriend": { "ruleId": "691949587396558848" },
    "viewBlog": { "ruleId": "691949584984834048" },
    "dailyLaunch": { "ruleId": "691949588063453184" },
    "share": { "ruleId": "691949588675821568" },
    "completeUserInfo": { "ruleId": "691949589367881728" },
    "firstQueryAI": { "ruleId": "691949584137584640" }
  },
  "consume": {
    "redeemReport": { "ruleId": "691949590030581760" }
  }
}
```

### 旧系统（生产环境）参考配置

```json
{
  "actions": {
    "synastryInviter": { "ruleId": "385081813254537216" },
    "synastryInvitee": { "ruleId": "385082161625038848" },
    "addFriend": { "ruleId": "375146482614927360" },
    "viewBlog": { "ruleId": "375148048713515008" },
    "dailyLaunch": { "ruleId": "375146825620914176" },
    "share": { "ruleId": "375147142341197824" },
    "completeUserInfo": { "ruleId": "375147408528506880" },
    "firstQueryAI": { "ruleId": "375147725215236096" }
  },
  "consume": {
    "redeemReport": { "ruleId": "375148329455058944" }
  },
  "badges": {
    "firstTimeLogin": "384250167810850816",
    "firstTimeCompleteProfile": "384250436401496064",
    "firstTimeSubscribe": "384249829577981952",
    "firstTimeGenerateFortuneReport": "384249381303353344",
    "firstTimeGenerateNatalReport": "384248491599200256",
    "firstTimeGenerateSynastryReport": "384248181854044160",
    "firstTimeRedeemReportWithPoints": "384247208427388928",
    "firstTimeChatWithAI": "384247848746614784",
    "firstTimeDrawNFT": "384247560874754048"
  }
}
```

> **注意**: 本地和测试环境的 badges 部分尚未创建（需要上传徽章图片），创建后将 badge ID 补充到对应配置中。

## 第五步：写入 Blocklet Preferences

1. 打开 Blocklet 管理后台
2. 进入 aistro-ai 组件的 Settings / Preferences 页面
3. 切换到 **Points** Tab
4. 将上面组装好的 JSON 粘贴到 Points 输入框中
5. 保存

## 代码中的使用方式

配置通过 `config.points` 访问（定义在 `api/src/libs/env.ts`）：

- `config.points.actions[actionName].ruleId` — 获取加分规则 ID
- `config.points.consume.redeemReport.ruleId` — 获取消费规则 ID
- `config.points.badges[badgeName]` — 获取徽章 ID

### 当前代码中引用的 actions

| Action 名称 | 触发位置 |
|------------|---------|
| `firstTimeChatWithAI` | `api/src/routes/ai/handlers/session-chat.ts` |
| `firstTimeSubscribe` | `api/src/routes/ai/handlers/subscription.ts` |

### 当前代码中引用的 badges

| Badge 名称 | 触发位置 |
|-----------|---------|
| `firstTimeCompleteProfile` | `api/src/routes/user.ts` |
| `firstTimeGenerateFortuneReport` | `api/src/routes/report.ts` |
| `firstTimeGenerateNatalReport` | `api/src/routes/report.ts` |
| `firstTimeGenerateSynastryReport` | `api/src/routes/report.ts` |
| `firstTimeRedeemReportWithPoints` | `api/src/routes/v2/report-status.ts` |

### 前端调用的 actions（通过 POST /api/points/action）

前端可以通过 body `{ "action": "<actionName>" }` 调用任意已配置的 action，包括：
- `synastryInviter`, `synastryInvitee`, `viewBlog`, `dailyLaunch`, `share`, `completeUserInfo`, `firstQueryAI` 等

## 注意事项

- 迁移时 Medal/LuckyDraw 功能已移除，但 Points 系统保留
- 如果 `config.points.consume.redeemReport` 未配置，`GET /api/points/status` 接口将不返回 redeemReport 信息
- 所有 badge 操作都使用 `addPointsBadgeWithCatch()`，失败时仅记录日志不阻断主流程
