/**
 * @module _utils/events
 */
import { clear } from './obj';
import BaseEvent from './events/BaseEvent';
import { EventTargetLike, ListenerFunction } from './events/BaseEventTarget';
import { Dictionary } from './interface';

/**
 * Key to use with {@link module:_utils/Observable~Observable#unByKey}.
 */
export interface EventsKeyLike {
  bindTo?: object;
  boundListener?: ListenerFunction;
  callOnce: boolean;
  deleteIndex?: number;
  listener: ListenerFunction;
  target: EventTargetLike;
  type: string;
}

export interface EventsKey extends EventsKeyLike {
  boundListener: ListenerFunction;
}

/**
 * @param {EventsKeyLike} prevListenerObj Listener object.
 * @return {EventsKey} Bound listener.
 */
export function bindListener(prevListenerObj: EventsKeyLike): EventsKey {
  const boundListener = function(evt: Event | BaseEvent) {
    const listener = listenerObj.listener;
    const bindTo = listenerObj.bindTo || listenerObj.target;
    if (listenerObj.callOnce) {
      unlistenByKey(listenerObj);
    }
    return listener.call(bindTo, evt);
  };

  const listenerObj: EventsKey = { ...prevListenerObj, boundListener };

  return listenerObj;
}

/**
 * Finds the matching {@link module:_utils/events~EventsKey} in the given listener array.
 *
 * @param {!Array<!EventsKey>} listeners Array of listeners.
 * @param {!Function} listener The listener function.
 * @param {Object} [scope] The `this` value inside the listener.
 * @param {boolean} [setDeleteIndex] Set the deleteIndex on the matching listener, for {@link module:_utils/events~unlistenByKey}.
 * @return {EventsKey|undefined} The matching listener object.
 */
export function findListener(
  listeners: EventsKey[],
  listener: ListenerFunction,
  scope?: Object,
  setDeleteIndex?: boolean
): EventsKey | undefined {
  let listenerObj;
  for (let i = 0, ii = listeners.length; i < ii; ++i) {
    listenerObj = listeners[i];
    if (listenerObj.listener === listener && listenerObj.bindTo === scope) {
      if (setDeleteIndex) {
        listenerObj.deleteIndex = i;
      }
      return listenerObj;
    }
  }
  return undefined;
}

/**
 * @param {EventTargetLike} target Target.
 * @param {string} type Type.
 * @return {EventsKey[]|undefined} Listeners.
 */
export function getListeners(target: EventTargetLike, type: string): EventsKey[] | undefined {
  const listenerMap = getListenerMap(target);
  return listenerMap ? listenerMap[type] : undefined;
}

/**
 * Get the lookup of listeners.
 * @param {Object} target Target.
 * @param {boolean=} optCreate If a map should be created if it doesn't exist.
 * @return {Dictionary<EventsKey[]>} Map of listeners by event type.
 */
function getListenerMap(target: EventTargetLike, optCreate?: boolean): Dictionary<EventsKey[]> {
  let listenerMap = (target as any).lm;
  if (!listenerMap && optCreate) {
    listenerMap = (target as any).lm = {};
  }
  return listenerMap;
}

/**
 * Remove the listener map from a target.
 * @param {Object} target Target.
 */
function removeListenerMap(target: EventTargetLike) {
  delete (target as any).lm;
}

/**
 * Clean up all listener objects of the given type.  All properties on the
 * listener objects will be removed, and if no listeners remain in the listener
 * map, it will be removed from the target.
 * @param {EventTargetLike} target Target.
 * @param {string} type Type.
 */
function removeListeners(target: EventTargetLike, type: string) {
  const listeners = getListeners(target, type);
  if (listeners) {
    for (let i = 0, ii = listeners.length; i < ii; ++i) {
      target.removeEventListener(type, listeners[i].boundListener);
      clear(listeners[i]);
    }
    listeners.length = 0;
    const listenerMap = getListenerMap(target);
    if (listenerMap) {
      delete listenerMap[type];
      if (Object.keys(listenerMap).length === 0) {
        removeListenerMap(target);
      }
    }
  }
}

