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
   * @param {CollectionEventType} type Type.
   * @param {T} opt_element Element.
   */
  constructor(type: CollectionEventType, opt_element: T) {
    super(type);

    this.element = opt_element;
  }
}
