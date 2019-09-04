import BaseObject from '../_utils/BaseObject';
import { LayerOption, AutoColor, ViewPoint } from './interface';
import Layer, { ILayer } from '../layer/Layer';
import { ITDECtrl } from '../_utils/interface';

export interface IMapProps {
  target: string;
}

export default class Map extends BaseObject<IMapProps> {
  private layers: Layer<ILayer>[];
  private ctrl: ITDECtrl;
  constructor(props: IMapProps) {
    super(props);

    const target = this.get<string>('target');
    if (!target) {
      throw new TypeError('属性 target 不存在');
    }
    const elm = document.getElementById(target);
    if (!elm) {
      throw new TypeError('容器对象异常');
    }
    if (elm.tagName !== 'OBJECT') {
      throw new TypeError('容器必须为 object 对象');
    }

    this.ctrl = elm as ITDECtrl;

    this.on('ok', res => {
      console.log(res);
    });

    this.emit('ok', 'i am map');
  }
  getControl() {
    return this.ctrl;
  }
  getVersion(): string {
    return this.ctrl.InvokeCmd('CommonOper', 'GetVersion', null);
  }
  /**
   * 获取三维控件是32还是64位
   */
  getPlatform(): string {
    return this.ctrl.InvokeCmd('CommonOper', 'GetPlatform', null);
  }
  addLayer(opt: LayerOption | GroupLayer): boolean {
    if (opt.type === 'group') {
    }
  }
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
