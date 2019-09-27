import BaseFeature, { IBaseFeatureProps } from './Base';
import LabelFeature from './LabelFeature';
import ImageFeature from './ImageFeature';
import Geometry, { IGeometryProps } from '../geom/Geometry';
import { listen } from '../_utils/events';

export interface IFeatureProps extends IBaseFeatureProps {
  // geom: Geometry<IGeometryProps>;
  // attr: any;
  id?: string
}

export default class Feature<T extends IFeatureProps> extends BaseFeature<T> {
  static LabelFeature = LabelFeature;
  static ImageFeature = ImageFeature;
  // private geom: Geometry<IGeometryProps>;
  // protected attr: any;
  protected id: string;
  constructor(props: T) {
    super(props);

    // this.geom = props.geom;
    // this.attr = props.attr;

    // listen(this.geom, '', this.handleGemoChange, this);
    // listen(this.attr, '', this.handleAttrChange, this);
  }

  private handleGemoChange(){

    this.startup();
  }

  private handleAttrChange(){

    this.startup();
  }

  // getAttrs() {
  //   return this.attr;
  // }

  startup() {}

  getDefaultLayerId(): string {
    return this.getCtrl().InvokeCmd("BaseLayerOper", "GetTempFeatureLayer", []);
  }

  // 从1开始增长
  getDefaultFeatureId(): string {
    
    return '';
  }

  // disposeInternal() {
  //   const param = [this.getIds()];
  //   this.getCtrl().InvokeCmd("BaseLayerOper", "RemoveFeature", param);
  // }

  // update() {
  //   const param = [this.getIds()];
  //   this.getCtrl().InvokeCmd("BaseLayerOper", "UpdateFeature", param);
  // }

}
