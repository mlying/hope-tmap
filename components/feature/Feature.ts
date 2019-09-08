import BaseComponent from '../_utils/BaseObject';

export interface IFeatureProps {
  id: string;
}

export default class Feature extends BaseComponent<IFeatureProps> {
  private id: string;
  constructor(props: IFeatureProps) {
    super(props);

    this.id = props.id;
  }
}
