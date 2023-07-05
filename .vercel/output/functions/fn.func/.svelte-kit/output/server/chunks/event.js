function addEventListener(target, event, handler, options) {
  const events = Array.isArray(event) ? [...event] : [event];
  events.forEach((_event) => target.addEventListener(_event, handler, options));
  return () => {
    events.forEach((_event) => target.removeEventListener(_event, handler, options));
  };
}
export {
  addEventListener as a
};
