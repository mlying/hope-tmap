import BaseOverlay, { IBaseOverlayOptions } from './BaseOverlay';
import MapProperty from '../map/Property';

export interface IOverlayOptions extends IBaseOverlayOptions {}

export default class Overlay<T extends IOverlayOptions> extends BaseOverlay<T> {
  startup() {
    const params = [this.getId()];
    this.getCtrl().InvokeCmd('BaseLayerOper', 'Create', params);
  }

  dispose() {
    this.set(MapProperty.MAP, undefined);

    const params = [this.getId()];
    this.getCtrl().InvokeCmd('BaseLayerOper', 'Remove', params);
  }
}
