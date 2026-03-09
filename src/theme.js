// Theme switch for Phase 1 reskin.
// Default keeps classic assets to ensure zero-regression.

const DEFAULT_THEME = 'classic';
const LOBSTER_THEME = 'lobster';

// Phase 1: safe default is classic. Set to true after final assets are ready.
const ENABLE_LOBSTER_THEME = false;

// Phase 3: ad UI copy variant switch (A/B). UI hooks are non-functional by default.
const AD_COPY_VARIANT = 'A';

const LOBSTER_MAP = {
  'images/bg.png': 'images/theme/lobster/bg.png',
  'images/aircraft1.png': 'images/theme/lobster/aircraft1.png',
  'images/aircraft2.png': 'images/theme/lobster/aircraft2.png',
  'images/bullet_blue.png': 'images/theme/lobster/bullet_blue.png',
  'images/default_user.png': 'images/theme/lobster/default_user.png',
  'images/avatar_default.png': 'images/theme/lobster/avatar_default.png',
  'images/hosticon.png': 'images/theme/lobster/hosticon.png',
  'images/iconready.png': 'images/theme/lobster/iconready.png',
  'images/quickStart.png': 'images/theme/lobster/quickStart.png',
  'images/createRoom.png': 'images/theme/lobster/createRoom.png',
  'images/goBack.png': 'images/theme/lobster/goBack.png',
  'images/getReady.png': 'images/theme/lobster/getReady.png',
  'images/start.png': 'images/theme/lobster/start.png',
  'images/btn_bg.png': 'images/theme/lobster/btn_bg.png',
  'images/attack.png': 'images/theme/lobster/attack.png',
  'images/attacking.png': 'images/theme/lobster/attacking.png',
  'images/joystick_wrap.png': 'images/theme/lobster/joystick_wrap.png',
  'images/joystick.png': 'images/theme/lobster/joystick.png',
  'images/shoot.mp3': 'images/theme/lobster/shoot.mp3',
  'images/bg.mp3': 'images/theme/lobster/bg.mp3',
};

const LOBSTER_TEXT_MAP = {
  'home.title': '龙虾帝国 · 对战演练场',
  'home.lowVersion': '你的微信版本过低，无法运行龙虾主题演示。',
  'home.creatingRoom': '正在创建虾房...',
  'room.emptyUser': '点击邀请虾友',
  'room.title': '龙虾1V1对战',
  'room.leaveConfirm': '是否离开虾房？',
  'room.needAllReady': '全员就绪后才能开战',
  'room.shareTitle': '龙虾帝国对战邀请',
  'battle.leaveConfirm': '离开虾房会结束当前对战，确认离开吗？',
  'battle.opponentLeft': '对手已离开虾房，无法继续对战。',
  'battle.hpLabel': '耐久值：',
  'battle.countdown': '开战倒计时 {count} 秒',
  'common.notice': '温馨提示',
  'result.title': '龙虾对战结算',
  'result.win': '胜利',
  'result.confirm': '返回大厅',
  'result.adDemoHint': '当前为广告入口演示模式，未接入真实广告SDK。',
  'ad.limitReached': '本局广告次数已达上限，请先开始下一局。',
  'ad.notSupported': '当前环境不支持激励视频广告。',
  'ad.loadingFailed': '广告加载失败，请稍后重试。',
  'ad.notCompleted': '未完整观看广告，本次未获得奖励。',
  'ad.rewardRevive': '已获得复活机会（演示）',
  'ad.rewardDouble': '已获得双倍奖励（演示）',
  'server.connected': '游戏已连接',
  'server.disconnected': '游戏已掉线...',
  'server.matchSuccess': '匹配成功！3秒后开始龙虾对战',
  'server.gameTime': '对局时长: {sec}s',
  'server.reconnectPrompt': '检测到未结束对局，是否重连继续？',
  'server.reconnectFail': '重连失败，请重新开房间',
  'server.matching': '正在匹配虾友...',
};

const LOBSTER_AD_TEXT_MAP = {
  A: {
    'ad.reviveButton': '看广告立即复活',
    'ad.doubleRewardButton': '看广告领双倍虾币',
    'ad.reviveDesc': '观看激励视频后，可获得一次继续对战机会。',
    'ad.doubleRewardDesc': '观看激励视频后，本局结算奖励翻倍。',
  },
  B: {
    'ad.reviveButton': '再战一次（激励视频）',
    'ad.doubleRewardButton': '奖励翻倍（激励视频）',
    'ad.reviveDesc': '完成激励视频可返场继续挑战。',
    'ad.doubleRewardDesc': '完成激励视频可获得本局双倍结算。',
  },
};

export const activeTheme = ENABLE_LOBSTER_THEME ? LOBSTER_THEME : DEFAULT_THEME;
export const adCopyVariant = AD_COPY_VARIANT;

export function themedAsset(path) {
  if (activeTheme !== LOBSTER_THEME) return path;
  return LOBSTER_MAP[path] || path;
}

export function themedResources(resources) {
  return resources.map((item) => themedAsset(item));
}

export function themedText(key, fallback, vars = {}) {
  const base = activeTheme === LOBSTER_THEME ? (LOBSTER_TEXT_MAP[key] || fallback) : fallback;
  return Object.keys(vars).reduce(
    (acc, k) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(vars[k])),
    base,
  );
}

export function themedAdText(key, fallback, vars = {}, variant = adCopyVariant) {
  const variantPack = LOBSTER_AD_TEXT_MAP[variant] || LOBSTER_AD_TEXT_MAP.A;
  const base = activeTheme === LOBSTER_THEME ? (variantPack[key] || fallback) : fallback;
  return Object.keys(vars).reduce(
    (acc, k) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(vars[k])),
    base,
  );
}
