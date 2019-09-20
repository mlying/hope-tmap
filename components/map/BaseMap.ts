import BaseObject, { getChangeEventType } from '../_utils/BaseObject';
import Layer, { ILayerOptions } from '../layer/Layer';
import LayerList from '../layer/List';
import OverlayList from '../overlay/List';
import { ITDECtrl, Dictionary } from '../_utils/interface';
import { listen, EventsKey, unlistenByKey, unlisten } from '../_utils/events';
import BaseEventType from '../_utils/events/BaseEventType';
import BaseObjectEventType from '../_utils/BaseObjectEventType';
import MapRenderer from '../renderer/MapRenderer';
import Collection from '../_utils/Collection';
import Overlay, { IOverlayOptions } from '../overlay/Overlay';
import { assert } from '../_utils/assert';
import CollectionEvent from '../_utils/CollectionEvent';
import CollectionEventType from '../_utils/CollectionEventType';
import AssertErrorCode from '../_utils/AssertErrorCode';
import GroupLayer from '../layer/GroupLayer';
import MapProperty from './Property';

export interface IFrameState {}

export interface IMapOptions {
  target: string;
  layers?: LayerList | Layer<ILayerOptions>[] | Collection<Layer<ILayerOptions>>;
  overlays?: OverlayList | Overlay<IOverlayOptions>[] | Collection<Overlay<IOverlayOptions>>;
  keyboardEventTarget?: HTMLElement | Document | string;
}

export interface IMapOptionsValues extends Dictionary<any> {
  target: string;
  layerlist: LayerList;
  overlayList: OverlayList;
}

export interface IMapOptionsInternal {
  values: IMapOptionsValues;
  keyboardEventTarget: HTMLElement | Document | null;
  // overlays: Collection<Overlay<IOverlayOptions>>;
}

function createOptionsInternal(options: IMapOptions): IMapOptionsInternal {
  const values: Dictionary<any> = {};

  let keyboardEventTarget = null;
  if (options.keyboardEventTarget !== undefined) {
    keyboardEventTarget =
      typeof options.keyboardEventTarget === 'string'
        ? document.getElementById(options.keyboardEventTarget)
        : options.keyboardEventTarget;
  }

  const layerList = isLayerList(options.layers) ? options.layers : new LayerList({ layers: options.layers || [] });
  values[MapProperty.LAYERLIST] = layerList;

  const overlayList = isOverLayList(options.overlays)
    ? options.overlays
    : new OverlayList({ layers: options.overlays || [] });
  values[MapProperty.OVERLAYLIST] = overlayList;

  values[MapProperty.TARGET] = options.target;

  // let overlays;
  // if (options.overlays !== undefined) {
  //   if (Array.isArray(options.overlays)) {
  //     overlays = new Collection<Overlay<IOverlayOptions>>(options.overlays.slice());
  //   } else {
  //     // layers 应该为 array 或者 Collection
  //     assert(typeof options.overlays.getArray === 'function', AssertErrorCode.LAYERS_IS_NOT_ARRAY_AND_COLLECTION);
  //     overlays = options.overlays;
  //   }
  // } else {
  //   overlays = new Collection<Overlay<IOverlayOptions>>();
  // }

  return {
    values: values as IMapOptionsValues,
    keyboardEventTarget,
    // overlays,
  };
}

function isLayerList(layers: any): layers is LayerList {
  return layers && layers.getLayerList === 'function';
}

function isOverLayList(overlays: any): overlays is OverlayList {
  return overlays && overlays.getLayerList === 'function';
}

export default class BaseMap extends BaseObject<IMapOptions> {
  private ctrl: ITDECtrl;
  private animationDelayKey_: number | undefined;
  private layerGroupPropertyListenerKeys?: EventsKey[];
  private keyboardEventTarget_: HTMLElement | Document;
  private keyHandlerKeys_: EventsKey[] | null;
  private renderer_: MapRenderer;

