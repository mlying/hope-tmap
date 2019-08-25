import BaseComponent from '../_utils/Base';
import Feature from '../feature/Feature';
import Map from '../map';

export interface ILayerProps {
  id: string;
}

export default class Layer extends BaseComponent<ILayerProps> {
  private id: string;
  private features: Feature[];
  constructor(props: ILayerProps) {
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
