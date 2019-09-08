import BaseLayer, { IBaseLayerOptions } from './Base';
import Feature from '../feature/Feature';
import { IpositionObj, IfeatureInfo } from './interface';
import { getUid } from '../_utils/util';

export interface ILayerOptions extends IBaseLayerOptions {
  id: string;
  xmlUrl: string;
}

enum GroupLayerProperty {
  XML_URL = 'xmlUrl',
}

export default class GroupLayer extends BaseLayer<ILayerOptions> {
  id: string;
  xmlUrl: string;
  constructor(options: ILayerOptions) {
    const properties: ILayerOptions = Object.assign({}, options);
    properties[GroupLayerProperty.XML_URL] = options.xmlUrl;

    super(properties);

    this.id = options.id || getUid(this);
  }

  private getCtrl() {
    return this.getMap().getCtrl();
  }

  private getXmlUrl() {
    return this.get<string>(GroupLayerProperty.XML_URL) as string;
  }

  startup() {
    const params = [this.getXmlUrl()];
    this.getCtrl().InvokeCmd('CommonOper', 'LoadXML', params);
  }

  /**
   * 三维查询
   * @param layerId
   * @param whereClause
   */
  selectFeature(layerId: string, whereClause: string): Feature {
    let param: string[] = [layerId, whereClause];
    let result: any;
    try {
      result = this.getCtrl().InvokeCmd('BaseLayerOper', 'SelectFeature', param);
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  /**
   * 查询三维db图层中的三维要素,并且赋予特效
   * @param layerId
   * @param whereClause
   * @param effect
   */
  selectFeatureAndEffect(layerId: string, whereClause: string, effect: string): Feature {
    let param: string[] = [layerId, whereClause, effect];
    let result: any;
    try {
      result = this.getCtrl().InvokeCmd('BaseLayerOper', 'SelectFeatureAndEffect', param);
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  /**
   * 查询图层附近的要素
   * @param layerId
   * @param wherePoint
   * @param nearRange
   */
  selectNearFeature(layerId: string, wherePoint: string, nearRange: number): Feature {
    let param: [string, string, any] = [layerId, wherePoint, nearRange];
    let result: any;
    try {
      result = this.getCtrl().InvokeCmd('BaseLayerOper', 'SelectNearFeature', param);
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  /**
   * 清除所有场景要素、图层特效
   * @param layerId
   */
  clearAllEffect(layerId: string): void {
    try {
      this.getCtrl().InvokeCmd('BaseLayerOper', 'ClearAllEffect', []);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 设置要素透明度
   * @param layerId
   * @param featureId
   * @param opacity
   */
  setFeatureOpacity(layerId: string, featureId: string, opacity: number): void {
    try {
      this.setFeatureEffect(layerId, featureId, '', '', 'effect:transparent;color:1.0 1.0 1.0 ' + opacity);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 设置三维要素特效
   * @param layerId
   * @param featureId
   * @param gid
   * @param table
   * @param effect
   */
  setFeatureEffect(layerId: string, featureId: string, gid: string, table: string, effect: string): void {
    let param = [JSON.stringify({ FeatureID: featureId, LayerID: layerId, Effect: effect, GID: gid, Table: table })];
    try {
      this.getCtrl().InvokeCmd('BaseLayerOper', 'SetFeatureEffect', param);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 清除特定图层效果
   * @param layerId
   */
  clearLayerEffect(layerId: string): void {
    let temp = { LayerID: layerId, Effect: '' };
    let param: string[] = [JSON.stringify(temp)];
    try {
      this.getCtrl().InvokeCmd('BaseLayerOper', 'SetFeatureEffect', param);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 清除特定对象要素效果
   * @param layerId
   * @param featureId
   * @param gid
   * @param table
   */
  clearFeatureEffect(layerId: string, featureId: string, gid: string, table: string): void {
    this.setFeatureEffect(layerId, featureId, gid, table, '');
  }

  /**
   * 根据GID获取要素
   * @param gid
   * @param table
   */
  getFeatureByGID(gid: string, table: string): IfeatureInfo {
    let param: string[] = [gid, table.toLowerCase()];
    let result: IfeatureInfo = { featureID: '', layerID: '' };
    try {
      let str: string = this.getCtrl().InvokeCmd('BaseLayerOper', 'GetFeatureByGID', param);
      if (str !== '') {
        result.featureID = str.split(',')[0];
        result.layerID = str.split(',')[1];
      }
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  /**
   * 获取要素空间位置
   * @param layerId
   * @param featureId
   */
  getFeaturePosition(layerId: string, featureId: string): IpositionObj {
    return this.getFeaturePositionEx(layerId, featureId);
  }

  /**
   * 获取要素空间位置
   * @param layerId
   * @param featureId
   * @param gid
   * @param table
   */
  getFeaturePositionEx(layerId: string, featureId: string, gid?: string, table?: string): IpositionObj {
    let param = [layerId, featureId, gid, table];
    let result: any;
    try {
      let str: string = this.getCtrl().InvokeCmd('BaseLayerOper', 'GetFeaturePosition', param);
      if (str !== '' && Object.keys(JSON.parse(str)).length > 0) {
        let value = Object.values(JSON.parse(str));
        if (Object.keys(value).length > 0) {
          result = value[0];
        }
      }
    } catch (error) {
      console.log(error);
    }
    return result;
  }

  /**
   * 设置要素是否可见
   * @param layerId
   * @param featureId
   * @param visible
   */
  setFeatureVisible(layerId: string, featureId: Feature[], visible: boolean): void {
    let param = [featureId, layerId, visible];
    try {
      this.getCtrl().InvokeCmd('BaseLayerOper', 'SetFeatureVisible', param);
    } catch (error) {
      console.log(error);
    }
  }
}
