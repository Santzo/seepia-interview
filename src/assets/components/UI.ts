import * as PIXI from 'pixi.js';
import Events from '../../Events';
import { Vector2 } from 'three';
import Player from './Player'
import { getJSDocThisTag } from 'typescript';

export default class UI {
    app: PIXI.Application;
    score: PIXI.Text;

    constructor(app: PIXI.Application, player: Player, width: number, height: number) {
        this.app = app;
        console.log(player);
        this.addText(`${player.keypress.left[0]} to move left\n${player.keypress.right[0]} to move right\n${player.keypress.jump[0]} to jump\n${player.keypress.attack[0]} to attack`, 0xffffff, 24, 20, 20, 'left', true);
        this.score = this.addText('Score: 0', 0xffffff, 32, 1750, 20, 'center', false);

    }
    addText = (text: string, color: number, fontSize: number, x: number, y: number, align = "center", bold = false): PIXI.Text => {
        const element = new PIXI.Text(text, { fontFamily: 'Arial', fontSize: fontSize, fill: color, align: align, dropShadow: true, dropShadowDistance: 1, fontWeight: bold ? "bold" : "normal" });
        element.anchor.set(0, 0);
        this.app.stage.addChild(element);
        element.x = x;
        element.y = y;
        return element;
    }


}