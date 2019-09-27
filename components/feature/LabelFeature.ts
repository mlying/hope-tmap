import Feature, { IFeatureProps } from './Feature';
import Collection from '../_utils/Collection';
import Geometry, { IGeometryProps } from '../geom/Geometry';
import { listen, EventsKey, unlistenByKey } from '../_utils/events';
import { getChangeEventType } from '../_utils/BaseObject';

enum Property {
  GEOMETRY = 'geometry'
}
enum LableFeatureProperty {
  LAYERID = 'LayerID',
  LABELID = 'LabelID',
  TEXT = 'Text',
  URL = 'Url',
  TYPE = 'Type',
  SCALE = 'Scale',
  FONTSIZE = 'FontSize',
  OPACITY = 'Opacity',
  FONTCOLOR = 'FontColor',
  BORDERCOLOR = 'BorderColor',
  BACKGROUNDCOLOR = 'BackGroundColor',
  VISIBLEDISTANCE = 'VisibleDistance',
  BUBBLETIPSTYLE = 'BubbleTipStyle'
}

export interface ILableFeatureProps extends IFeatureProps {
  geom: Collection<Geometry<IGeometryProps>>,
  attr: any,
}

export interface ILableAttrProps {
  LayerID: string;
  LabelID: string;
  Text: string;
  Url: string;
  Type: string;
  Scale: number;
  FontSize: number;
  Opacity: number;
  FontColor: number;
  BorderColor: number;
  BackGroundColor: number;
  VisibleDistance: number;
  BubbleTipStyle: string; 
}

// 统一传入参数大小写
export interface IFormatProps {
  layerId: string;
  labelId: string;
  text: string;
  url: string;
  type: string;
  scale: number;
  fontSize: number;
  opacity: number;
  fontColor: number;
  borderColor: number;
  backGroundColor: number;
  visibleDistance: number;
  bubbleTipStyle: string; 
}

export default class LabelFeature extends Feature<ILableFeatureProps> {
  private featuresListenerKeys_: EventsKey[];
  protected layerId: string;
  protected labelId: string;
  protected geom: Geometry<IGeometryProps>;
  protected attr: ILableAttrProps = {
    LayerID: '',
    LabelID: '',
    Text: '',
    Url: '',
    Type: 'TextAndIcon',
    Scale: 1.0,
    FontSize: 12,
    Opacity: 0.8,
    FontColor: 0xFFFFFFFF,
    BorderColor: 0x000000FF,
    BackGroundColor: 0xFFFFFFFF,
    VisibleDistance: 5000,
    BubbleTipStyle: 'bw:1.2;aw:20;ah:40;cr:8'
  };

  constructor(options: ILableFeatureProps) {
    super(options);

    const properties: ILableFeatureProps = Object.assign({}, options);
    const arrts: IFormatProps = options.attr;
    const geoms = options.geom;
    
    listen(this, getChangeEventType(Property.GEOMETRY), this.handGeomChanged_, this);

    this.attr[LableFeatureProperty.LAYERID] = typeof arrts.layerId !== undefined ? arrts.layerId : this.getDefaultLayerId();
    this.attr[LableFeatureProperty.LABELID] = typeof arrts.labelId !== undefined ? arrts.labelId : this.getDefaultFeatureId();
    this.attr[LableFeatureProperty.TEXT] = arrts.text || '';
    this.attr[LableFeatureProperty.URL] = arrts.url || '';
    this.attr[LableFeatureProperty.TYPE] = arrts.type || 'TextAndIcon';

    this.setProperties(properties);
    this.layerId = arrts.layerId || this.getDefaultLayerId();
    this.labelId = arrts.labelId || this.getDefaultFeatureId();
  }

  private handGeomChanged_() {
    this.featuresListenerKeys_.forEach(unlistenByKey);
    this.featuresListenerKeys_.length = 0;
    const geometry = this.getGeometry();
    
  }

  getGeometry() {
    return this.get(Property.GEOMETRY) as Collection<Geometry<IGeometryProps>>;
  }

  startup() {
    const params = [JSON.stringify(this.getProperties())];
    this.getCtrl().InvokeCmd('LabelOper', 'AddLabel', params);
  }

  disposeInternal() {
    const params = [this.layerId, this.labelId];
    this.getCtrl().InvokeCmd('LabelOper', 'RemoveLabel', params);
  }
}
