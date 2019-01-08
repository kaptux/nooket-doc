export function arrayOfObjectsToHashmap<T>(
  objectKey: string,
  array: T[]
): { [id: string]: T } {
  let res = {};
  array.forEach(element => {
    res = (Object as any).assign(res, { [element[objectKey]]: element });
  });
  return res;
}
