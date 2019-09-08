export const VERSION: string = 'latest';

/**
 * Counter for getUid.
 */
let uidCounter: number = 0;

export function getUid(obj: any): string {
  return obj.htmap_uid || (obj.htmap_uid = String(++uidCounter));
}
