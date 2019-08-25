import Geometry, { IGeometryProps } from './Geometry';

export interface IArrowProps extends IGeometryProps {}

export default class Arrow extends Geometry<IArrowProps> {
  protected type: 'arrow';
  protected coordinates: number[][][];
  public constructor(props: IArrowProps) {
    super(props);
  }

  public toJson(): string {}
}
