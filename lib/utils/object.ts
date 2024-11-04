export const mapValues = (mapper: any, obj: any) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, mapper(value, key, obj)])
  );

export const mirror = (obj: any) =>
  Object.fromEntries(Object.entries(obj).map(([key, value]) => [value, key]));
