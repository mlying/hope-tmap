import BaseObject from '../_utils/BaseObject';
import { Dictionary } from '../_utils/interface';
import LayerProperty from './Property';
import { assert } from '../_utils/assert';
import AssertErrorCode from '../_utils/AssertErrorCode';
import BaseMap from '../map/BaseMap';

export interface IBaseLayerOptions {
  opacity?: number;
  visible?: boolean;
}

export default abstract class BaseLayer<P extends IBaseLayerOptions> extends BaseObject<P> {
  private map: BaseMap;
  constructor(options: P) {
    super();

    const properties: Dictionary<any> = Object.assign({}, options);
    properties[LayerProperty.OPACITY] = options.opacity !== undefined ? options.opacity : 1;
    assert(typeof properties[LayerProperty.OPACITY] === 'number', AssertErrorCode.LAYER_OPACITY_IS_NOT_NUMBER);
    properties[LayerProperty.VISIBLE] = options.visible !== undefined ? options.visible : true;

    this.setProperties(properties);
  }

  setMap(map: BaseMap) {
    this.map = map;
  }

  getMap(): BaseMap {
    return this.map;
  }

  getVisible() {
    return this.get<boolean>(LayerProperty.VISIBLE) as boolean;
  }

  setVisible(visibile: boolean) {
    this.set(LayerProperty.VISIBLE, visibile);
  }

  getOpacity() {
    return this.get<number>(LayerProperty.OPACITY) as number;
  }

  setOpacity(opacity: number) {
    this.set(LayerProperty.OPACITY, opacity);
  }
}
