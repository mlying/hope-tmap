import BaseComponent from '../_utils/Base';
import { LayerOption, AutoColor, ViewPoint } from './interface';
import Layer from '../layer/Layer';

export interface IMapProps {
  target: string;
}

function evnCheck() {}

export default class Map extends BaseComponent<IMapProps> {
  private layers: Layer[];
  constructor(props: IMapProps) {
    super(props);

    this.on('ok', res => {
      console.log(res);
    });

    this.emit('ok', 'i am map');
  }
  addLayer(opt: LayerOption): boolean {}
  addLayers(opts: LayerOption[]): boolean {}
  removeLayer(layerId: string) {}
  setLayerColor(layerId: string, color: AutoColor) {}
  isExist(layerId: string): boolean {}
  jumpToLayer() {}
  getLayerNum(): number {}
  getVisible(layerId: string): boolean {}
  setVisible(layerId: string, isVisible: boolean) {}
  setLayerOpacity(layerId: string, opacity: number) {}
  clearAllEffect() {}
  setHightLightOff() {}
  addTouchRegion() {}
  centerAt(point: ViewPoint) {}
  getCenterViewPoint(): ViewPoint {}
  setUnderGroundView(hight: number) {}
  closeUnderGroundView() {}
}
