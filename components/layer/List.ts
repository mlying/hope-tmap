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

    this.set(Property.LAYERS, layers);
  }

  private addLayerInternal_(layer: Layer<ILayerOptions>) {
    layer.setMap(this.getMap());
    layer.startup();
  }

  private handleLayersChanged_() {
    this.layersListenerKeys_.forEach(unlistenByKey);
    this.layersListenerKeys_.length = 0;

    const layers = this.getLayers();
    this.layersListenerKeys_.push(
      listen(layers, CollectionEventType.ADD, (collectionEvent: CollectionEvent<Layer<ILayerOptions>>) => {
        this.handleLayersAdd_(collectionEvent);
      }),
      listen(layers, CollectionEventType.REMOVE, (collectionEvent: CollectionEvent<Layer<ILayerOptions>>) => {
        this.handleLayersRemove_(collectionEvent);
      })
    );

    // for (const id in this.listenerKeys_) {
    //   this.listenerKeys_[id].forEach(unlistenByKey);
    // }
    // clear(this.listenerKeys_);

    // layers
    //   .filter(layer => layer)
    //   .forEach(layer => {
    //     this.listenerKeys_[getUid(layer)] = [
    //       listen(layer, BaseObjectEventType.PROPERTYCHANGE, this.handleLayerChange_, this),
    //       listen(layer, BaseEventType.CHANGE, this.handleLayerChange_, this),
    //     ];
    //   });

    // this.changed();
  }

  /**
   * @param {CollectionEvent<Layer<ILayerOptions>>} collectionEvent CollectionEvent.
   * @private
   */
  private handleLayersAdd_(collectionEvent: CollectionEvent<Layer<ILayerOptions>>) {
    const layer = collectionEvent.element;
    layer.setMap(this.getMap());
    layer.startup();

    // this.listenerKeys_[getUid(layer)] = [
    //   listen(layer, BaseObjectEventType.PROPERTYCHANGE, this.handleLayerChange_, this),
    //   listen(layer, BaseEventType.CHANGE, this.handleLayerChange_, this),
    // ];
    // this.changed();
  }

  /**
   * @param {CollectionEvent<Layer<ILayerOptions>>} collectionEvent CollectionEvent.
   * @private
   */
  private handleLayersRemove_(collectionEvent: CollectionEvent<Layer<ILayerOptions>>) {
    const layer = collectionEvent.element;
    layer.dispose();
    // const key = getUid(layer);
    // this.listenerKeys_[key].forEach(unlistenByKey);
    // delete this.listenerKeys_[key];
    // this.changed();
  }

  private handleLayerChange_() {
    this.changed();
  }

  startup() {}

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
