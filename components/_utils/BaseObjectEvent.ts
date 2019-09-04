import BaseEvent from './events/BaseEvent';

/**
 * @classdesc
 * Events emitted by {@link module:ol/Object~BaseObject} instances are instances of this type.
 */
export default class BaseObjectEvent extends BaseEvent {
  /**
   * The name of the property whose value is changing.
   * @type {string}
   * @api
   */
  key: string;

  /**
   * The old value. To get the new value use `e.target.get(e.key)` where `e` is the event object.
   * @type {any}
   * @api
   */
  oldValue: any;
  /**
   * @param {string} type The event type.
   * @param {string} key The property name.
   * @param {*} oldValue The old value for `key`.
   */
  constructor(type: string, key: string, oldValue: any) {
    super(type);
    this.key = key;

    this.oldValue = oldValue;
  }
}
