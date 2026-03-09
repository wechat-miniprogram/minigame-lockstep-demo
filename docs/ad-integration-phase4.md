# Phase 4：微信激励视频接入说明（结果页）

## 已接入内容
- 入口位置：`src/scenes/result.js`
  - 按钮1：复活（文案走 A/B）
  - 按钮2：双倍奖励（文案走 A/B）
- SDK 封装：`src/base/rewarded-ad.js`
- 配置：`src/config.js`
  - `adUiEnabled`：是否显示广告入口按钮
  - `adUnitId`：微信激励视频广告位ID
  - `adMaxPromptsPerRound`：每局最多弹出次数（默认2）

## 当前保护策略
1. 无 `adUnitId`：给出提示，不触发 SDK 调用
2. 环境不支持：提示“当前环境不支持激励视频广告”
3. 每局频控：超过 `adMaxPromptsPerRound` 不再弹
4. 未完整观看：不发奖励并给提示

## 启用步骤
1. 打开 `src/config.js`
2. 配置：
   - `adUiEnabled = true`
   - `adUnitId = '你的真实adunit'`
3. 微信开发者工具真机调试并走完整结算流程

## 验收建议
- 完整观看 -> 显示奖励提示
- 中途关闭 -> 显示未获奖励提示
- 连续点击超过2次 -> 触发频控提示
- 弱网/加载失败 -> 触发失败提示
