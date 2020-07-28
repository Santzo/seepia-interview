import * as THREE from 'three';
import { Vector2 } from 'three';

// Base class for all objects (except player) in the game
export default abstract class LevelObject {
    x: number; y: number;
    mesh: THREE.Mesh;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        const collectible = new THREE.SphereGeometry(0.3);
        const material = new THREE.MeshStandardMaterial({ color: 0xffdf00 });
        this.mesh = new THREE.Mesh(collectible, material);

        this.mesh.position.x = 0;
        this.mesh.position.y = y;
        this.mesh.position.z = x;
    }
} 