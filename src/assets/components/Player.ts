import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import Events from '../../Events';
import { Vector2 } from 'three';

export default class Player {
    model: THREE.Group;
    animations: THREE.AnimationClip[];
    mixer: THREE.AnimationMixer;
    animationAction: THREE.AnimationAction;
    moveSpeed: number;
    defaultAnimation: PlayerAnimations;
    jumpStartPosY: number; jumpEndPosY: number; jumpSmoother: number; jumpHeight: number; jumpSpeed: number = 5;
    isGrounded: boolean;
    goingUp: boolean;
    boundaries: Vector2;

    playerAction: PlayerAction = {
        left: false,
        right: false,
        jump: false,
        attack: false,
    };
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
        this.boundaries = new Vector2(8, 8);
        this.jumpSmoother = 0.08; this.jumpHeight = 2.8;

        this.mixer.addEventListener('finished', e => {
            this.playAnimation(this.defaultAnimation);
            if (this.playerAction.attack) this.playerAction.attack = false;
        });
        this.moveSpeed = 2.5;
    }

    playAnimation = (animation: PlayerAnimations, playOnce = false) => {
        if (this.animationAction) this.animationAction.stop();
        this.animationAction = this.mixer.clipAction(this.animations[animation]).play();
        this.animationAction.loop = playOnce ? THREE.LoopOnce : THREE.LoopRepeat;
    }

    handleMovement = (deltaTime: number, camPos: number): void => {
        if (this.playerAction.attack) return;
        let movement = 0;
        let moveAmount = this.moveSpeed * deltaTime;

        if (this.playerAction.left) movement -= moveAmount
        if (this.playerAction.right) movement += moveAmount;

        if (movement != 0) {
            const sign = Math.sign(movement);
            this.model.scale.setZ(sign);
            const playerPos = this.model.position.z - camPos;
            const movePlayer = sign > 0 && playerPos < this.boundaries.x || sign < 0 && playerPos > -this.boundaries.x
            if (movePlayer) {
                this.model.position.z += movement;
            }
            else {
                Events.Emit('onScreenEdge', { model: this.model.position, x: moveAmount * sign, y: 0 * sign });
            }
        }

        if (this.playerAction.jump) this.handleJump(deltaTime)
    }

    handleJump = (deltaTime: number): void => {
        if (this.goingUp && this.model.position.y >= this.jumpEndPosY - this.jumpSmoother) {
            this.goingUp = false;
        } else if (!this.goingUp && this.model.position.y <= this.jumpStartPosY + this.jumpSmoother) {
            this.isGrounded = true;
            this.playerAction.jump = false;
            this.model.position.y = this.jumpStartPosY;
            return;
        }
        const target = this.goingUp ? this.jumpEndPosY : this.jumpStartPosY
        const jumpForce = this.goingUp ? (target - this.model.position.y) * this.jumpSpeed * deltaTime :
            ((-this.jumpHeight - 0.3 - (target - this.model.position.y)) * this.jumpSpeed * deltaTime);
        this.model.position.y += jumpForce;
    }

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
                    if (this.jumpingOrAttacking) break;
                    this.playerAction.attack = true;
                    this.playAnimation(PlayerAnimations.ATTACK, true);
                }
                break;
            case (this.keypress.jump[0]):
            case (this.keypress.jump[1]):
                if (event.type === "keydown") {
                    if (this.jumpingOrAttacking || !this.isGrounded) break;
                    this.isGrounded = false;
                    this.goingUp = true;
                    this.jumpStartPosY = this.model.position.y;
                    this.jumpEndPosY = this.model.position.y + this.jumpHeight;
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