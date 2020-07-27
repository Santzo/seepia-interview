import { Type } from "typescript";
import { Vector2, Event } from "three";

const EventEmitter = require('events');

export default class Events extends EventEmitter {
    private static emitter = new EventEmitter();

    static AddListener = (onEvent: EventType, callBack: { (args: EventArgs): void }): void => {
        Events.emitter.on(onEvent, arg => callBack(arg));
    }
    static Emit = (onEvent: EventType, args: EventArgs) => { Events.emitter.emit(onEvent, args) };
}
type EventArgs = ScreenEdge;
type EventType = 'onScreenEdge' | 'onChangeHealth';

export interface ScreenEdge {
    model: THREE.Vector3;
    x: number;
    y: number;
}




