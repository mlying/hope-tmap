import BaseComponent from '../_utils/BaseObject';
import { Extent, createEmpty } from '../_utils/Extent';
import GeometryType from './GeometryType';

export interface IGeometryProps {
  id: string;
}

export default abstract class Geometry<T extends IGeometryProps> extends BaseComponent<T> {
  protected type: GeometryType;
  protected coordinates: number[] | number[][] | number[][][];
  private extent_: Extent;
  public constructor(props: T) {
    super(props);

    this.extent_ = createEmpty();
  }

  getType(): GeometryType {
    return this.type;
  }
}
