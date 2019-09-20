import BaseObject from '../_utils/BaseObject';
import BaseMap from '../map/BaseMap';
import FeatureProperty from './Property';
import { Dictionary } from '../_utils/interface';

export interface IFeatureProps {
  layerId?: string;
  featureId?: string;
}

export default abstract class BaseFeature<T> extends BaseObject<IFeatureProps> {
  private map: BaseMap;
  constructor(options: IFeatureProps) {
    super(options);
    const properties: Dictionary<any> = Object.assign({}, options);
    // properties[FeatureProperty.LAYER] = options.layerId !== undefined ? options.layerId : 1;
    // assert(typeof properties[FeatureProperty.OPACITY] === 'number', AssertErrorCode.LAYER_OPACITY_IS_NOT_NUMBER);
    // properties[FeatureProperty.VISIBLE] = options.visible !== undefined ? options.visible : true;

    this.setProperties(properties);
  }

  setMap(map: BaseMap) {
    this.map = map;
  }

  getMap(): BaseMap {
    return this.map;
  }
}