  constructor(options: IMapOptions) {
    super();

    const optionsInternal = createOptionsInternal(options);

    listen(this, getChangeEventType(MapProperty.OVERLAYLIST), this.handleOverlayListChanged, this);
    listen(this, getChangeEventType(MapProperty.LAYERLIST), this.handleLayerListChanged, this);
    listen(this, getChangeEventType(MapProperty.TARGET), this.handleTargetChanged, this);

    this.setProperties(optionsInternal.values);

    // this.overlays_ = optionsInternal.overlays;
    // this.overlays_.forEach(this.addOverlayInternal_.bind(this));

    // listen(this.overlays_, CollectionEventType.ADD, (event: CollectionEvent<Overlay<IOverlayOptions>>) => {
    //   this.addOverlayInternal_(event.element);
    // });

    // listen(this.overlays_, CollectionEventType.REMOVE, (event: CollectionEvent<Overlay<IOverlayOptions>>) => {
    //   this.removeOverlayInternal_(event.element);
    // });
  }

  private getTarget(): string | undefined {
    return this.get<string>('target');
  }

  private getTargetElement(): HTMLElement | null {
    const target = this.getTarget();
    if (target !== undefined) {
      return typeof target === 'string' ? document.getElementById(target) : target;
    } else {
      return null;
    }
  }

  private handleOverlayListChanged() {
    if (this.layerGroupPropertyListenerKeys) {
      this.layerGroupPropertyListenerKeys.forEach(unlistenByKey);
      this.layerGroupPropertyListenerKeys = undefined;
    }
    const layerList = this.getOverlays();
    layerList.setMap(this);
  }

  private handleLayerListChanged() {
    if (this.layerGroupPropertyListenerKeys) {
      this.layerGroupPropertyListenerKeys.forEach(unlistenByKey);
      this.layerGroupPropertyListenerKeys = undefined;
    }
    const layerList = this.getLayerList();

    layerList.setMap(this);

    // if (layerList) {
    //   this.layerGroupPropertyListenerKeys = [
    //     listen(layerList, BaseObjectEventType.PROPERTYCHANGE, this.startup, this),
    //     listen(layerList, BaseEventType.CHANGE, this.startup, this),
    //   ];
    // }
    // this.startup();
  }

  private handleTargetChanged() {
    if (this.ctrl) {
      return;
    }
    const targetElement = this.getTargetElement();

    if (!this.renderer_) {
      this.renderer_ = this.createRenderer();
    }

    if (this.keyHandlerKeys_) {
      for (let i = 0, ii = this.keyHandlerKeys_.length; i < ii; ++i) {
        unlistenByKey(this.keyHandlerKeys_[i]);
      }
      this.keyHandlerKeys_ = null;
    }

    if (!targetElement) {
      throw new TypeError('容器对象不存在');
    }
    if (targetElement.tagName !== 'OBJECT') {
      throw new TypeError('容器必须为 object 对象');
    }

    const keyboardEventTarget = !this.keyboardEventTarget_ ? targetElement : this.keyboardEventTarget_;
    this.keyHandlerKeys_ = [
      listen(keyboardEventTarget, BaseEventType.KEYDOWN, this.handleBrowserEvent, this),
      listen(keyboardEventTarget, BaseEventType.KEYPRESS, this.handleBrowserEvent, this),
    ];
    this.ctrl = targetElement as ITDECtrl;
  }
  /**
   * @param {Event} browserEvent Browser event.
   * @param {string} [optType] Type.
   */
  private handleBrowserEvent(browserEvent: Event, optType?: string) {
    const type = optType || browserEvent.type;
    // TODO: 再说
    console.log(type);
  }

  protected createRenderer(): MapRenderer {
    throw new Error('Use a map type that has a createRenderer method');
  }

  disposeInternal() {
    unlisten(this, getChangeEventType(MapProperty.LAYERLIST), this.handleLayerListChanged, this);
    unlisten(this, getChangeEventType(MapProperty.TARGET), this.handleTargetChanged, this);

    super.disposeInternal();
  }

