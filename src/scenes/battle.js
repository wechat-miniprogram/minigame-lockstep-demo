import * as PIXI  from '../../libs/pixi.js';
import config     from '../config.js';
import JoyStick   from '../base/joystick.js'
import Player     from '../base/player.js';
import Skill      from '../base/skill.js';
import Hp         from '../base/hp.js'
import databus    from '../databus.js';

import {
    checkCircleCollision,
} from '../common/util.js';

import Debug from '../base/debug.js';

import {
    createText
} from '../common/ui.js';

export default class Battle extends PIXI.Container {
    constructor() {
        super();
    }

    launch(gameServer) {
        this.gameServer = gameServer;

        this.debug = new Debug();
        this.addChild(this.debug);

        this.initPlayer();

        // 虚拟摇杆
        this.joystick = new JoyStick((e) => {
            let evt = (  e === -9999
                       ? { e: config.msg.MOVE_STOP, n: databus.selfClientId }
                       : { e: config.msg.MOVE_DIRECTION, n: databus.selfClientId, d: e.degree }  );
            gameServer.uploadFrame([
                JSON.stringify(evt)
            ]);
        });
        this.addChild(this.joystick);

        // 技能按钮
        this.skill = new Skill();
        this.skill.eventemitter.on('click', () => {
            gameServer.uploadFrame([
                JSON.stringify({
                    e: config.msg.SHOOT,
                    n: databus.selfClientId,
                })
            ]);
        });
        this.addChild(this.skill);
    }

    initPlayer() {
        let memberList = this.gameServer.roomInfo.memberList || [];

        memberList.forEach( member => {
            let { role, clientId, nickname } = member;

            let player = new Player();
            player.setData(member);
            databus.playerMap[clientId] = player;
            databus.playerList.push(player);
            this.addChild(player);

            let hp = new Hp({
                width : 300,
                height: 20,
                hp    : config.playerHp,
            });
            this.addChild(hp);
            player.hpRender = hp;

            player.y = config.GAME_HEIGHT / 2;
            player.frameY = player.y;
            if ( role === config.roleMap.owner ) {
                player.x = player.width / 2;
                player.setDirection(0);
                hp.setPos(20, 20);
                const name = createText({
                    str: nickname,
                    style: { fontSize: 30, align: 'center'},
                    x  : 20,
                    y  : 70,
                });
                name.x += name.width / 2;
                this.addChild(name);
            } else {
                player.x = config.GAME_WIDTH - player.width / 2;
                player.setDirection(180);
                hp.setPos(config.GAME_WIDTH - 300 - 20, 20);
                const name = createText({
                    str: nickname,
                    style: { fontSize: 30, align: 'center'},
                    y  : 70,
                });
                name.x = config.GAME_WIDTH - name.width / 2 - 20;
                this.addChild(name);
            }
            player.frameX = player.x;
        });
    }

    renderCount(count) {
        this.countdownText = createText({
            str: `倒计时${count}秒`,
            x  : config.GAME_WIDTH / 2,
            y  : 330,
        });
        this.addChild(this.countdownText);
    }

    addCountdown(count) {
        if ( this.countdownText ) {
            this.removeChild(this.countdownText);
        }

        this.renderCount(count--);
        if ( count >= 0 ) {
            setTimeout(() => {
                this.addCountdown(count);
            }, 1000);
        } else {
            setTimeout(() => {
                this.removeChild(this.countdownText);
            }, 1000);
        }
    }

    renderUpdate(dt) {
        if ( databus.gameover ) {
            return;
        }

        databus.playerList.forEach(player => {
            player.renderUpdate(dt);
        });
        databus.bullets.forEach( bullet => {
            bullet.renderUpdate(dt);
        });
    }

    logicUpdate(dt, frameId) {
        if ( databus.gameover ) {
            return;
        }

        // 收到第一帧开始倒计时
        if ( frameId === 1 ) {
            this.addCountdown(1);
        }

        // 倒计时后允许操作
        if ( frameId === parseInt(1000 / this.gameServer.fps) ) {
            console.log('joystick enable');
            this.joystick.enable();
            this.skill.enable();
        }

        databus.playerList.forEach(player => {
            player.frameUpdate(dt);
        });

        databus.bullets.forEach( bullet => {
            bullet.frameUpdate(dt);
            // 碰撞检测的仲裁逻辑
            databus.playerList.forEach(player => {
                if (   bullet.sourcePlayer !== player
                    && checkCircleCollision(player.collisionCircle, bullet.collisionCircle) ) {
                    databus.removeBullets(bullet);
                    player.hp--;

                    player.hpRender.updateHp(player.hp);

                    if ( player.hp <= 0 ) {
                        this.gameServer.settle();
                        this.gameServer.endGame();
                    }
                }
            });
        });
    }

    // 指令输入后，计算下一个逻辑帧的状态，方便渲染帧逼近
    preditUpdate(dt) {
        databus.playerList.forEach( player => {
            player.preditUpdate(dt);
        });

        databus.bullets.forEach(bullet => {
            bullet.preditUpdate(dt);
        });
    }
}

