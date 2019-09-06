import AssertionError from './AssertionError.js';

/**
 * @param {boolean} assertion Assertion we expected to be truthy.
 * @param {errorCode} errorCode Error code.
 */
export function assert(assertion: boolean, errorCode: errorCode) {
  if (!assertion) {
    throw new AssertionError(errorCode);
  }
}
