import { VERSION } from './util';

class AssertionError extends Error {
  /**
   * Error code.
   */
  code: errorCode;
  /**
   * @param {errorCode} code Error code.
   */
  constructor(code: errorCode) {
    // const path = VERSION === 'latest' ? VERSION : 'v' + VERSION.split('-')[0];
    const message = `Assertion failed. Error Code is ${code}. Current release is ${VERSION}`;

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
