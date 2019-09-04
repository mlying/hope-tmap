import Geometry, { IGeometryProps } from './Geometry';

export interface IPolylineProps extends IGeometryProps {}

export default class Polyline extends Geometry<IPolylineProps> {
  protected type: 'polyline';
  protected coordinates: number[][][];
  public constructor(props: IPolylineProps) {
    super(props);
  }

  public toJson(): string {}
}
