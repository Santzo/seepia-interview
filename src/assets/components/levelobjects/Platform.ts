import * as THREE from 'three';
import { Vector2 } from 'three';
import LevelObject from './LevelObject';

// Collectible object extending the LevelObject base class
export default class Platform extends LevelObject {
    sizeX: number; sizeY: number
    mesh: THREE.Mesh;
    constructor(x: number, y: number, sizeX: number, sizeY: number, color?: number) {
        super(x, y);
        this.sizeX = sizeX;
        this.sizeY = sizeY;

        const platform = new THREE.BoxGeometry(1, sizeY, sizeX);
        const material = new THREE.MeshLambertMaterial({ color: color || 0xf3ffe2 });
        this.mesh = new THREE.Mesh(platform, material);

        this.mesh.position.x = 0;
        this.mesh.position.y = y;
        this.mesh.position.z = x;
    }
} 