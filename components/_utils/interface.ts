export interface Dictionary<T> {
  [index: string]: T;
}

export interface NumericDictionary<T> {
  [index: number]: T;
}

export interface ITDECtrl extends HTMLObjectElement {
  /**
   *
   * @param clsName - c++ 操作类
   * @param funcName - c++ 操作类下的方法名
   * @param opt - 参数
   */
  InvokeCmd<T>(clsName: string, funcName: string, opt: any): T;
}

export interface IContext {
  ctrl: ITDECtrl;
}
