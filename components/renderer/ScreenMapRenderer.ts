import MapRenderer from './MapRenderer';

export default class ScreenMapRenderer extends MapRenderer {
  renderFrame(frameState) {
    // layerStatesArray.forEach(layerState => {
    //   const layer = layerState.layer;
    //   const layerRenderer = /** @type {import("./Layer.js").default} */ this.getLayerRenderer(layer);
    //   if (!visibleAtResolution(layerState, viewResolution) || layerState.sourceState != SourceState.READY) {
    //     continue;
    //   }
    //   if (layerRenderer.prepareFrame(frameState, layerState)) {
    //     layerRenderer.composeFrame(frameState, layerState, context);
    //   }
    // });
  }
}
