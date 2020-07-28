import * as THREE from 'three';
import { Vector3 } from 'three';
import Collectible from '../levelobjects/Collectible';
import Platform from '../levelobjects/Platform';
import LevelObject from '../levelobjects/LevelObject';

// A custom collider class to create colliders for the objects in the level
export default class Collider {

    collider: BoxCollider;
    object: LevelObject;
    constructor(name: CollisionObject, object: LevelObject, min?: Vector3, max?: Vector3) {
        if (!object && !min && !max) {
            console.log('error');
            return;
        }
        this.object = object ?? null;
        const box = object.mesh ? new THREE.Box3().setFromObject(object.mesh) : new THREE.Box3(min, max);
        this.collider = {
            name: name,
            min: box.min,
            max: box.max
        }
    }
}

interface BoxCollider {
    name: CollisionObject;
    min: THREE.Vector3;
    max: THREE.Vector3;
}
type CollisionObject = 'Platform' | 'Collectible'