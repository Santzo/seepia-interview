import * as THREE from 'three';
import { Vector2 } from 'three';

// Base class for all objects (except player) in the game
export default abstract class LevelObject {
    x: number; y: number;
    mesh: THREE.Mesh;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}