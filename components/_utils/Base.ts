import { EventEmitter2 } from 'eventemitter2';

export default class BaseComponent<P> extends EventEmitter2 {
  props: P;
  constructor(props: P) {
    super(); //must call super for "this" to be defined.

    this.props = props;
  }
}
