export const isBrowser = typeof window !== 'undefined';
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (v: unknown): v is Function => typeof v === 'function';
