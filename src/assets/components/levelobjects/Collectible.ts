import * as THREE from 'three';
import { Vector2 } from 'three';
import LevelObject from './LevelObject';

// Collectible object extending the LevelObject base class
export default class Collectible extends LevelObject {
    mesh: THREE.Mesh;
    constructor(x: number, y: number) {
        super(x, y);
        const collectible = new THREE.SphereGeometry(0.3);
        const material = new THREE.MeshStandardMaterial({ color: 0xffdf00 });
        this.mesh = new THREE.Mesh(collectible, material);

        this.mesh.position.x = 0;
        this.mesh.position.y = y;
        this.mesh.position.z = x;
    }
} 