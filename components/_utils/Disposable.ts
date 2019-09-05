/**
 * @classdesc
 * Objects that need to clean up after themselves.
 */
class Disposable {
  private disposed_: boolean;
  constructor() {
    /**
     * The object has already been disposed.
     */
    this.disposed_ = false;
  }

  /**
   * Clean up.
   */
  dispose() {
    if (!this.disposed_) {
      this.disposed_ = true;
      this.disposeInternal();
    }
  }

  /**
   * Extension point for disposable objects.
   * @protected
   */
  disposeInternal() {}
}

export default Disposable;
