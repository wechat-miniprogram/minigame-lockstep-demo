import * as PIXI from '../../libs/pixi.js';
import config    from '../config.js';

export default class BackGround extends PIXI.Sprite {
    constructor() {
        let texture = PIXI.Texture.from('images/bg.png');
        super(texture);

        this.fill();
    }

    fill() {
        let width  = this.texture.width;
        let height = this.texture.height;

        if ( width / height > config.GAME_WIDTH / config.GAME_HEIGHT ) {
            this.height = config.GAME_HEIGHT;
            this.width = width * ( config.GAME_HEIGHT / height);
        } else {
            this.width = config.GAME_WIDTH;
            this.height = height * ( config.GAME_WIDTH / width);
        }
    }
}
