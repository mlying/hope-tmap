import BaseObject, { getChangeEventType } from '../_utils/BaseObject';
import { LayerOption, AutoColor, ViewPoint } from './interface';
import Layer from '../layer/Layer';
import GroupLayer from '../layer/Group';
import { ITDECtrl, Dictionary } from '../_utils/interface';
import { listen, EventsKey, unlistenByKey } from '../_utils/events';
import BaseEventType from '../_utils/events/BaseEventType';
import BaseObjectEventType from '../_utils/BaseObjectEventType';
import MapRender from '../renderer/MapRender';
import Collection from '../_utils/Collection';

export interface IMapOptions {
  target: string;
  layers: GroupLayer | Layer[] | Collection<Layer>;
}

export interface IMapOptionsInternal {
  values: Dictionary<any>;
}

export enum MapProperty {
  LAYERGROUP = 'layergroup',
  TARGET = 'target',
}

function createOptionsInternal(options: IMapOptions): IMapOptionsInternal {
  const values: Dictionary<any> = {};

  const groupLayer = isGroupLayer(options.layers) ? options.layers : new GroupLayer({ layers: options.layers });

  values[MapProperty.LAYERGROUP] = groupLayer;

  return {
    values,
  };
}

function isGroupLayer(layers: any): layers is GroupLayer {
  return layers && layers.getLayers === 'function';
}

export default class Map extends BaseObject<IMapOptions> {
  private layers: Layer[];
  private ctrl: ITDECtrl;
  private animationDelayKey_: number | undefined;
  private layerGroupPropertyListenerKeys?: EventsKey[];
  private renderer_: MapRender;
  constructor(options: IMapOptions) {
    super();

    const optionsInternal = createOptionsInternal(options);

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

    listen(this, getChangeEventType(MapProperty.LAYERGROUP), this.handleLayerGroupChanged, this);

    this.setProperties(optionsInternal.values);
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
  getLayerGroup(): GroupLayer {
    return this.get(MapProperty.LAYERGROUP);
  }
  private handleLayerGroupChanged() {
    if (this.layerGroupPropertyListenerKeys) {
      this.layerGroupPropertyListenerKeys.forEach(unlistenByKey);
      this.layerGroupPropertyListenerKeys = undefined;
    }
    const layerGroup = this.getLayerGroup();
    if (layerGroup) {
      this.layerGroupPropertyListenerKeys = [
        listen(layerGroup, BaseObjectEventType.PROPERTYCHANGE, this.renderMap, this),
        listen(layerGroup, BaseEventType.CHANGE, this.renderMap, this),
      ];
    }
    this.renderMap();
  }
  private animationDelay_ = () => {
    this.animationDelayKey_ = undefined;
    this.renderFrame_(Date.now());
  };
  private renderFrame_(time: number) {}
  private renderMap() {
    if (this.renderer_ && this.animationDelayKey_ === undefined) {
      this.animationDelayKey_ = requestAnimationFrame(this.animationDelay_);
    }
  }
}
