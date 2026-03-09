# Lobster Theme 一键替换检查清单

## A. 替换前
- [ ] 已备份当前 `images/theme/lobster/`
- [ ] 已确认素材授权（原创或可商用）
- [ ] 已确认文件名与清单一致

## B. 替换执行
- [ ] 将新素材覆盖 `images/theme/lobster/`
- [ ] 执行：`node tools/verify_lobster_assets.js`
- [ ] 校验输出中 `missing = 0`
- [ ] 校验输出中 `sameAsBase = 0`

## C. 本地验证
- [ ] `src/theme.js` 中 `ENABLE_LOBSTER_THEME=true`
- [ ] 可进大厅
- [ ] 可创建/加入房间
- [ ] 可开局并操作（摇杆、攻击、音效）
- [ ] 可结束一局并回到首页

## D. 提交前
- [ ] 回切 `ENABLE_LOBSTER_THEME=false`（若要保守合并）
- [ ] commit message 包含 `theme(lobster)`
- [ ] PR 描述包含截图（大厅/战斗/结算）
