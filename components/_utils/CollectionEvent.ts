import Event from './events/BaseEvent.js';
import CollectionEventType from './CollectionEventType';

/**
 * @classdesc
 * Events emitted by {@link module:ol/Collection~Collection} instances are instances of this
 * type.
 */
export default class CollectionEvent extends Event {
  /**
   * @param {CollectionEventType} type Type.
   * @param {*=} opt_element Element.
   * @param {number} opt_index The index of the added or removed element.
   */
  constructor(type: CollectionEventType, opt_element: any, opt_index: any) {
    super(type);

    /**
     * The element that is added to or removed from the collection.
     * @type {*}
     * @api
     */
    this.element = opt_element;

    /**
     * The index of the added or removed element.
     * @type {number}
     * @api
     */
    this.index = opt_index;
  }
}
