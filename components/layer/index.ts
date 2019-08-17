import BaseComponent from '../_utils/Base';

export interface ILayer {}

export default abstract class Layer<P extends ILayer> extends BaseComponent<P> {
  abstract add(): void;
  abstract remove(): void;
}
