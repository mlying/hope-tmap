import BaseComponent from '../_utils/Base';

export interface IMap {}

export default class Map extends BaseComponent<IMap> {
  constructor(id: string, props: IMap) {
    super(props);

    this.on('ok', res => {
      console.log(res);
    });

    this.emit('ok', 'i am map');
  }
}
