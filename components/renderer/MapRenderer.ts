import Disposable from '../_utils/Disposable';
import BaseMap, { IFrameState } from '../map/BaseMap';

export default abstract class MapRenderer extends Disposable {
  protected map_: BaseMap;
  /**
   * @param {import("../PluggableMap.js").default} map Map.
   */
  constructor(map: BaseMap) {
    super();

    this.map_ = map;
  }

  abstract renderFrame(frameState: IFrameState): void;

  /**
   * @return {BaseMap} Map.
   */
  getMap(): BaseMap {
    return this.map_;
  }
}
