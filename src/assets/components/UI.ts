import * as PIXI from 'pixi.js';
import Events, { CollectibleArgs } from '../../Events';
import { Vector2 } from 'three';
import Player from './Player'
import { getJSDocThisTag } from 'typescript';

// UI class
export default class UI {

    app: PIXI.Application;
    score: number;
    scoreText: PIXI.Text;
    addToScore = (args: CollectibleArgs) => {
        this.score += args.scoreToAdd;
        this.scoreText.text = `Score: ${this.score}`;
    }

    constructor(app: PIXI.Application, player: Player, width: number, height: number) {
        this.app = app;
        this.addText(`${player.keypress.left[0]} to move left\n${player.keypress.right[0]} to move right\n${player.keypress.jump[0]} to jump\n${player.keypress.attack[0]} to attack`, 0xffffff, 24, 20, 20, 'left', true);
        this.score = 0;
        this.scoreText = this.addText(`Score: ${this.score}`, 0xffffff, 32, 1750, 20, 'center', false);

        // Subscribe to collect collectible event to update the score text
        Events.addListener('onCollectCollectible', this.addToScore);
    }


    addText = (text: string, color: number, fontSize: number, x: number, y: number, align = "center", bold = false): PIXI.Text => {
        const element = new PIXI.Text(text,
            {
                fontFamily: 'Arial',
                fontSize: fontSize, fill:
                    color, align: align,
                dropShadow: true,
                dropShadowDistance: 2,
                fontWeight: bold ? "bold" : "normal",
            });
        element.anchor.set(0, 0);
        this.app.stage.addChild(element);
        element.x = x;
        element.y = y;
        return element;
    }


}