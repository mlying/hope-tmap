import BaseOverlay, { IBaseOverlayOptions } from './BaseOverlay';
import MapProperty from '../map/Property';
import Feature from '../feature';
import { IFeatureProps } from '../feature/Feature';
import Collection from '../_utils/Collection';
import { listen, EventsKey, unlistenByKey } from '../_utils/events';
import { getChangeEventType } from '../_utils/BaseObject';
import CollectionEventType from '../_utils/CollectionEventType';
import CollectionEvent from '../_utils/CollectionEvent';

enum Property {
  FEATURES = 'features',
}

export interface IOverlayOptions extends IBaseOverlayOptions {}

export default class Overlay<T extends IOverlayOptions> extends BaseOverlay<T> {
  private featuresListenerKeys_: EventsKey[];
  constructor(options: T) {
    super(options);

    listen(this, getChangeEventType(Property.FEATURES), this.handleFeaturesChanged_, this);

    let features = options.features;
    features.forEach(this.addFeatureInternal_.bind(this));

    this.set(Property.FEATURES, features);
  }

  private addFeatureInternal_(feature: Feature<IFeatureProps>) {
    feature.setMap(this.getMap());
    feature.startup();
  }

  private handleFeaturesChanged_() {
    this.featuresListenerKeys_.forEach(unlistenByKey);
    this.featuresListenerKeys_.length = 0;

    const features = this.getFeatures();
    this.featuresListenerKeys_.push(
      listen(features, CollectionEventType.ADD, (collectionEvent: CollectionEvent<Feature<IFeatureProps>>) => {
        this.handleFeaturesAdd_(collectionEvent);
      }),
      listen(features, CollectionEventType.REMOVE, (collectionEvent: CollectionEvent<Feature<IFeatureProps>>) => {
        this.handleFeaturesRemove_(collectionEvent);
      })
    );
  }

  private handleFeaturesAdd_(collectionEvent: CollectionEvent<Feature<IFeatureProps>>) {
    const feature = collectionEvent.element;
    feature.setMap(this.getMap());
    feature.startup();

    // this.listenerKeys_[getUid(layer)] = [
    //   listen(layer, BaseObjectEventType.PROPERTYCHANGE, this.handleLayerChange_, this),
    //   listen(layer, BaseEventType.CHANGE, this.handleLayerChange_, this),
    // ];
    this.changed();
  }

  private handleFeaturesRemove_(collectionEvent: CollectionEvent<Feature<IFeatureProps>>) {
    const feature = collectionEvent.element;
    feature.dispose();
    // const key = getUid(layer);
    // this.listenerKeys_[key].forEach(unlistenByKey);
    // delete this.listenerKeys_[key];
    this.changed();
  }

  getFeatures() {
    return this.get(Property.FEATURES) as Collection<Feature<IFeatureProps>>;
  }

  addFeature(feature: Feature<IFeatureProps>) {
    this.getFeatures().push(feature);
  }

  removeFeature(feature: Feature<IFeatureProps>) {
    this.getFeatures().remove(feature);
  }

  removeAllFeatures() {
    this.getFeatures().clear();
  }

  startup() {
    const params = [this.getId()];
    this.getCtrl().InvokeCmd('BaseLayerOper', 'Create', params);
  }

  disposeInternal() {
    this.set(MapProperty.MAP, undefined);

    const params = [this.getId()];
    this.getCtrl().InvokeCmd('BaseLayerOper', 'Remove', params);
  }
}
