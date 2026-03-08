import * as PIXI  from '../../libs/pixi.js';
import config     from '../config.js';
import { createBtn } from '../common/ui.js';
import { themedAsset, themedText, themedAdText } from '../theme.js';

export default class Result extends PIXI.Container {
    constructor() {
        super();

        this.initUI();
    }

    initUI() {
        let title = new PIXI.Text(themedText('result.title', '1V1对战'), { fontSize: 36, align : 'center'});
        title.x   = config.GAME_WIDTH / 2 - title.width / 2;
        title.y   = 100;
        this.addChild(title);

        let win = new PIXI.Text(themedText('result.win', '胜'), { fontSize: 36, align : 'center'});
        win.x   = config.GAME_WIDTH / 2 - win.width / 2;
        win.y   = 330;
        this.addChild(win);
    }

    appendOpBtn() {
        this.addChild(createBtn({
            img : themedAsset('images/btn_bg.png'),
            x   : config.GAME_WIDTH / 2,
            y   : config.GAME_HEIGHT - 150,
            text: themedText('result.confirm', '确定'),
            onclick: () => {
                this.gameServer.clear();
            }
        }));

        // Phase 3: ad entry UI scaffold only (no real ad SDK calls yet)
        if (!config.adUiEnabled) return;

        const variant = config.adCopyVariant || 'A';
        const makeHint = (descKey, fallbackDesc) => () => {
            wx.showModal({
                title: themedText('common.notice', '温馨提示'),
                content: `${themedAdText(descKey, fallbackDesc, {}, variant)}\n\n${themedText('result.adDemoHint', '当前为广告入口演示模式，未接入真实广告SDK。')}`,
                showCancel: false,
            });
        };

        this.addChild(
            createBtn({
                img : themedAsset('images/btn_bg.png'),
                x   : config.GAME_WIDTH / 2 - 170,
                y   : config.GAME_HEIGHT - 245,
                text: themedAdText('ad.reviveButton', '看广告复活', {}, variant),
                onclick: makeHint('ad.reviveDesc', '观看激励视频后，可获得一次继续对战机会。'),
            }),
            createBtn({
                img : themedAsset('images/btn_bg.png'),
                x   : config.GAME_WIDTH / 2 + 170,
                y   : config.GAME_HEIGHT - 245,
                text: themedAdText('ad.doubleRewardButton', '看广告双倍奖励', {}, variant),
                onclick: makeHint('ad.doubleRewardDesc', '观看激励视频后，本局结算奖励翻倍。'),
            }),
        );
    }

    createOneUser(options) {
        const { headimg, index, nickname, role} = options;
        const padding = 100;

        const user = new PIXI.Sprite.from(headimg);
        user.name   = 'player';
        user.width  = 100;
        user.height = 100;
        user.x = (   index === 0
                   ? config.GAME_WIDTH / 2 - user.width - padding
                   : config.GAME_WIDTH / 2 + padding  );
        user.y     = 300;

        this.addChild(user);

        let name = new PIXI.Text(nickname, { fontSize: 32, align : 'center'});
        name.anchor.set(0.5);
        name.x = user.width / 2;
        name.y = user.height + 70;
        user.addChild(name);

        if ( role === config.roleMap.owner ) {
            const host = new PIXI.Sprite.from(themedAsset('images/hosticon.png'));
            host.width  = 30;
            host.height = 30;
            user.addChild(host);
        }

        return user;
    }

    launch(gameServer) {
        this.gameServer = gameServer;
        this.gameServer.gameResult.forEach((member) => {
            member.index = ( member.win ? 0 : 1 );
            this.addChild(this.createOneUser(member));
        });

        this.appendOpBtn();
    }
}

