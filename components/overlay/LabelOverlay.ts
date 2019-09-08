import Overlay, { IOverlayOptions } from './Overlay';

export interface ILabelOverlayOptions extends IOverlayOptions {}

export default class LabelOverlay extends Overlay<ILabelOverlayOptions> {
  startup() {
    const params = [this.id];
    this.getCtrl().InvokeCmd('BaseLayerOper', 'GetTempLabelLayer', params);
  }
}