  getCtrl() {
    return this.ctrl;
  }

  getVersion(): string {
    return this.getCtrl().InvokeCmd('CommonOper', 'GetVersion', null);
  }

  /**
   * 获取三维控件是32还是64位
   */
  getPlatform(): string {
    return this.getCtrl().InvokeCmd('CommonOper', 'GetPlatform', null);
  }

  getLayerList(): LayerList {
    const layers = this.get(MapProperty.LAYERLIST);
    assert(layers, AssertErrorCode.LAYERLIST_IS_NULL_IN_BASE_OF_MAP);
    return layers as LayerList;
  }

  addLayer(layer: Layer<ILayerOptions>) {
    this.getLayerList()
      .getLayers()
      .push(layer);
  }

  addLayers(layers: Layer<ILayerOptions>[]) {
    layers.forEach(layer => this.addLayer(layer));
  }

  /**
   * Removes the given layer from the map.
   * @param {Layer<ILayerOptions>} layer Layer.
   * @return {Layer<ILayerOptions>|undefined} The removed layer (or undefined if the layer was not found).
   */
  removeLayer(layer: Layer<ILayerOptions>): Layer<ILayerOptions> | undefined {
    const layers = this.getLayerList().getLayers();
    return layers.remove(layer);
  }

  isLayerExist(layerId: string): boolean {
    return !!this.getLayerList().getLayerById(layerId);
  }

  getLayerById(layerId: string) {
    return this.getLayerList().getLayerById(layerId);
  }

  getLayerNum(): number {
    return this.getLayerList()
      .getLayers()
      .getLength();
  }

  getLayerVisible(layerId: string): boolean {
    const layer = this.getLayerById(layerId);
    return layer ? layer.getVisible() : false;
  }

  setLayerVisible(layerId: string, visible: boolean) {
    const layer = this.getLayerById(layerId);
    layer && layer.setVisible(visible);
  }

  getLayerOpacity(layerId: string): number {
    const layer = this.getLayerById(layerId);
    return layer ? layer.getOpacity() : -1;
  }

  setLayerOpacity(layerId: string, opacity: number) {
    const layer = this.getLayerById(layerId);
    layer && layer.setOpacity(opacity);
  }

  getOverlays() {
    const overlays = this.get(MapProperty.OVERLAYLIST);
    assert(overlays, AssertErrorCode.LAYERLIST_IS_NULL_IN_BASE_OF_MAP);
    return overlays as OverlayList;
  }

  addOverlay(overlay: Overlay<IOverlayOptions>) {
    this.getOverlays()
      .getLayers()
      .push(overlay);
  }

  removeOverlay(overlay: Overlay<IOverlayOptions>) {
    return this.getOverlays()
      .getLayers()
      .remove(overlay);
  }

  getOverlayById(layerId: string): Overlay<IOverlayOptions> | undefined {
    const overlays = this.getOverlays();
    const [overlay] = overlays.getLayers().filter(layer => layer.getId() === layerId);
    return overlay;
  }

  getOverlayVisible(layerId: string): boolean {
    const layer = this.getOverlayById(layerId);
    return layer ? layer.getVisible() : false;
  }

  setOverlayVisible(layerId: string, visible: boolean) {
    const layer = this.getOverlayById(layerId);
    layer && layer.setVisible(visible);
  }

  getOverlayOpacity(layerId: string): number {
    const layer = this.getOverlayById(layerId);
    return layer ? layer.getOpacity() : -1;
  }

  setOverlayOpacity(layerId: string, opacity: number) {
    const layer = this.getOverlayById(layerId);
    layer && layer.setOpacity(opacity);
  }

  // setLayerColor(layerId: string, color: AutoColor) {}

  clearAllEffect() {}

  setHightLightOff() {}

  addTouchRegion() {}

  jumpToLayer() {}

  // centerAt(point: ViewPoint) {}

  // getCenterViewPoint(): ViewPoint {}

  // setUnderGroundView(hight: number) {}

  closeUnderGroundView() {}
}
