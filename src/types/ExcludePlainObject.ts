export type ExcludePlainObject<T,> = Exclude<T, Record<string | number | symbol, unknown>>;
