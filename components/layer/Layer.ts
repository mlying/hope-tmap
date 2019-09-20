import BaseLayer, { IBaseLayerOptions } from './Base';
import GroupLayer from './GroupLayer';
import { getUid } from '../_utils/util';

export interface ILayerOptions extends IBaseLayerOptions {
  id?: string;
}

export default class Layer<T extends ILayerOptions> extends BaseLayer<T> {
  static GroupLayer = GroupLayer;
  protected id: string;
  constructor(options: T) {
    super(options);

    this.id = options.id || getUid(this);
  }
  getId() {
    return this.id;
  }

  startup() {}
}
