
import BaseFeature from './Base';

export interface ILableFeatureOption {
  vecotorID: string;
  layerID: string;
  geom: string;
  lineColor: number;
  fillColor: number;
  lineWidth: number;
  offsetHeight: number;
  stipple: number;
}

export default class LabelFeature extends BaseFeature<ILableFeatureOption> {
  vecotorID = "";
  layerID = "";
  geom = "";
  lineColor = 0xFFFF00FF;
  fillColor = 0x00333366;
  lineWidth = 1.0;
  offsetHeight = 0.0;
  stipple = 0;

  constructor(options: ILableFeatureOption) {
    super(options);
    this.vecotorID = options.vecotorID;
    this.layerID = options.layerID;
    this.geom = JSON.stringify(options.geom);
  }

  private getCtrl() {
    return this.getMap().getCtrl();
  }

  startup() {
    const params = [this];
    this.getCtrl().InvokeCmd("LabelOper", "AddLabel", params);
  }

}