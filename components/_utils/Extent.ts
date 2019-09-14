export type Extent = number[];

/**
 * Create an empty extent.
 * @return {Extent} Empty extent.
 * @api
 */
export function createEmpty(): Extent {
  return [Infinity, Infinity, -Infinity, -Infinity];
}
