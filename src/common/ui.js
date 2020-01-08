import * as PIXI  from '../../libs/pixi.js';

export function createBtn(options) {
    let { img, text, x, y, onclick, width, height, style } = options;

    let btn = PIXI.Sprite.from(img);
    btn.anchor.set(.5);
    btn.x = x;
    btn.y = y;

    if ( width ) {
        btn.width = width;
    }
    if ( height ) {
        btn.height = height;
    }

    if ( onclick && typeof onclick === 'function' ) {
        btn.interactive = true;
        btn.on('pointerdown', onclick);
    }

    let _text = new PIXI.Text(text, style || {fontSize: 32, align: 'center'});
    _text.anchor.set(0.5);

    btn.addChild(_text);

    return btn;
}

export function createText(options) {
    const { str, x, y } = options;
    const style = options.style || { fontSize: 36, align : 'center'};

    let text = new PIXI.Text(str, style);
    if ( !options.left ) {
        text.anchor.set(0.5);
    }
    text.x = x || 0;
    text.y = y || 0;

    return text;
}

