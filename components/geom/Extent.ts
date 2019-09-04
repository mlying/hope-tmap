import Geometry, { IGeometryProps } from './Geometry';

export interface IExtentProps extends IGeometryProps {}

export default class Extent extends Geometry<IExtentProps> {
  protected type: 'extent';
  protected coordinates: number[][][];
  public constructor(props: IExtentProps) {
    super(props);
  }

  public toJson(): string {}
}
