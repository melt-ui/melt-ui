
import { get, type Writable } from "svelte/store";

type WritableValue<T> = T extends Writable<infer V> ? V : never;

export type WithGet<T extends Writable<unknown>> = T & {
  get: () => WritableValue<T>;
}

export function withGet<T extends Writable<unknown>>(store: T): WithGet<T> {
  let value = get(store);

  const update: typeof store['update'] = (cb) => {
    store.update((v) => {
      const nv = cb(v);
      value = nv;
      return nv;
    })
  }

  const set: typeof store['set'] = (v) => {
    update(() => v);
  }

  return {
    ...store,
    get: () => value as WritableValue<T>,
    update,
    set,
  }
}

export function addGetToStores<T extends Record<string, Writable<unknown>>>(stores: T) {
  return Object.keys(stores).reduce((acc, key) => {
    return {
      ...acc,
      [key]: withGet(stores[key]),
    }
  }, {} as {
    [K in keyof T]: WithGet<T[K]>;
  })
}