import * as THREE from 'three';

export default class Player {
    model: THREE.Group;
    animations: THREE.AnimationClip[];
    mixer: THREE.AnimationMixer;
    moveSpeed: number;
    movement: Movement = {
        LEFT: false,
        RIGHT: false,
        JUMP: false,
        ATTACK: false,
    };
    keypress: KeyPress = {
        LEFT: ['ArrowLeft', 'a'],
        RIGHT: ['ArrowRight', 'd'],
        JUMP: [''],
        ATTACK: ['Enter']
    }

    constructor(model: THREE.Group, animations: THREE.AnimationClip[], mixer: THREE.AnimationMixer) {
        this.model = model;
        this.animations = animations;
        this.mixer = mixer;
        this.mixer.addEventListener('finished', e => console.log('finished'));
        this.playAnimation(PlayerAnimations.IDLE);
        this.moveSpeed = 2.5;
        console.log(this.movement.ATTACK);
    }
    playAnimation = (animation: PlayerAnimations, playOnce = false) => {
        const action = this.mixer.clipAction(this.animations[animation]).play();
        action.reset();
        action.loop = !playOnce ? THREE.LoopRepeat : THREE.LoopOnce;
    }

    handleKeyPress = (event): void => {
        switch (event.key) {
            case (this.keypress.LEFT[0]):
            case (this.keypress.LEFT[1]):
                this.movement.LEFT = event.type === "keydown";
                break;
            case (this.keypress.RIGHT[0]):
            case (this.keypress.RIGHT[1]):
                this.movement.RIGHT = event.type === "keydown";
                break;
            case (this.keypress.ATTACK[0]):
            case (this.keypress.ATTACK[1]):
                this.playAnimation(PlayerAnimations.ATTACK, true);
                break;
        }
    }
    handleMovement = (deltaTime: number): void => {
        let movement = 0;
        let moveAmount = this.moveSpeed * deltaTime;
        if (this.movement.LEFT) movement -= moveAmount
        if (this.movement.RIGHT) movement += moveAmount;
        if (movement != 0)
            this.model.scale.setZ(Math.sign(movement));
        this.model.position.z += movement;
    }
}
export enum PlayerAnimations {
    ATTACK,
    BRAG,
    DEFEND,
    HIT,
    IDLE
}
interface Movement {
    LEFT: boolean;
    RIGHT: boolean;
    JUMP: boolean;
    ATTACK: boolean;
}
interface KeyPress {
    LEFT: string[];
    RIGHT: string[];
    JUMP: string[];
    ATTACK: string[];
}