/**
 * Error object thrown when an assertion failed. This is an ECMA-262 Error,
 * extended with a `code` property.
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error.
 */
class AssertionError extends Error {
  /**
   * Error code.
   */
  code: number;
  /**
   * @param {number} code Error code.
   */
  constructor(code: number) {
    const message = 'Assertion failed. ';

    super(message);

    this.code = code;

    /**
     * @type {string}
     */
    this.name = 'AssertionError';

    // Re-assign message, see https://github.com/Rich-Harris/buble/issues/40
    this.message = message;
  }
}

export default AssertionError;
