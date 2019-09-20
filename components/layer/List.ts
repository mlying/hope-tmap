import BaseLayer, { IBaseLayerOptions } from './Base';
import Layer, { ILayerOptions } from './Layer';
import Collection from '../_utils/Collection';
import { EventsKey, listen, unlistenByKey } from '../_utils/events';
import { Dictionary } from '../_utils/interface';
import { getChangeEventType } from '../_utils/BaseObject';
import { assert } from '../_utils/assert';
import CollectionEventType from '../_utils/CollectionEventType';
import CollectionEvent from '../_utils/CollectionEvent';
import { getUid } from '../_utils/util';
import BaseEventType from '../_utils/events/BaseEventType';
import BaseObjectEventType from '../_utils/BaseObjectEventType';
import { clear } from '../_utils/obj';
import AssertErrorCode from '../_utils/AssertErrorCode';

enum Property {
  LAYERS = 'layers',
}

export interface ILayerList extends IBaseLayerOptions {
  layers: Layer<ILayerOptions>[] | Collection<Layer<ILayerOptions>>;
}

export default class LayerList extends BaseLayer<ILayerList> {
  /**
   * 图层组的事件监听
   */
  private layersListenerKeys_: EventsKey[];
  /**
   * 图层的事件监听
   */
  private listenerKeys_: Dictionary<EventsKey[]>;
  constructor(options: ILayerList) {
    const baseOptions = Object.assign({}, options || {});
    delete baseOptions.layers;

    let layers = options.layers;

    super(baseOptions);

    this.layersListenerKeys_ = [];
    this.listenerKeys_ = {};

    listen(this, getChangeEventType(Property.LAYERS), this.handleLayersChanged_, this);

    if (layers) {
      if (Array.isArray(layers)) {
        layers = new Collection<Layer<ILayerOptions>>(layers.slice(), { unique: true });
      } else {
        // layers 应该为 array 或者 Collection
        assert(typeof layers.getArray === 'function', AssertErrorCode.LAYERS_IS_NOT_ARRAY_AND_COLLECTION);
      }
    } else {
      layers = new Collection<Layer<ILayerOptions>>([], { unique: true });
    }

    layers.forEach(this.addLayerInternal_.bind(this));

    this.setLayers(layers);
  }

  private addLayerInternal_(layer: Layer<ILayerOptions>) {
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

    layers
      .filter(layer => layer)
      .forEach(layer => {
        this.listenerKeys_[getUid(layer)] = [
          listen(layer, BaseObjectEventType.PROPERTYCHANGE, this.handleLayerChange_, this),
          listen(layer, BaseEventType.CHANGE, this.handleLayerChange_, this),
        ];
      });

    this.changed();
  }

  /**
   * @param {CollectionEvent} collectionEvent CollectionEvent.
   * @private
   */
  private handleLayersAdd_(collectionEvent: CollectionEvent<any>) {
    const layer = collectionEvent.element;
    layer.startup();

    this.listenerKeys_[getUid(layer)] = [
      listen(layer, BaseObjectEventType.PROPERTYCHANGE, this.handleLayerChange_, this),
      listen(layer, BaseEventType.CHANGE, this.handleLayerChange_, this),
    ];
    this.changed();
  }

  /**
   * @param {import("../Collection.js").CollectionEvent} collectionEvent CollectionEvent.
   * @private
   */
  private handleLayersRemove_(collectionEvent: CollectionEvent<any>) {
    const layer = collectionEvent.element;
    const key = getUid(layer);
    this.listenerKeys_[key].forEach(unlistenByKey);
    delete this.listenerKeys_[key];
    this.changed();
  }

  private handleLayerChange_() {
    this.changed();
  }

  setLayers(layers: Collection<Layer<ILayerOptions>>) {
    this.set(Property.LAYERS, layers);
  }

  getLayers() {
    const layers = this.get(Property.LAYERS);
    assert(layers, AssertErrorCode.LAYERS_IS_NULL_IN_LIST_OF_LAYER);
    return layers as Collection<Layer<ILayerOptions>>;
  }

  getLayerById(layerId: string): Layer<ILayerOptions> | undefined {
    const list = this.getLayers();
    const [layer] = list.filter(layer => layer.getId() === layerId);
    return layer;
  }
}
