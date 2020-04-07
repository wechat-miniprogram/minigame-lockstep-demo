import * as PIXI  from '../../libs/pixi.js';
import config     from '../config.js';
import { createBtn } from '../common/ui.js';
import databus    from '../databus.js';
import { showTip } from '../common/util.js';

const emptyUser = {
    nickname: '点击邀请好友',
    headimg: "images/avatar_default.png",
    isEmpty : true,
    isReady : false,
}

export default class Room extends PIXI.Container {
    constructor() {
        super();

        this.gameServer = null;

        this.initUI();
    }

    initUI() {
        let title = new PIXI.Text('1V1对战', { fontSize: 56, align : 'center', fill: "#515151"});
        title.x   = config.GAME_WIDTH / 2 - title.width / 2;
        title.y   = 96;
        this.addChild(title);

        let vs = new PIXI.Text('VS', { fontSize: 64, align : 'center', fill: "#515151"});
        vs.x   = config.GAME_WIDTH / 2 - vs.width / 2;
        vs.y   = 307;
        this.addChild(vs);
    }

    appendBackBtn() {
        const back = createBtn({
            img   : 'images/goBack.png',
            x     : 104,
            y     : 68,
            onclick: () => {
                wx.showModal({
                    title: '温馨提示',
                    content: '是否离开房间？',
                    success: (res) => {
                        if ( res.confirm ) {
                            if ( databus.selfMemberInfo.role === config.roleMap.owner ) {
                                this.gameServer.ownerLeaveRoom();
                            } else {
                                this.gameServer.memberLeaveRoom();
                            }
                        }
                    }
                })
            }
        });

        this.addChild(back);
    }

    appendOpBtn(member) {
        let { isReady, role } = member;

        let isHosticon = role === config.roleMap.owner;

        let getReady = createBtn({
            img : 'images/getReady.png',
            x   : config.GAME_WIDTH / 2 - 159,
            y   : config.GAME_HEIGHT - 160,
            onclick: () => {
                this.gameServer.updateReadyStatus(!isReady);
            }
        })

        let start = createBtn({
            img : 'images/start.png',
            x   : config.GAME_WIDTH / 2 + 159,
            y   : config.GAME_HEIGHT - 160,
            onclick: () => {
                if ( !this.allReady ) {
                    showTip('全部玩家准备后方可开始');
                } else {
                    this.gameServer.server.broadcastInRoom({
                        msg: "START"
                    });
                }
            }
        });

        isReady && ( getReady.alpha = 0.5 );

        if ( !this.allReady ) {
            start.alpha = 0.5;
        }

        isHosticon ? this.addChild(getReady, start) : this.addChild(getReady);
    }

    clearUI() {
        this.removeChildren();
        this.initUI();
    }

    createOneUser(options) {
        const { headimg, index, nickname, role, isReady } = options;
        const padding = 136;

        const user = new PIXI.Sprite.from(headimg);
        user.name   = 'player';
        user.width  = 144;
        user.height = 144;
        user.x = (   index === 0
                   ? config.GAME_WIDTH / 2 - user.width - padding
                   : config.GAME_WIDTH / 2 + padding  );
        user.y     = 266;

        this.addChild(user);

        let name = new PIXI.Text(nickname, { fontSize: 36, align : 'center', fill: "#515151"});
        name.anchor.set(0.5);
        name.x = user.width / 2;
        name.y = user.height + 23;
        user.addChild(name);

        if ( role === config.roleMap.owner ) {
            const host = new PIXI.Sprite.from("images/hosticon.png");
            host.scale.set(.8);
            host.y = -30;
            user.addChild(host);
        }

        if ( isReady ) {
            const ready = new PIXI.Sprite.from('images/iconready.png');
            ready.width  = 40;
            ready.height = 40;
            ready.x = user.width;
            user.addChild(ready);
        }

        return user;
    }

    handleRoomInfo(res) {
        this.clearUI();

        const data       = res.data            || {};
        const roomInfo   = data.roomInfo       || {};
        const memberList = roomInfo.memberList || [];

        this.allReady = !memberList.find(member => !member.isReady);

        if ( memberList.length === 1 ) {
            memberList.push(emptyUser);
        }

        memberList.forEach((member, index) => {
            member.index = index;
            let user = this.createOneUser(member);

            if ( databus.selfClientId === member.clientId ) {
                databus.selfPosNum     = member.posNum;
                databus.selfMemberInfo = member;
                this.appendOpBtn(member);
            }

            if ( member.isEmpty ) {
                user.interactive = true;
                user.on('pointerdown', () => {
                    wx.shareAppMessage({
                        title   : '帧同步demo',
                        query   : 'accessInfo=' + this.gameServer.accessInfo,
                        imageUrl: 'https://res.wx.qq.com/wechatgame/product/luban/assets/img/sprites/bk.jpg',
                    });
                });
            }
        });

        this.appendBackBtn();
    }

    _destroy() {
        this.gameServer.event.off('onRoomInfoChange');
    }

    onRoomInfoChange(roomInfo) {
        console.log(roomInfo);
        this.handleRoomInfo({ data: { roomInfo } });
    }

    launch(gameServer) {
        this.gameServer = gameServer;
        this.onRoomInfoChangeHandler = this.onRoomInfoChange.bind(this);

        gameServer.getRoomInfo(this.accessInfo).then((res) => {
            console.log('getRoomInfo', res);
            this.handleRoomInfo(res);

            // 每次房间信息更新重刷UI
            gameServer.event.on('onRoomInfoChange', this.onRoomInfoChangeHandler);
        });
    }
}

