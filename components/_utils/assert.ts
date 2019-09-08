import AssertionError from './AssertionError';
import AssertErrorCode from './AssertErrorCode';

/**
 * 断言，当且仅当 assection 为 fasle 时，生效
 * @param {any} assertion Assertion we expected to be truthy.
 * @param {assertErrorCode} errorCode Error code.
 */
export function assert(assertion: any, errorCode: AssertErrorCode) {
  if (!assertion) {
    throw new AssertionError(errorCode);
  }
}
