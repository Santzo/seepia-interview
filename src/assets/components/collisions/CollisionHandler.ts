import * as THREE from 'three';
import Collider from "./Collider";
import Platform from '../levelobjects/Platform';
import Collectible from '../levelobjects/Collectible';
import LevelObject from '../levelobjects/LevelObject';

// A static class to handle collisions
export default abstract class CollisionHandler {

    private static colliders: Collider[] = new Array();

    // Function to add a new collider to the array of colliders
    static addCollider = (collider: Collider): void => {
        CollisionHandler.colliders.push(collider);
    }
    // Remove a collider from the array, for example when player collects a collectible
    static removeCollider = (object: LevelObject): void => {
        const index = CollisionHandler.colliders.findIndex(col => col.object == object);
        CollisionHandler.colliders.splice(index, 1);
    }
    // Check for collisions
    static checkCollision = (min: THREE.Vector3, max: THREE.Vector3): CollisionInfo[] => {

        let collidedWith: CollisionInfo[] = new Array();
        const cols = CollisionHandler.colliders;
        for (let i = 0, len = cols.length; i < len; ++i) {
            // Use AABB collision detection to get rough bounding box collision
            const roughCollision =
                min.z < cols[i].collider.max.z &&
                max.z > cols[i].collider.min.z &&
                min.y < cols[i].collider.max.y &&
                max.y > cols[i].collider.min.y;
            // If collision is found
            if (roughCollision) {
                // Collided with a collectible, so no need to know direction of collision
                if (cols[i].collider.name === 'Collectible') {
                    collidedWith.push({ with: cols[i], direction: CollisionDirection.UP })
                    continue;
                }
                // A really rough way to check if the platform we collide with is 
                // lower or higher than the player
                const bottom = min.y - cols[i].collider.min.y > 0

                if (bottom) {
                    collidedWith.push({ with: cols[i], direction: CollisionDirection.DOWN })
                }
                else if (!bottom) {
                    collidedWith.push({ with: cols[i], direction: CollisionDirection.UP })
                }

            }
        }
        return collidedWith;
    }
}

export interface CollisionInfo {
    with: Collider
    direction: CollisionDirection
}
enum CollisionDirection {
    UP,
    RIGHT,
    DOWN,
    LEFT
}
