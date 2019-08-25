import Geometry, { IGeometryProps } from './Geometry';

export interface IPolygonProps extends IGeometryProps {}

export default class Polygon extends Geometry<IPolygonProps> {
  protected type: 'polygon';
  protected coordinates: number[][][];
  public constructor(props: IPolygonProps) {
    super(props);
  }

  public toJson(): string {}
}
