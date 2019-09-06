import BaseLayer, { IBaseLayer } from './Base';
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

enum Property {
  LAYERS = 'layers',
}

export interface IGroupLayer extends IBaseLayer {
  layers: BaseLayer<IBaseLayer>[] | Collection<BaseLayer<IBaseLayer>>;
}

export default class GroupLayer extends BaseLayer<IGroupLayer> {
  private layersListenerKeys_: EventsKey[];
  private listenerKeys_: Dictionary<EventsKey[]>;
  constructor(options: IGroupLayer) {
    const baseOptions = Object.assign({}, options || {});
    delete baseOptions.layers;

    let layers = options.layers;

    super(baseOptions);

    this.layersListenerKeys_ = [];
    this.listenerKeys_ = {};

    listen(this, getChangeEventType(Property.LAYERS), this.handleLayersChanged_, this);

    if (layers) {
      if (Array.isArray(layers)) {
        layers = new Collection({ arr: layers.slice(), options: { unique: true } });
      } else {
        // layers 应该为 array 或者 Collection
        assert(typeof layers.getArray === 'function', 43);
      }
    } else {
      layers = new Collection({ arr: [], options: { unique: true } });
    }

    this.setLayers(layers);
  }

  setLayers(layers: Collection<BaseLayer<IBaseLayer>>) {
    this.set(Property.LAYERS, layers);
  }

  getLayers(): Collection<BaseLayer<IBaseLayer>> {
    return this.get(Property.LAYERS) || new Collection({ arr: [], options: { unique: true } });
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

    const layersArray = layers.getArray();
    for (let i = 0, ii = layersArray.length; i < ii; i++) {
      const layer = layersArray[i];
      if (layer) {
        this.listenerKeys_[getUid(layer)] = [
          listen(layer, BaseObjectEventType.PROPERTYCHANGE, this.handleLayerChange_, this),
          listen(layer, BaseEventType.CHANGE, this.handleLayerChange_, this),
        ];
      }
    }

    this.changed();
  }

  /**
   * @param {CollectionEvent} collectionEvent CollectionEvent.
   * @private
   */
  private handleLayersAdd_(collectionEvent: CollectionEvent) {
    const layer = collectionEvent.element;
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
  private handleLayersRemove_(collectionEvent: CollectionEvent) {
    const layer = collectionEvent.element;
    const key = getUid(layer);
    this.listenerKeys_[key].forEach(unlistenByKey);
    delete this.listenerKeys_[key];
    this.changed();
  }

  private handleLayerChange_() {
    this.changed();
  }
}
