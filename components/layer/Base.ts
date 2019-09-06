import BaseObject from '../_utils/BaseObject';
import Feature from '../feature/Feature';
import Map from '../map';

export interface IBaseLayer {
  opacity?: number;
  visible?: boolean;
}

export default abstract class BaseLayer<P extends IBaseLayer> extends BaseObject<P> {
  constructor(props: P) {
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
