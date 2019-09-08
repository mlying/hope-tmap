import BaseMap from './BaseMap';
import ScreenMapRenderer from '../renderer/ScreenMapRenderer';

export default class ScreenMap extends BaseMap {
  createRenderer(): ScreenMapRenderer {
    return new ScreenMapRenderer(this);
  }
}
