import { Dictionary } from './interface';

export function clear(object: Dictionary<any>) {
  for (const property in object) {
    delete object[property];
  }
}
