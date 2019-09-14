import Geometry, { IGeometryProps } from './Geometry';
import GeometryType from './GeometryType';

export interface IPolygonProps extends IGeometryProps {}

export default class Polygon extends Geometry<IPolygonProps> {
  protected coordinates: number[][][];
  public constructor(props: IPolygonProps) {
    super(props);
  }

  getType() {
    return GeometryType.POLYGON;
  }

  public toJson(): string {}
}
