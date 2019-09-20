import Feature, { IFeatureProps } from './Feature';

export interface StartupParams {
  Name: string;
  Url: string;
  HorizonALIGN: string;
  VerticalALIGN: string;
  Mergin: string;
  Height: number;
  Width: number;
}

export interface IImageFeature extends IFeatureProps, StartupParams {
  name: string;
  url: string;
  horizonAlign: string;
  verticalAlign: string;
  mergin: string;
  height: number;
  width: number;
}

export default class ImageFeature extends Feature<IImageFeature> {
  private startupParams: StartupParams;
  constructor(props: IImageFeature) {
    super(props);

    this.startupParams = {
      Name: props.name,
      Url: props.url,
      HorizonALIGN: props.horizonAlign,
      VerticalALIGN: props.verticalAlign,
      Mergin: props.mergin,
      Height: props.height,
      Width: props.width,
    };
  }
  startup() {
    const params = [JSON.stringify(this.startupParams)];
    this.getCtrl().InvokeCmd('CommonOper', 'AddCustomImage', params);
  }

  disposeInternal() {
    const params = [this.startupParams.Name];
    this.getCtrl().InvokeCmd('CommonOper', 'RemoveCustomImage', params);

    super.disposeInternal();
  }
}
