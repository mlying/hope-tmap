import { VERSION } from './util';
import AssertErrorCode from './AssertErrorCode';

class AssertionError extends Error {
  /**
   * Error code.
   */
  code: AssertErrorCode;
  /**
   * @param {errorCode} code Error code.
   */
  constructor(code: AssertErrorCode) {
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
