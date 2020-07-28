import * as PIXI from 'pixi.js';
import Events, { ScreenEdgeArgs } from '../../Events';
import { Vector2 } from 'three';
import { camera } from '../../index';

// Background handling
export default class Background {
    app: PIXI.Application;
    scrollSpeed: number;
    boundX: number; boundY: number;
    gameAreaSize: number;

    constructor(app: PIXI.Application, startPos: number, width: number, height: number, bgTexture: string) {
        this.app = app;
        this.scrollSpeed = 45;
        this.gameAreaSize = 3000;

        // Add an event listener when player is at the edge of the screen, so instead of just the player 
        // moving, the background, camera AND player will move.
        Events.addListener('onScreenEdge', this.handleMovementWhenOnEdge);

        const texture = PIXI.Texture.from(bgTexture);
        const bg = new PIXI.TilingSprite(texture, this.gameAreaSize + 500, this.gameAreaSize);
        this.app.stage.addChild(bg);
        this.app.stage.x = -startPos * this.scrollSpeed;
        this.boundX = this.gameAreaSize - width;

    }

    recalculateGameArea = (width: number, height: number) => this.boundX = this.gameAreaSize - width;

    // If player is at the edge of the screen handle the movement here.
    handleMovementWhenOnEdge = (args: ScreenEdgeArgs): void => {
        if (this.app.stage.x >= 0 && args.x < 0 ||
            -this.app.stage.x >= this.boundX && args.x > 0) args.x = 0;
        this.app.stage.x += -args.x * this.scrollSpeed;
        this.app.stage.y += args.y * this.scrollSpeed;
        camera.position.z += args.x;
        camera.position.y += args.y;
        args.model.z += args.x;
        args.model.y += args.y;
    }
}

