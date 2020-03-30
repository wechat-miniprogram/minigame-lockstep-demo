import {
    getDeviceInfo
} from './common/util.js';

const deviceinfo = getDeviceInfo();

export default {
    debug       : true,

    dpr         : deviceinfo.devicePixelRatio,
    windowWidth : deviceinfo.windowWidth,
    windowHeight: deviceinfo.windowHeight,

    GAME_WIDTH  : 667 * 2,
    GAME_HEIGHT : 375 * 2,

    pixiOptions: {
        backgroundColor: 0,
        antialias      : false,
        sharedTicker   : true,
        view           : canvas,
    },

    roomState: {
        inTeam   : 1,
        gameStart: 2,
        gameEnd  : 3,
        roomDestroy: 4,
    },

    deviceinfo,

    resources: [
        "images/bg.png",
        "images/aircraft1.png",
        "images/aircraft2.png",
        "images/bullet_blue.png",
        "images/default_user.png",
        "images/avatar_default.png",
        "images/hosticon.png",
        "images/iconready.png",
    ],

    msg: {
        "SHOOT"         : 1,
        "MOVE_DIRECTION": 2,
        "MOVE_STOP"     : 3,
        "STAT"          : 4,
    },

    roleMap: {
        owner  : 1,
        partner: 0,
    },

    playerHp: 20,
}

