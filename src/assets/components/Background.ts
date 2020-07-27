import * as PIXI from 'pixi.js';
import Events from '../../Events';
import { Vector2 } from 'three';

// Background handling
export default class Background {
    app: PIXI.Application;
    scrollSpeed: number;
    boundX: number; boundY: number;
    gameAreaSize: number;

    constructor(app: PIXI.Application, width: number, height: number, bgTexture: string) {
        this.app = app;
        this.scrollSpeed = 55;
        this.gameAreaSize = 3000;

        // Add an event listener when player is at the edge of the screen, so instead of the player 
        // moving, the background will scroll
        Events.AddListener('onScreenEdge', this.moveBackground);

        const texture = PIXI.Texture.from(bgTexture);
        const bg = new PIXI.TilingSprite(texture, this.gameAreaSize, this.gameAreaSize);
        this.app.stage.addChild(bg);
        this.boundX = this.gameAreaSize - width;

    }

    recalculateGameArea = (width: number, height: number) => this.boundX = this.gameAreaSize - width;

    moveBackground = (args: Vector2) => {
        if (this.app.stage.x >= 0 && args.x < 0 ||
            -this.app.stage.x >= this.boundX && args.x > 0) return;
        this.app.stage.x += -args.x * this.scrollSpeed;
    }
}

