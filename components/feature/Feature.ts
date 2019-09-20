import BaseFeature, { IBaseFeatureProps } from './Base';
import LabelFeature from './LabelFeature';
import ImageFeature from './ImageFeature';

export interface IFeatureProps extends IBaseFeatureProps {
  layerId?: string;
  featureId?: string;
}

export default class Feature<T extends IFeatureProps> extends BaseFeature<IFeatureProps> {
  static LabelFeature = LabelFeature;
  static ImageFeature = ImageFeature;
  protected id: string;
  constructor(props: T) {
    super(props);
  }

  startup() {}
}
