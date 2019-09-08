import Event from './events/BaseEvent';
import CollectionEventType from './CollectionEventType';

/**
 * @classdesc
 * Events emitted by {@link module:ol/Collection~Collection} instances are instances of this
 * type.
 */
export default class CollectionEvent<T> extends Event {
  /**
   * The element that is added to or removed from the collection.
   */
  element: T;
  /**
   * The index of the added or removed element.
   */
  index: number;
  /**
   * @param {CollectionEventType} type Type.
   * @param {T} opt_element Element.
   * @param {number} opt_index The index of the added or removed element.
   */
  constructor(type: CollectionEventType, opt_element: T, opt_index: number) {
    super(type);

    this.element = opt_element;
    this.index = opt_index;
  }
}
