import { isPlainObject } from "is-plain-object";
// Recursively removes any object keys with a value of undefined
export default function removeUndefineds(obj) {
  if (!isPlainObject(obj)) return obj;

  const target = {};

  for (const key in obj) {
    const val = obj[key];
    if (typeof val !== "undefined") {
      target[key] = removeUndefineds(val);
    }
  }

  return target;
}
