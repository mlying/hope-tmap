import BaseComponent from '../_utils/Base';
import Feature from '../feature/Feature';
import Map from '../map';
import GroupLayer from './GroupLayer';

export interface ILayer {
  id: string;
}

export default abstract class Layer<P extends ILayer> extends BaseComponent<P> {
  private id: string;
  private features: Feature[];
  static GroupLayer = GroupLayer;
  constructor(props: P) {
    super(props);

    this.id = props.id;

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
