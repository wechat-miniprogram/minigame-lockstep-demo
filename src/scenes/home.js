import * as PIXI  from '../../libs/pixi.js';
import config     from '../config.js';
import { createBtn, createText } from '../common/ui.js';

import Debug from '../base/debug.js';

export default class Home extends PIXI.Container {
    constructor() {
        super();

        this.debug = new Debug();
        this.addChild(this.debug);
    }

    appendOpBtn() {
        this.addChild(
            createText({
                str    : '小游戏帧同步功能示例',
                x      : config.GAME_WIDTH / 2,
                y      : 287,
                style  : {
                    fontSize: 64,
                    fill: "#515151"
                }
            }),
            createBtn({
                img    : 'images/createRoom.png',
                x      : config.GAME_WIDTH / 2,
                y      : 442,
                onclick: () => {
                    if ( this.handling ) {
                        return;
                    }
                    this.handling = true
                    wx.showLoading({
                        title: '房间创建中...',
                    })
                    this.gameServer.createRoom({}, () => {
                        wx.hideLoading();
                        this.handling = false;
                    });
                }
            })
        );
    }

    launch(gameServer) {
        this.gameServer = gameServer;

        this.appendOpBtn();
    }
}

