export type TRecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: TObj[TKey] extends unknown[]
    ? `${TKey}`
    : TObj[TKey] extends object
      ? `${TKey}` | `${TKey}.${TRecursiveKeyOf<TObj[TKey]>}`
      : `${TKey}`;
}[keyof TObj & (string | number)];
