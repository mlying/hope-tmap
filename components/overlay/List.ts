import OverLay, { IOverlayOptions } from './OverLay';
import Collection from '../_utils/Collection';
import { EventsKey, listen, unlistenByKey } from '../_utils/events';
import { Dictionary } from '../_utils/interface';
import { getChangeEventType } from '../_utils/BaseObject';
import { assert } from '../_utils/assert';
import CollectionEventType from '../_utils/CollectionEventType';
import CollectionEvent from '../_utils/CollectionEvent';
import { clear } from '../_utils/obj';
import AssertErrorCode from '../_utils/AssertErrorCode';
import BaseOverlay, { IBaseOverlayOptions } from './BaseOverlay';

enum Property {
  OVERLAYS = 'overlays',
}

export interface IOverLayList extends IBaseOverlayOptions {
  layers: OverLay<IOverlayOptions>[] | Collection<OverLay<IOverlayOptions>>;
}

export default class OverlayList extends BaseOverlay<IOverLayList> {
  /**
   * 图层组的事件监听
   */
  private layersListenerKeys_: EventsKey[];
  /**
   * 图层的事件监听
   */
  private listenerKeys_: Dictionary<EventsKey[]>;
  constructor(options: IOverLayList) {
    const baseOptions = Object.assign({}, options || {});
    delete baseOptions.layers;

    let layers = options.layers;

    super(baseOptions);

    this.layersListenerKeys_ = [];
    this.listenerKeys_ = {};

    listen(this, getChangeEventType(Property.OVERLAYS), this.handleLayersChanged_, this);

    if (layers) {
      if (Array.isArray(layers)) {
        layers = new Collection<OverLay<IOverlayOptions>>(layers.slice(), { unique: true });
      } else {
        // layers 应该为 array 或者 Collection
        assert(typeof layers.getArray === 'function', AssertErrorCode.LAYERS_IS_NOT_ARRAY_AND_COLLECTION);
      }
    } else {
      layers = new Collection<OverLay<IOverlayOptions>>([], { unique: true });
    }

    layers.forEach(this.addLayerInternal_.bind(this));

    this.setLayers(layers);
  }

  private addLayerInternal_(layer: OverLay<IOverlayOptions>) {
    layer.setMap(this.getMap());
  }

  private handleLayersChanged_() {
    this.layersListenerKeys_.forEach(unlistenByKey);
    this.layersListenerKeys_.length = 0;

    const layers = this.getLayers();
    this.layersListenerKeys_.push(
      listen(layers, CollectionEventType.ADD, this.handleLayersAdd_, this),
      listen(layers, CollectionEventType.REMOVE, this.handleLayersRemove_, this)
    );

    for (const id in this.listenerKeys_) {
      this.listenerKeys_[id].forEach(unlistenByKey);
    }
    clear(this.listenerKeys_);

    this.changed();
  }

  /**
   * @param {CollectionEvent} collectionEvent CollectionEvent.
   * @private
   */
  private handleLayersAdd_(collectionEvent: CollectionEvent<OverLay<IOverlayOptions>>) {
    const overlay = collectionEvent.element;
    overlay.startup();
  }

  /**
   * @param {CollectionEvent} collectionEvent CollectionEvent.
   * @private
   */
  private handleLayersRemove_(collectionEvent: CollectionEvent<OverLay<IOverlayOptions>>) {
    const overlay = collectionEvent.element;
    overlay.dispose();
  }

  setLayers(layers: Collection<OverLay<IOverlayOptions>>) {
    this.set(Property.OVERLAYS, layers);
  }

  getLayers() {
    return this.get(Property.OVERLAYS) as Collection<OverLay<IOverlayOptions>>;
  }

  getLayerById(layerId: string): OverLay<IOverlayOptions> | undefined {
    const list = this.getLayers();
    const [layer] = list.filter(layer => layer.getId() === layerId);
    return layer;
  }
}
