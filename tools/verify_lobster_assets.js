#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const repo = path.resolve(__dirname, '..');
const baseDir = path.join(repo, 'images');
const themedDir = path.join(repo, 'images/theme/lobster');

const required = [
  'bg.png','aircraft1.png','aircraft2.png','bullet_blue.png',
  'default_user.png','avatar_default.png','hosticon.png','iconready.png',
  'quickStart.png','createRoom.png','goBack.png','getReady.png','start.png','btn_bg.png','attack.png','attacking.png',
  'joystick_wrap.png','joystick.png',
  'shoot.mp3','bg.mp3',
];

function hashFile(file) {
  const data = fs.readFileSync(file);
  return crypto.createHash('sha256').update(data).digest('hex');
}

let missing = 0;
let sameAsBase = 0;

for (const name of required) {
  const themed = path.join(themedDir, name);
  const base = path.join(baseDir, name);

  if (!fs.existsSync(themed)) {
    missing += 1;
    console.error(`[MISSING] ${name}`);
    continue;
  }

  if (fs.existsSync(base)) {
    const h1 = hashFile(themed);
    const h2 = hashFile(base);
    if (h1 === h2) {
      sameAsBase += 1;
      console.warn(`[PLACEHOLDER] ${name} is identical to base asset`);
    }
  }
}

console.log('\n--- summary ---');
console.log(`required=${required.length}`);
console.log(`missing=${missing}`);
console.log(`sameAsBase=${sameAsBase}`);

if (missing > 0) {
  process.exit(2);
}

process.exit(0);
