type UnionToSetHelper<
  T extends keyof any,
  U extends T = T,
  R extends T[] = [],
> = {
  [S in U]: Exclude<U, S> extends never
    ? [...R, S]
    : UnionToSetHelper<T, Exclude<U, S>, [...R, S]>;
}[U]

export type UnionToSet<T extends keyof any> = UnionToSetHelper<T>
