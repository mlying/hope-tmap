import BaseMap from './BaseMap';
import MapRenderer from '../renderer/MapRenderer';
import ScreenMapRenderer from '../renderer/ScreenMapRenderer';

export default class ScreenMap extends BaseMap {
  createRenderer(): MapRenderer {
    const renderer = new ScreenMapRenderer(this);
    return renderer;
  }
}
