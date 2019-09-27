import Geometry, {IGeometryProps} from "./Geometry";

export interface ILableGeomProps extends IGeometryProps {
  id: string;
}

export default class LableGeometry<T extends ILableGeomProps> extends Geometry<T> {
  protected offsetX: number;
  protected offsetY: number;
  protected offsetZ: number;
  constructor(option: T) {
    super(option);
  }

  
}