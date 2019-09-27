import BaseObject from '../_utils/BaseObject';
import BaseMap from '../map/BaseMap';
import { Dictionary } from '../_utils/interface';
import FeatureProperty from './Property';

export interface IBaseFeatureProps {
  layerId: string;
  featureId: string;
}

export default abstract class BaseFeature<T extends IBaseFeatureProps> extends BaseObject<T> {
  private map: BaseMap;
  protected layerId: string;
  protected featureId: string;
  constructor(options: T) {
    super(options);
    this.layerId = options.layerId;
    this.featureId = options.featureId;
  }

  setMap(map: BaseMap) {
    this.map = map;
  }

  getMap(): BaseMap {
    return this.map;
  }

  getCtrl() {
    return this.getMap().getCtrl();
  }

  getIds() {
    return {LayerID: this.layerId, FeatureID: this.featureId}
  }

  abstract startup(): void;
}
