import Feature from '../feature/Feature';
import Map from '../map';
import GroupLayer from './GroupLayer';
import BaseLayer, { IBaseLayer } from './Base';

export interface ILayer extends IBaseLayer {
  id: string;
}

export default class Layer extends BaseLayer<ILayer> {
  private features: Feature[];
  static GroupLayer = GroupLayer;
  constructor(props: ILayer) {
    super(props);

    this.on('ok', res => {
      console.log(res);
    });
  }

  addFeature(feature: Feature) {}
  removeFeature(featureId: string) {}
  removeAllFeatures() {}
  hideFeature(featureId: string) {}
  hideAllFeatures() {}
  getMap(): Map {}
  getFeature(featureId: string): Feature {}
}
