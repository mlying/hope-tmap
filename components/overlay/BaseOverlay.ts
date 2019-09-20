import BaseObject, { IBaseObject } from '../_utils/BaseObject';
import BaseMap from '../map/BaseMap';
import { getUid } from '../_utils/util';
import { Dictionary } from '../_utils/interface';
import OverlayProperty from './Property';
import AssertErrorCode from '../_utils/AssertErrorCode';
import { assert } from '../_utils/assert';
import MapProperty from '../map/Property';
import Feature from '../feature';
import { IFeatureProps } from '../feature/Feature';

export interface IBaseOverlayOptions extends IBaseObject {
  id?: string;
  visible?: boolean;
  opacity?: number;
}

export default abstract class BaseOverlay<T extends IBaseOverlayOptions> extends BaseObject<T> {
  protected options: T;
  protected id: string;
  protected visible: boolean;
  protected opacity: number;
  /**
   * @param {Options} options Overlay options.
   */
  constructor(options: T) {
    super();

    this.options = options;

    const properties: Dictionary<any> = Object.assign({}, options);
    properties[OverlayProperty.OPACITY] = options.opacity !== undefined ? options.opacity : 1;
    assert(typeof properties[OverlayProperty.OPACITY] === 'number', AssertErrorCode.LAYER_OPACITY_IS_NOT_NUMBER);
    properties[OverlayProperty.VISIBLE] = options.visible !== undefined ? options.visible : true;

    this.setProperties(properties);

    this.id = options.id || getUid(this);
  }

  protected getCtrl() {
    return this.getMap().getCtrl();
  }

  /**
   * Get the overlay identifier which is set on constructor.
   * @return {string} Id.
   * @api
   */
  getId(): string {
    return this.id;
  }

  setMap(map: BaseMap) {
    this.set(MapProperty.MAP, map);
  }

  /**
   * Get the map associated with this overlay.
   * @return {import("./PluggableMap.js").default} The map that the overlay is part of.
   * @observable
   * @api
   */
  getMap(): BaseMap {
    return this.get(MapProperty.MAP) as BaseMap;
  }

  /**
   * returns the options this Overlay has been created with
   * @return {IBaseOverlayOptions} overlay options
   */
  getOptions(): IBaseOverlayOptions {
    return this.options;
  }

  getVisible() {
    return this.get<boolean>(OverlayProperty.VISIBLE) as boolean;
  }

  setVisible(visibile: boolean) {
    this.set(OverlayProperty.VISIBLE, visibile);
  }

  getOpacity() {
    return this.get<number>(OverlayProperty.OPACITY) as number;
  }

  setOpacity(opacity: number) {
    this.set(OverlayProperty.OPACITY, opacity);
  }

  addFeature(feature: Feature<IFeatureProps>) {}
  removeFeature(feature: Feature<IFeatureProps>) {}
  removeAllFeatures() {}
  hideFeature(featureId: string) {}
  hideAllFeatures() {}
}
