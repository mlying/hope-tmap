import BaseComponent from '../_utils/Base';

export interface IGroupLayer {
  xml: string;
}

export default class GroupLayer extends BaseComponent<IGroupLayer> {
  xml: string;
  constructor(props: IGroupLayer) {
    super(props);

    this.xml = xml;
  }

  load(map:Map) {

  }
}
