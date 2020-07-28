import { Type } from "typescript";
import { Vector2, Event } from "three";
import Collectible from "./assets/components/levelobjects/Collectible";

const EventEmitter = require('events');

// Custom events class

export default class Events extends EventEmitter {
    private static emitter = new EventEmitter();

    static addListener = (onEvent: EventType, callBack: { (args: EventArgs): void }): void => {
        Events.emitter.on(onEvent, arg => callBack(arg));
    }
    static emit = (onEvent: EventType, args: EventArgs) => { Events.emitter.emit(onEvent, args) };
}
type EventArgs = ScreenEdgeArgs | CollectibleArgs;
type EventType = 'onScreenEdge' | 'onCollectCollectible';

export interface ScreenEdgeArgs {
    model: THREE.Vector3;
    x: number;
    y: number;
}
export interface CollectibleArgs {
    collectible: Collectible;
    scoreToAdd: number;
}




