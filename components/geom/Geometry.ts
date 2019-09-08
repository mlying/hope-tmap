import BaseComponent from '../_utils/BaseObject';

export interface IGeometryProps {
  id: string;
}

export type GeometryType = 'extent' | 'polygon' | 'polyline' | 'arrow';

export default abstract class Geometry<T extends IGeometryProps> extends BaseComponent<T> {
  protected type: GeometryType;
  protected coordinates: number[] | number[][] | number[][][];
  public constructor(props: T) {
    super(props);
  }

  getType(): GeometryType {
    return this.type;
  }

  abstract toJson(): string;
}
