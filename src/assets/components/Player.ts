import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import Events from '../../Events';
import { Vector2, Vector3 } from 'three';
import Collider from './collisions/Collider';
import CollisionHandler, { CollisionInfo } from './collisions/CollisionHandler';

// The base player class to handle everything related to the player
export default class Player {
    model: THREE.Group;
    animations: THREE.AnimationClip[];
    mixer: THREE.AnimationMixer;
    animationAction: THREE.AnimationAction;
    moveSpeed: number;
    defaultAnimation: PlayerAnimations;
    jumpStartPosY: number; jumpEndPosY: number; jumpTime: number; jumpForce: number = 8.5; maxJumpTime = 8;
    currentGravity: number = 0;
    collider: Collider;
    isGrounded: boolean;
    goingUp: boolean;
    boundaries: Vector2;

    // Playeractions as booleans to keep track what player is doing
    playerAction: PlayerAction = {
        left: false,
        right: false,
        jump: false,
        attack: false,
    };

    // Configure keys
    keypress: KeyPress = {
        left: ['A', 'ArrowLeft'],
        right: ['D', 'ArrowRight'],
        jump: ['Space', ' '],
        attack: ['Enter']
    }

    constructor(model: GLTF) {
        this.model = model.scene;
        this.animations = model.animations;
        this.mixer = new THREE.AnimationMixer(model.scene);
        this.defaultAnimation = PlayerAnimations.IDLE;
        this.isGrounded = true;
        this.playAnimation(this.defaultAnimation);
        this.boundaries = new Vector2(7, 3.5);

        // Event listener for animations that play only once, so after the animation has stopped playing
        // we can return to the default animation which in this case is idle.
        this.mixer.addEventListener('finished', e => {
            this.playAnimation(this.defaultAnimation);
            if (this.playerAction.attack) this.playerAction.attack = false;
        });
        this.moveSpeed = 2.8;
        this.model.position.z = 10;
    }
    // Function to change animations
    playAnimation = (animation: PlayerAnimations, playOnce = false) => {
        if (this.animationAction) this.animationAction.stop();
        this.animationAction = this.mixer.clipAction(this.animations[animation]).play();
        this.animationAction.loop = playOnce ? THREE.LoopOnce : THREE.LoopRepeat;
    }

    // Really simple gravity system with a linear increase
    applyGravity = (deltaTime: number) => {
        if (this.isGrounded) this.isGrounded = false;
        this.currentGravity = Math.clamp(this.currentGravity += 0.17 * deltaTime, 0.005, 0.4);
        //this.model.position.y -= this.currentGravity;
    }
    // If the player collides with something, this function actually handles what to do
    handleCollision = (collisions: CollisionInfo[], deltaTime: number) => {
        for (let i = 0, len = collisions.length; i < len; ++i) {
            switch (collisions[i].with.collider.name) {
                case 'Platform':
                    if (collisions[i].direction == 0) {
                        this.playerAction.jump = false;
                        this.applyGravity(deltaTime);
                    }
                    if (collisions[i].direction == 2) {
                        this.isGrounded = true;
                        this.currentGravity = 0;
                        break;
                    }
                    break;
                case 'Collectible':
                    Events.emit('onCollectCollectible', { collectible: collisions[i].with.object, scoreToAdd: 1 })
            }
        }
    }
    // Movement handling
    handleMovement = (deltaTime: number, camPos: Vector3): void => {
        if (this.playerAction.attack) return;
        let worldPos: Vector3 = new Vector3;

        // Use world position of the player for collision checking
        this.model.getWorldPosition(worldPos);

        const min = new Vector3(worldPos.x, worldPos.y - 0.15, worldPos.z - 0.35);
        const max = new Vector3(worldPos.x, worldPos.y + 2.5, worldPos.z + 0.35);
        const collisions = CollisionHandler.checkCollision(min, max);
        if (collisions.length === 0) this.applyGravity(deltaTime);
        else this.handleCollision(collisions, deltaTime);

        let horMovement = 0;
        let horMoveAmount = this.moveSpeed * deltaTime;

        if (this.playerAction.left) horMovement -= horMoveAmount
        if (this.playerAction.right) horMovement += horMoveAmount;

        let verMoveAmount = -this.currentGravity;
        if (this.playerAction.jump) verMoveAmount += this.handleJump(deltaTime)

        // If player is moving to any direction
        if (horMovement != 0 || verMoveAmount != 0) {

            const xSign = Math.sign(horMovement);
            const ySign = Math.sign(verMoveAmount);
            if (xSign != 0) this.model.scale.setZ(xSign);

            const playerPosZ = this.model.position.z - camPos.z;
            const playerPosY = this.model.position.y - camPos.y;

            // Check if the player is at the edge of the screen set by the 'boundaries' field.
            const movePlayerX = xSign > 0 && playerPosZ < this.boundaries.x || xSign < 0 && playerPosZ > -this.boundaries.x
            const movePlayerY = ySign < 0 && playerPosY > -this.boundaries.y || ySign > 0 && playerPosY < this.boundaries.y

            // If player is not at the edge of the screen, move only the player model
            if (movePlayerX) this.model.position.z += horMovement;
            if (movePlayerY) this.model.position.y += verMoveAmount;

            // If player is at the edge, emit an event to move player, background and the camera.
            if (!movePlayerX || !movePlayerY) {
                let x = movePlayerX ? 0 : horMoveAmount * xSign;
                let y = movePlayerY ? 0 : verMoveAmount;
                Events.emit('onScreenEdge', { model: this.model.position, x: x, y: y });
            }

        }

    }
    // Jump handling with smoothing
    handleJump = (deltaTime: number): number => {
        const diff = this.maxJumpTime - this.jumpTime;
        const totalJumpForce = (this.jumpForce + diff) * deltaTime;
        this.jumpTime += totalJumpForce;
        if (this.jumpTime > this.maxJumpTime) {
            this.playerAction.jump = false;
        }
        return totalJumpForce;
    }
    // Handle keyboard inputs, with some alternate keys. For example you can use 
    // arrows instead of AD to move left and right
    handleKeyPress = (event): void => {
        const key = event.key.length > 1 ? event.key : event.key.toUpperCase();
        switch (key) {
            case (this.keypress.left[0]):
            case (this.keypress.left[1]):
                this.playerAction.left = event.type === "keydown";
                break;
            case (this.keypress.right[0]):
            case (this.keypress.right[1]):
                this.playerAction.right = event.type === "keydown";
                break;
            case (this.keypress.attack[0]):
            case (this.keypress.attack[1]):
                if (event.type === "keydown") {
                    if (this.playerAction.attack || !this.isGrounded) break;
                    this.playerAction.attack = true;
                    this.playAnimation(PlayerAnimations.ATTACK, true);
                }
                break;
            case (this.keypress.jump[0]):
            case (this.keypress.jump[1]):
                if (event.type === "keydown") {
                    if (this.jumpingOrAttacking || !this.isGrounded) break;
                    this.isGrounded = false;
                    this.jumpTime = 0;
                    this.playerAction.jump = true;
                    this.playAnimation(PlayerAnimations.DEFEND, true);
                }
                break;
        }
    }
    get jumpingOrAttacking(): boolean { return this.playerAction.jump || this.playerAction.attack };

}
enum PlayerAnimations {
    ATTACK,
    BRAG,
    DEFEND,
    HIT,
    IDLE
}
interface PlayerAction {
    left: boolean;
    right: boolean;
    jump: boolean;
    attack: boolean;
}
interface KeyPress {
    left: string[];
    right: string[];
    jump: string[];
    attack: string[];
}