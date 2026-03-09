# Lobster Theme Asset Spec (Phase 2)

> 目标：将 `images/theme/lobster/` 从占位资源升级为可上线原创资源。

## 1) 必备资源清单（与代码映射一致）

### 战斗核心
- `bg.png`（战斗背景）
- `aircraft1.png`（角色帧1）
- `aircraft2.png`（角色帧2）
- `bullet_blue.png`（子弹）

### 房间/身份
- `default_user.png`
- `avatar_default.png`
- `hosticon.png`
- `iconready.png`

### UI按钮
- `quickStart.png`
- `createRoom.png`
- `goBack.png`
- `getReady.png`
- `start.png`
- `btn_bg.png`
- `attack.png`
- `attacking.png`

### 摇杆
- `joystick_wrap.png`
- `joystick.png`

### 音效
- `shoot.mp3`
- `bg.mp3`

---

## 2) 资源规格建议（上线友好）

- 图片格式：`PNG`（保留透明背景）
- 音频格式：`MP3`（44.1kHz，立体声）
- 单图大小建议：`< 300KB`（按钮图尽量 `<120KB`）
- 总增量建议：`< 2MB`（Phase 2 目标）
- 角色帧尺寸建议：保持与旧资源视觉占比一致，避免 hitbox 误差

---

## 3) 美术风格约束（龙虾帝国）

- 主色：深海蓝 / 龙虾红 / 金色点缀
- 风格：轻松休闲、卡通化、避免血腥/暴力表达
- 文案：UI 保持简洁，避免诱导性/夸大宣传字样

---

## 4) 替换流程

1. 美术导出并命名为上述固定文件名
2. 覆盖到 `images/theme/lobster/`
3. 运行校验脚本：`node tools/verify_lobster_assets.js`
4. 将 `src/theme.js` 的 `ENABLE_LOBSTER_THEME` 切到 `true`
5. 微信开发者工具真机验证一局完整流程

---

## 5) DoD（完成定义）

- 所有必备文件存在
- 校验脚本通过且“与默认资源同hash”数量为 0
- 主题开关打开后：大厅/房间/战斗/结算均能显示新主题
- 无明显贴图错位、音效丢失、崩溃
