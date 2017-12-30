import { Observable } from 'rxjs';
const { bindNodeCallback, empty, from, of } = Observable;

import { curry, curryN, flatten, filter, is, pipe } from 'ramda';

import { explode } from './path';
import { join } from 'path';

import {
  readdir as fsReaddir,
  readFile as fsReadFile,
  writeFile as fsWriteFile,
  stat as fsStat,
  watch as fsWatch
} from 'fs';

const { assign } = Object;
const isString   = is(String);
const isArray    = is(Array);
const prefix     = curryN(2, join);
const stringArgs = pipe(flatten, filter(isString));

const readdir   = bindNodeCallback(fsReaddir);
const readFile  = bindNodeCallback(fsReadFile);
const writeFile = bindNodeCallback(fsWriteFile);
const stat      = bindNodeCallback(fsStat);

export { readdir, readFile, writeFile, stat };
export { readFile as read, writeFile as write };

export const node = (...args) =>
  from(stringArgs(args)).
    concatMap(filename =>
      stat(filename).
      map(stats => ({
        stats,
        filename,
        content: stats.isDirectory() ?
          readdir(filename).
          concatMap(from).
          map(prefix(filename)).
          concatMap(node)
          : stats.isFile() ? readFile(filename) : empty()
      }))
    ).
    publishLast().
    refCount();

export const file = (...args) =>
  node(args).
  do(node => {
    if (!node.stats.isFile()) {
      throw new Error(`'${node.filename}' is not a file.`);
    }
  }).
  publishLast().
  refCount();

export const directory = (...args) =>
  node(args).
    do(node => {
      if (!node.stats.isDirectory()) {
        throw new Error(`'${node.filename}' is not a directory.`);
      }
    }).
    publishLast().
    refCount();

export const traverse = node =>
  (node.stats.isDirectory() ?
    node.content.concatMap(traverse) :
    of(node)).
    publishReplay().
    refCount();

import rimraf from 'rimraf';
export const rmrf = bindNodeCallback(rimraf);

const globby = bindNodeCallback(require('glob'));
export const glob =
  (pattern, opts = {}) =>
    globby(pattern, opts).
    concatMap(from).
    concatMap(node).
    publishReplay().
    refCount();

export const resolve = curry((patterns,  opts = {}) => {
  const { cwd = process.cwd() } = opts;
  patterns = isArray(patterns) ? patterns : [patterns];

  return from(explode(cwd)).
    concatMap(dir =>
      from(patterns).
      concatMap(pattern => glob(join(dir, pattern), opts))
    ).
    publishReplay().
    refCount();
});

const pump = curryN(3, (disposed, observer, error, value) => {
  const done = disposed();
  !done && error ? observer.error(error)
    : !done ? observer.next(value)
    : null;
});

const disposer = () => {
  let disposed = false;
  return assign((...args) => {
    if (args.length) {
      disposed = true;
    }
    return disposed;
  });
};

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

