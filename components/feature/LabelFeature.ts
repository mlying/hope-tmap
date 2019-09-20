import BaseFeature, { IFeatureProps } from './Feature';

export interface StartupParams {
  LabelID: string;
  LayerID: string;
  Text: string;
  Url: string;
  Type: 'TextAndIcon';
  OffsetX: number;
  OffsetY: number;
  OffsetZ: number;
  Scale: number;
  FontSize: number;
  Opacity: number;
  FontColor: number;
  BorderColor: number;
  BackGroundColor: number;
  VisibleDistance: number;
  // [bw]border width,[aw]arrow width,[ah]arraow heigth,[cr]corner radius
  BubbleTipStyle: 'bw:1.2;aw:20;ah:40;cr:8';
}

export interface ILableFeatureOption extends IFeatureProps {
  labelID: string;
  layerID: string;
  text: string;
  url: string;
  type: 'TextAndIcon';
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  scale: number;
  fontSize: number;
  opacity: number;
  fontColor: number;
  borderColor: number;
  backGroundColor: number;
  visibleDistance: number;
  // [bw]border width,[aw]arrow width,[ah]arraow heigth,[cr]corner radius
  bubbleTipStyle: 'bw:1.2;aw:20;ah:40;cr:8';
}

export default class LabelFeature extends BaseFeature<ILableFeatureOption> {
  private startupParams: StartupParams;

  constructor(options: ILableFeatureOption) {
    super(options);

    this.startupParams = {
      LabelID: options.labelID,
      LayerID: options.layerID,
      Text: options.text,
      Url: options.url,
      Type: options.type,
      OffsetX: options.offsetX,
      OffsetY: options.offsetY,
      OffsetZ: options.offsetZ,
      Scale: options.scale,
      FontSize: options.fontSize,
      Opacity: options.opacity,
      FontColor: options.fontColor,
      BorderColor: options.borderColor,
      BackGroundColor: options.backGroundColor,
      VisibleDistance: options.visibleDistance,
      BubbleTipStyle: options.bubbleTipStyle,
    };
  }

  startup() {
    const params = [JSON.stringify(this.startupParams)];
    this.getCtrl().InvokeCmd('LabelOper', 'AddLabel', params);
  }

  disposeInternal() {
    const params = [this.startupParams.LabelID, this.startupParams.LayerID];
    this.getCtrl().InvokeCmd('LabelOper', 'RemoveLabel', params);
  }
}
