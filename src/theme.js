// Theme switch for Phase 1 reskin.
// Default keeps classic assets to ensure zero-regression.

const DEFAULT_THEME = 'classic';
const LOBSTER_THEME = 'lobster';

// Phase 1: safe default is classic. Set to true after final assets are ready.
const ENABLE_LOBSTER_THEME = false;

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

export const activeTheme = ENABLE_LOBSTER_THEME ? LOBSTER_THEME : DEFAULT_THEME;

export function themedAsset(path) {
  if (activeTheme !== LOBSTER_THEME) return path;
  return LOBSTER_MAP[path] || path;
}

export function themedResources(resources) {
  return resources.map((item) => themedAsset(item));
}
