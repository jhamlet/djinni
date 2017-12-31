import { curryN } from 'ramda';

const { assign } = Object;

export const pump = curryN(3, (disposed, observer, error, value) => {
  const done = disposed();
  !done && error ? observer.error(error)
    : !done ? observer.next(value)
    : null;
});

export const disposer = () => {
  let disposed = false;
  return assign((...args) => {
    if (args.length) {
      disposed = true;
    }
    return disposed;
  });
};
