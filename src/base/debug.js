import * as PIXI  from '../../libs/pixi.js';
import config from '../config.js';

import {
    createText
} from '../common/ui.js';

export default class Battle extends PIXI.Container {
    constructor() {
        super();
    }

    updateDebugMsg(msgArr = []) {
        if ( this.box ) {
            this.removeChild(this.box);
        }

        if ( !msgArr.length ) {
            return;
        }

        const w = 300;
        let start = 10;
        const padding = 7;
        const font    = 20;
        const h = (msgArr.length + 1) * (padding + font) + padding * 2;

        let box = new PIXI.Container();
        this.box = box;
        this.addChild(box);
        box.x = (config.GAME_WIDTH - w) / 2;
        box.y = 20;
        box.width = w;
        box.height = h;

        let g = new PIXI.Graphics();
        g.beginFill(0, 0.6);
        g.drawRoundedRect(0, 0, w, h, 10);
        g.endFill();
        box.addChild(g);

        msgArr.unshift('调试信息');
        msgArr.forEach(str=> {
            box.addChild(createText({
                str,
                x  : 10,
                y  : start,
                left: true,
                style: { fontSize: font, fill: '#ffffff'}
            }));
            start += padding + font;
        });
    }
}
