import * as PIXI  from '../../libs/pixi.js';
import config     from '../config.js';
import { createBtn } from '../common/ui.js';
import { showTip } from '../common/util.js';
import rewardedAd from '../base/rewarded-ad.js';
import { themedAsset, themedText, themedAdText } from '../theme.js';

export default class Result extends PIXI.Container {
    constructor() {
        super();

        this.adPromptCount = 0;
        this.adMaxPrompts = config.adMaxPromptsPerRound || 2;

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

    canPromptAd() {
        if (this.adPromptCount >= this.adMaxPrompts) {
            showTip(themedText('ad.limitReached', '本局广告次数已达上限，请先开始下一局。'));
            return false;
        }

        if (!rewardedAd.supported()) {
            showTip(themedText('ad.notSupported', '当前环境不支持激励视频广告。'));
            return false;
        }

        if (!config.adUnitId) {
            wx.showModal({
                title: themedText('common.notice', '温馨提示'),
                content: `${themedText('result.adDemoHint', '当前为广告入口演示模式，未接入真实广告SDK。')}\n\n请先配置 config.adUnitId 后再测试真实广告。`,
                showCancel: false,
            });
            return false;
        }

        return true;
    }

    handleAdAction(kind) {
        if (!this.canPromptAd()) return;

        const variant = config.adCopyVariant || 'A';
        const rewardedText = kind === 'revive'
            ? themedText('ad.rewardRevive', '已获得复活机会（演示）')
            : themedText('ad.rewardDouble', '已获得双倍奖励（演示）');

        const skipHint = kind === 'revive'
            ? themedAdText('ad.reviveDesc', '观看激励视频后，可获得一次继续对战机会。', {}, variant)
            : themedAdText('ad.doubleRewardDesc', '观看激励视频后，本局结算奖励翻倍。', {}, variant);

        rewardedAd.show({
            adUnitId: config.adUnitId,
            onReward: () => {
                showTip(rewardedText);
            },
            onSkip: () => {
                showTip(themedText('ad.notCompleted', '未完整观看广告，本次未获得奖励。'));
            },
            onFail: () => {
                showTip(skipHint);
            },
        }).then((res) => {
            if (res && res.shown) {
                this.adPromptCount += 1;
            }
        });
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

        if (!config.adUiEnabled) return;

        const variant = config.adCopyVariant || 'A';
        this.addChild(
            createBtn({
                img : themedAsset('images/btn_bg.png'),
                x   : config.GAME_WIDTH / 2 - 170,
                y   : config.GAME_HEIGHT - 245,
                text: themedAdText('ad.reviveButton', '看广告复活', {}, variant),
                onclick: () => this.handleAdAction('revive'),
            }),
            createBtn({
                img : themedAsset('images/btn_bg.png'),
                x   : config.GAME_WIDTH / 2 + 170,
                y   : config.GAME_HEIGHT - 245,
                text: themedAdText('ad.doubleRewardButton', '看广告双倍奖励', {}, variant),
                onclick: () => this.handleAdAction('doubleReward'),
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

