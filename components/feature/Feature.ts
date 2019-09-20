import BaseFeature from './Base';
import LabelFeature from './LabelFeature';

export interface IFeatureProps {
  layerId?: string;
  featureId?: string;
}

export default class Feature extends BaseFeature<IFeatureProps> {
  static LabelFeature = LabelFeature;
  protected id: string;
  constructor(props: IFeatureProps) {
    super(props);
  }
  toJSON(){}
}
