/**
 * @module ol/Collection
 */
import AssertionError from './AssertionError.js';
import CollectionEventType from './CollectionEventType.js';
import BaseObject from './BaseObject.js';
import CollectionEvent from './CollectionEvent';

/**
 * @enum {string}
 * @private
 */
enum Property {
  LENGTH = 'length',
}

export interface ICollection<T> {
  arr: T[];
  /**
   * the collection twice.
   */
  options: {
    /**
     * Disallow the same item from being added to
     */
    unique?: boolean;
  };
}

/**
 * @classdesc
 *
 * @fires CollectionEvent
 *
 * @template T
 * @api
 */
export default class Collection<T> extends BaseObject<ICollection<T>> {
  private unique_: boolean;
  private array_: (T)[];
  /**
   * @param {ICollection=} opt Collection options.
   */
  constructor(opt: ICollection<T>) {
    super(opt);

    const { options, arr = [] } = opt;

    this.unique_ = options ? !!options.unique : false;
    this.array_ = arr;

    if (this.unique_) {
      for (let i = 0, ii = this.array_.length; i < ii; ++i) {
        this.assertUnique_(this.array_[i], i);
      }
    }

    this.updateLength_();
  }

  /**
   * Remove all elements from the collection.
   * @api
   */
  clear() {
    while (this.getLength() > 0) {
      this.pop();
    }
  }

  /**
   * Add elements to the collection.  This pushes each item in the provided array
   * to the end of the collection.
   * @param {T[]} arr Array.
   * @return {Collection<T>} This collection.
   * @api
   */
  extend(arr: T[]): Collection<T> {
    for (let i = 0, ii = arr.length; i < ii; ++i) {
      this.push(arr[i]);
    }
    return this;
  }

  /**
   * Iterate over each element, calling the provided callback.
   * @param {function(T, number, Array<T>): *} f The function to call
   *     for every element. This function takes 3 arguments (the element, the
   *     index and the array). The return value is ignored.
   * @api
   */
  forEach(f: (arg0: T, arg1: number, arg2: (T)[]) => void) {
    const array = this.array_;
    for (let i = 0, ii = array.length; i < ii; ++i) {
      f(array[i], i, array);
    }
  }

  /**
   * Get a reference to the underlying Array object. Warning: if the array
   * is mutated, no events will be dispatched by the collection, and the
   * collection's "length" property won't be in sync with the actual length
   * of the array.
   * @return {T[]} Array.
   * @api
   */
  getArray(): (T)[] {
    return this.array_;
  }

  /**
   * Get the element at the provided index.
   * @param {number} index Index.
   * @return {T } Element.
   * @api
   */
  item(index: number): T {
    return this.array_[index];
  }

  /**
   * Get the length of this collection.
   * @return {number} The length of the array.
   * @observable
   * @api
   */
  getLength(): number {
    const len = this.get<number>(Property.LENGTH);
    return typeof len === 'number' ? len : -1;
  }

  /**
   * Insert an element at the provided index.
   * @param {number} index Index.
   * @param {T} elem Element.
   * @api
   */
  insertAt(index: number, elem: T) {
    if (this.unique_) {
      this.assertUnique_(elem);
    }
    this.array_.splice(index, 0, elem);
    this.updateLength_();
    this.dispatchEvent(new CollectionEvent(CollectionEventType.ADD, elem, index));
  }

  /**
   * Remove the last element of the collection and return it.
   * Return `undefined` if the collection is empty.
   * @return {T|undefined} Element.
   * @api
   */
  pop(): T {
    return this.removeAt(this.getLength() - 1);
  }

  /**
   * Insert the provided element at the end of the collection.
   * @param {T} elem Element.
   * @return {number} New length of the collection.
   * @api
   */
  push(elem: T): number {
    if (this.unique_) {
      this.assertUnique_(elem);
    }
    const n = this.getLength();
    this.insertAt(n, elem);
    return this.getLength();
  }

  /**
   * Remove the first occurrence of an element from the collection.
   * @param {T} elem Element.
   * @return {T|undefined} The removed element or undefined if none found.
   * @api
   */
  remove(elem: T): T | undefined {
    const arr = this.array_;
    for (let i = 0, ii = arr.length; i < ii; ++i) {
      if (arr[i] === elem) {
        return this.removeAt(i);
      }
    }
    return undefined;
  }

  /**
   * Remove the element at the provided index and return it.
   * Return `undefined` if the collection does not contain this index.
   * @param {number} index Index.
   * @return {T|undefined} Value.
   * @api
   */
  removeAt(index: number): T {
    const prev = this.array_[index];
    this.array_.splice(index, 1);
    this.updateLength_();
    this.dispatchEvent(new CollectionEvent(CollectionEventType.REMOVE, prev, index));
    return prev;
  }

  /**
   * Set the element at the provided index.
   * @param {number} index Index.
   * @param {T} elem Element.
   * @api
   */
  // setAt(index: number, elem: T) {
  //   const n = this.getLength();
  //   if (index < n) {
  //     if (this.unique_) {
  //       this.assertUnique_(elem, index);
  //     }
  //     const prev = this.array_[index];
  //     this.array_[index] = elem;
  //     this.dispatchEvent(new CollectionEvent(CollectionEventType.REMOVE, prev, index));
  //     this.dispatchEvent(new CollectionEvent(CollectionEventType.ADD, elem, index));
  //   } else {
  //     for (let j = n; j < index; ++j) {
  //       this.insertAt(j, undefined);
  //     }
  //     this.insertAt(index, elem);
  //   }
  // }

  /**
   * @private
   */
  private updateLength_() {
    this.set(Property.LENGTH, this.array_.length);
  }

  /**
   * @private
   * @param {T} elem Element.
   * @param {number} [except] Optional index to ignore.
   */
  private assertUnique_(elem?: T, except?: number) {
    for (let i = 0, ii = this.array_.length; i < ii; ++i) {
      if (this.array_[i] === elem && i !== except) {
        throw new AssertionError(58);
      }
    }
  }
}
