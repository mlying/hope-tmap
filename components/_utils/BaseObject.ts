import { Dictionary } from './interface';
import BaseObjectEvent from './BaseObjectEvent';
import Observable from './Observable';

const changeEventTypeCache: Dictionary<any> = {};

export function getChangeEventType(key: string) {
  return changeEventTypeCache.hasOwnProperty(key)
    ? changeEventTypeCache[key]
    : (changeEventTypeCache[key] = 'change:' + key);
}

export const ObjectEventType = {
  PROPERTYCHANGE: 'propertychange',
};

export type IBaseObject = Dictionary<any>;

export default class BaseObject<P extends IBaseObject> extends Observable {
  private values: Dictionary<any> = {};
  constructor(options?: P) {
    super(); //must call super for "this" to be defined.

    if (options !== undefined) {
      this.setProperties(options);
    }
  }

  /**
   * Gets a value.
   * @param {string} key Key name.
   * @return {*} Value.
   * @api
   */
  get<T>(key: string): T | undefined {
    let value;
    if (this.values.hasOwnProperty(key)) {
      value = this.values[key] as T;
    }
    return value;
  }

  /**
   * Get a list of object property names.
   * @return {string[]} List of property names.
   * @api
   */
  getKeys(): string[] {
    return Object.keys(this.values);
  }

  /**
   * Get an object of all property names and values.
   * @return {Dictionary<string>} Object.
   * @api
   */
  getProperties(): Dictionary<string> {
    return Object.assign({}, this.values);
  }

  /**
   * @param {string} key Key name.
   * @param {*} oldValue Old value.
   */
  notify(key: string, oldValue: string) {
    let eventType;
    eventType = getChangeEventType(key);
    this.dispatchEvent(new BaseObjectEvent(eventType, key, oldValue));
    eventType = ObjectEventType.PROPERTYCHANGE;
    this.dispatchEvent(new BaseObjectEvent(eventType, key, oldValue));
  }

  /**
   * Sets a value.
   * @param {string} key Key name.
   * @param {*} value Value.
   * @param {boolean} [silent=true] Update without triggering an event.
   * @api
   */
  set(key: string, value: any, silent?: boolean) {
    if (silent) {
      this.values[key] = value;
    } else {
      const oldValue = this.values[key];
      this.values[key] = value;
      if (oldValue !== value) {
        this.notify(key, oldValue);
      }
    }
  }

  /**
   * Sets a collection of key-value pairs.  Note that this changes any existing
   * properties and adds new ones (it does not remove any existing properties).
   * @param {Object<string, *>} values Values.
   * @param {boolean} [silent] Update without triggering an event.
   * @api
   */
  setProperties(values: Dictionary<any>, silent?: boolean) {
    for (const key in values) {
      this.set(key, values[key], silent);
    }
  }

  /**
   * Unsets a property.
   * @param {string} key Key name.
   * @param {boolean} [silent=true] Unset without triggering an event.
   * @api
   */
  unset(key: string, silent?: boolean) {
    if (key in this.values) {
      const oldValue = this.values[key];
      delete this.values[key];
      if (!silent) {
        this.notify(key, oldValue);
      }
    }
  }
}
