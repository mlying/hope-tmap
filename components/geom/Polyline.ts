import Geometry, { IGeometryProps } from './Geometry';
import GeometryType from './GeometryType';

export interface IPolylineProps extends IGeometryProps {}

export default class Polyline extends Geometry<IPolylineProps> {
  protected coordinates: number[][][];
  public constructor(props: IPolylineProps) {
    super(props);
  }

  getType() {
    return GeometryType.POLYLINE;
  }

  public toJson(): string {}
}
