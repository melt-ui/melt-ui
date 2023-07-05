import { o as onDestroy } from "./ssr.js";
import { d as derived } from "./index2.js";
import { a as isBrowser } from "./is.js";
import { n as noop } from "./callbacks.js";
function getElementByMeltId(id) {
  if (!isBrowser)
    return null;
  return document.querySelector(`[data-melt-id="${id}"]`);
}
function typedDerived(stores, fn) {
  return derived(stores, fn);
}
function derivedWithUnsubscribe(stores, fn) {
  let unsubscribers = [];
  const onUnsubscribe = (cb) => {
    unsubscribers.push(cb);
  };
  const unsubscribe = () => {
    unsubscribers.forEach((fn2) => fn2());
    unsubscribers = [];
  };
  const derivedStore = derived(stores, ($storeValues) => {
    unsubscribe();
    return fn($storeValues, onUnsubscribe);
  });
  onDestroy(unsubscribe);
  return derivedStore;
}
function effect(stores, fn) {
  const unsub = derivedWithUnsubscribe(stores, (stores2, onUnsubscribe) => {
    return {
      stores: stores2,
      onUnsubscribe
    };
  }).subscribe(({ stores: stores2, onUnsubscribe }) => {
    const returned = fn(stores2);
    if (returned) {
      onUnsubscribe(returned);
    }
  });
  onDestroy(unsub);
  return unsub;
}
const hiddenAction = (obj) => {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    },
    ownKeys(target) {
      return Reflect.ownKeys(target).filter((key) => key !== "action");
    }
  });
};
function lightable(value) {
  function subscribe(run) {
    run(value);
    return () => {
    };
  }
  return { subscribe };
}
const isFunctionWithParams = (fn) => {
  return typeof fn === "function";
};
function builder(name, args) {
  const { stores, action, returned } = args ?? {};
  const derivedStore = (() => {
    if (stores && returned) {
      return derived(stores, (values) => {
        const result = returned(values);
        if (isFunctionWithParams(result)) {
          const fn = (...args2) => {
            return {
              ...result(...args2),
              [`data-melt-${name}`]: ""
            };
          };
          fn.action = action ?? noop;
          return fn;
        }
        return hiddenAction({
          ...result,
          [`data-melt-${name}`]: "",
          action: action ?? noop
        });
      });
    } else {
      const returnedFn = returned;
      const result = returnedFn?.();
      if (isFunctionWithParams(result)) {
        const resultFn = (...args2) => {
          return {
            ...result(...args2),
            [`data-melt-${name}`]: ""
          };
        };
        resultFn.action = action ?? noop;
        return lightable(resultFn);
      }
      return lightable(
        hiddenAction({
          ...result,
          [`data-melt-${name}`]: "",
          action: action ?? noop
        })
      );
    }
  })();
  const actionFn = action ?? (() => {
  });
  actionFn.subscribe = derivedStore.subscribe;
  return actionFn;
}
function createElHelpers(prefix) {
  const name = (part) => part ? `${prefix}-${part}` : prefix;
  const selector = (part) => `[data-melt-${prefix}${part ? `-${part}` : ""}]`;
  const getEl = (part) => document.querySelector(selector(part));
  return {
    name,
    selector,
    getEl
  };
}
export {
  builder as b,
  createElHelpers as c,
  derivedWithUnsubscribe as d,
  effect as e,
  getElementByMeltId as g,
  hiddenAction as h,
  typedDerived as t
};
