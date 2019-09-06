export const VERSION: string = 'latest';

/**
 * Counter for getUid.
 */
let uidCounter: number = 0;

export function getUid(obj: any) {
  return obj.ol_uid || (obj.ol_uid = String(++uidCounter));
}
