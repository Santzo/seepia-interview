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
type EventArgs = Vector2;
type EventType = 'onScreenEdge' | 'onChangeHealth';




