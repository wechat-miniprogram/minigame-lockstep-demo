import * as PIXI  from '../../libs/pixi.js';
import config     from '../config.js';
import { createBtn } from '../common/ui.js';

import Debug from '../base/debug.js';

export default class Home extends PIXI.Container {
    constructor() {
        super();

        this.debug = new Debug();
        this.addChild(this.debug);
    }

    appendOpBtn() {
        this.addChild(createBtn({
            img    : 'images/btn_bg.png',
            x      : config.GAME_WIDTH / 2,
            y      : config.GAME_HEIGHT / 2,
            text   : '开房间',
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
        }));
    }

    launch(gameServer) {
        this.gameServer = gameServer;

        this.appendOpBtn();
    }
}