/**
 * Registers an event listener on an event target.
 *
 * @param {EventTargetLike} target Event target.
 * @param {string} type Event type.
 * @param {ListenerFunction} listener Listener.
 * @param {Object} [scope] Object referenced by the `this` keyword in the listener. Default is the `target`.
 * @param {boolean} [once] If true, add the listener as one-off listener.
 * @return {EventsKey} Unique key for the listener.
 */
export function listen(
  target: EventTargetLike,
  type: string,
  listener: ListenerFunction,
  scope?: Object,
  once?: boolean
): EventsKey {
  const listenerMap = getListenerMap(target, true);
  let listeners = listenerMap[type];
  if (!listeners) {
    listeners = listenerMap[type] = [];
  }
  let listenerObj = findListener(listeners, listener, scope, false);
  if (listenerObj) {
    if (!once) {
      // Turn one-off listener into a permanent one.
      listenerObj.callOnce = false;
    }
  } else {
    const prevListenerObj = {
      bindTo: scope,
      callOnce: !!once,
      listener: listener,
      target: target,
      type: type,
    };
    listenerObj = bindListener(prevListenerObj);
    target.addEventListener(type, listenerObj.listener);
    listeners.push(listenerObj);
  }

  return listenerObj;
}

/**
 * Registers a one-off event listener on an event target.
 *
 * @param {EventTargetLike} target Event target.
 * @param {string} type Event type.
 * @param {ListenerFunction} listener Listener.
 * @param {Object} [scope] Object referenced by the `this` keyword in the listener. Default is the `target`.
 * @return {EventsKey} Key for unlistenByKey.
 */
export function listenOnce(
  target: EventTargetLike,
  type: string,
  listener: ListenerFunction,
  scope?: Object
): EventsKey {
  return listen(target, type, listener, scope, true);
}

/**
 * Unregisters an event listener on an event target.
 *
 * To return a listener, this function needs to be called with the exact same
 * arguments that were used for a previous {@link module:_utils/events~listen} call.
 *
 * @param {EventTargetLike} target Event target.
 * @param {string} type Event type.
 * @param {ListenerFunction} listener Listener.
 * @param {Object=} [scope] Object referenced by the `this` keyword in the listener. Default is the `target`.
 */
export function unlisten(target: EventTargetLike, type: string, listener: ListenerFunction, scope?: object) {
  const listeners = getListeners(target, type);
  if (listeners) {
    const listenerObj = findListener(listeners, listener, scope, true);
    if (listenerObj) {
      unlistenByKey(listenerObj);
    }
  }
}

/**
 * Unregisters event listeners on an event target. Inspired by
 * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
 *
 * The argument passed to this function is the key returned from
 * {@link module:_utils/events~listen} or {@link module:_utils/events~listenOnce}.
 *
 * @param {EventsKey} [key] The key.
 */
export function unlistenByKey(key?: EventsKey) {
  if (key && key.target) {
    key.target.removeEventListener(key.type, key.boundListener);
    const listeners = getListeners(key.target, key.type);
    if (listeners) {
      const i = 'deleteIndex' in key ? key.deleteIndex : listeners.indexOf(key);
      if (typeof i === 'number' && i !== -1) {
        listeners.splice(i, 1);
      }
      if (listeners.length === 0) {
        removeListeners(key.target, key.type);
      }
    }
    clear(key);
  }
}

/**
 * Unregisters all event listeners on an event target. Inspired by
 * https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html
 *
 * @param {EventTargetLike} target Target.
 */
export function unlistenAll(target: EventTargetLike) {
  const listenerMap = getListenerMap(target);
  if (listenerMap) {
    for (const type in listenerMap) {
      removeListeners(target, type);
    }
  }
}
