import * as PIXI  from '../../libs/pixi.js';
import config     from '../config.js';
import { createBtn } from '../common/ui.js';

export default class Result extends PIXI.Container {
    constructor() {
        super();

        this.initUI();
    }

    initUI() {
        let title = new PIXI.Text('1V1对战', { fontSize: 36, align : 'center'});
        title.x   = config.GAME_WIDTH / 2 - title.width / 2;
        title.y   = 100;
        this.addChild(title);

        let win = new PIXI.Text('胜', { fontSize: 36, align : 'center'});
        win.x   = config.GAME_WIDTH / 2 - win.width / 2;
        win.y   = 330;
        this.addChild(win);
    }

    appendOpBtn() {
        this.addChild(createBtn({
            img : 'images/btn_bg.png',
            x   : config.GAME_WIDTH / 2,
            y   : config.GAME_HEIGHT - 150,
            text: '确定',
            onclick: () => {
                this.gameServer.clear();
            }
        }));
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
            const host = new PIXI.Sprite.from('images/hosticon.png');
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

