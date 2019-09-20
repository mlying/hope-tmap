import Geometry, { IGeometryProps } from './Geometry';
import GeometryType from './GeometryType';

export interface IPoint extends IGeometryProps {
  x: number;
  y: number;
  z: number;
}

enum PointProperty {
  X = 'x',
  Y = 'y',
  Z = 'z',
}

export default class Point extends Geometry<IPoint> {
  protected type = GeometryType.POINT;
  constructor(props: IPoint) {
    super(props);

    this.set(PointProperty.X, props.x);
    this.set(PointProperty.Y, props.y);
    this.set(PointProperty.Z, props.z);
  }
}
