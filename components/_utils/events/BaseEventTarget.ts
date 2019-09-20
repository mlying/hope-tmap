/**
 * @module ol/events/Target
 */
import Disposable from '../Disposable';
import { unlistenAll } from '../events';
import { noop } from '../functions';
import BaseEvent from './BaseEvent';
import { Dictionary } from '../interface';

export type EventTargetLike = EventTarget | Target;

export type DispatchEventOptions =
  | { type: string; target: EventTargetLike | undefined; propagationStopped: boolean | undefined }
  | BaseEvent
  | string;

/**
 * Listener function. This function is called with an event object as argument.
 * When the function returns `false`, event propagation will stop.
 */
export type ListenerFunction = (event: Event | BaseEvent) => void | boolean;

/**
 * @classdesc
 * A simplified implementation of the W3C DOM Level 2 EventTarget interface.
 * See https://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html#Events-EventTarget.
 *
 * There are two important simplifications compared to the specification:
 *
 * 1. The handling of `useCapture` in `addEventListener` and
 *    `removeEventListener`. There is no real capture model.
 * 2. The handling of `stopPropagation` and `preventDefault` on `dispatchEvent`.
 *    There is no event target hierarchy. When a listener calls
 *    `stopPropagation` or `preventDefault` on an event object, it means that no
 *    more listeners after this one will be called. Same as when the listener
 *    returns false.
 */
export default class Target extends Disposable {
  pendingRemovals_: Dictionary<number> = {};
  dispatching_: Dictionary<number> = {};
  listeners_: Dictionary<ListenerFunction[]>;
  constructor() {
    super();

    this.pendingRemovals_ = {};

    this.dispatching_ = {};

    this.listeners_ = {};
  }

  /**
   * @param {string} type Type.
   * @param {.ListenerFunction} listener Listener.
   */
  addEventListener(type: string, listener: ListenerFunction) {
    let listeners = this.listeners_[type];
    if (!listeners) {
      listeners = this.listeners_[type] = [];
    }
    if (listeners.indexOf(listener) === -1) {
      listeners.push(listener);
    }
  }

  /**
   * Dispatches an event and calls all listeners listening for events
   * of this type. The event parameter can either be a string or an
   * Object with a `type` property.
   *
   * @param {DispatchEvent} event BaseEvent object.
   * @return {boolean} `false` if anyone called preventDefault on the event object or if any of the listeners returned false.
   * @api
   */
  dispatchEvent(event: DispatchEventOptions): boolean {
    const evt = typeof event === 'string' ? new BaseEvent(event) : event;
    const type = evt.type;
    if (!evt.target) {
      evt.target = this;
    }
    const listeners = this.listeners_[type];
    let propagate = true;
    if (listeners) {
      if (!(type in this.dispatching_)) {
        this.dispatching_[type] = 0;
        this.pendingRemovals_[type] = 0;
      }
      ++this.dispatching_[type];
      for (let i = 0, ii = listeners.length; i < ii; ++i) {
        if (listeners[i].call(this, evt) === false || evt.propagationStopped) {
          propagate = false;
          break;
        }
      }
      --this.dispatching_[type];
      if (this.dispatching_[type] === 0) {
        let pendingRemovals = this.pendingRemovals_[type];
        delete this.pendingRemovals_[type];
        while (pendingRemovals--) {
          this.removeEventListener(type, noop);
        }
        delete this.dispatching_[type];
      }
    }
    return propagate;
  }

  /**
   * @inheritDoc
   */
  disposeInternal() {
    unlistenAll(this);
  }

  /**
   * Get the listeners for a specified event type. Listeners are returned in the
   * order that they will be called in.
   *
   * @param {string} type Type.
   * @return {ListenerFunction[]} Listeners.
   */
  getListeners(type: string): ListenerFunction[] {
    return this.listeners_[type];
  }

  /**
   * @param {string=} opt_type Type. If not provided, `true` will be returned if this event target has any listeners.
   * @return {boolean} Has listeners.
   */
  hasListener(type: string): boolean {
    return type ? type in this.listeners_ : Object.keys(this.listeners_).length > 0;
  }

  /**
   * @param {string} type Type.
   * @param {ListenerFunction} listener Listener.
   */
  removeEventListener(type: string, listener: ListenerFunction) {
    const listeners = this.listeners_[type];
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (type in this.pendingRemovals_) {
        // make listener a no-op, and remove later in #dispatchEvent()
        listeners[index] = noop;
        ++this.pendingRemovals_[type];
      } else {
        listeners.splice(index, 1);
        if (listeners.length === 0) {
          delete this.listeners_[type];
        }
      }
    }
  }
}
