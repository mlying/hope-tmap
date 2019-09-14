import Geometry, { IGeometryProps } from './Geometry';
import GeometryType from './GeometryType';

export interface IArrowProps extends IGeometryProps {}

export default class Arrow extends Geometry<IArrowProps> {
  protected coordinates: number[][][];
  public constructor(props: IArrowProps) {
    super(props);
  }

  getType() {
    return GeometryType.ARROW;
  }

  public toJson(): string {}
}
