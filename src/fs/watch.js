import { Observable } from 'rxjs';
const { of } = Observable;

import { watch as fsWatch } from 'fs';
import { pump, disposer } from '../util/observable';

export const watch = (filepath, opts) =>
  Observable.create(observer => {
    const watcher = fsWatch(filepath, opts);
    const disposed = disposer();

    const listener = pump(disposed, observer);
    const change = (type, filename) => listener(null, {
      type, filename, original: filepath
    });

    watcher.on('error', listener);
    watcher.on('change', change);

    return () => {
      disposed(true);
      watcher.close();
    };
  });

export const watchFile = (filepath, opts) =>
  watch(filepath, opts).
    take(1).
    concatMap(event =>
      of(event).
      // give tick to allow for file system to update
      // should probably check stats...
      delay(0).
      concat(watchFile(filepath, opts))
    );

export default watch;
