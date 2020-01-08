import * as PIXI from '../../libs/pixi.js';
import config    from '../config.js';

const dpr = 2;

export default class JoyStick extends PIXI.Sprite {
    constructor() {
        let base    = PIXI.BaseTexture.from('images/btn_A.png');
        let button  = new PIXI.Texture(base, new PIXI.Rectangle(0, 0, 120, 120));

        super(button);

        this.button       = button;
        this.buttonActive = new PIXI.Texture(base, new PIXI.Rectangle(0, 120, 120, 120));

        this.eventemitter = new PIXI.utils.EventEmitter();

        this.width  = 60 * dpr;
        this.height = 60 * dpr;

		this.hasDisable = true;

        this.bindEvent();
    }

    enable() {
        this.hasDisable = false;
    }

    disable() {
        this.hasDisable = true;
    }

    bindEvent() {
        this.interactive = true;

        this.x = config.GAME_WIDTH  - this.width - 50 * dpr;
        this.y = config.GAME_HEIGHT - this.height - 70 * dpr;

        this.on('pointerdown', () => {
            this.texture = this.buttonActive;

            if ( !this.hasDisable ) {
                this.eventemitter.emit('click');
            }
        });
        this.on('pointerup', () => {
            this.texture = this.button;
        });
        this.on('pointerout', () => {
            this.texture = this.button;
        });
    }
}

