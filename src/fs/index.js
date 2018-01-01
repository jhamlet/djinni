import { Observable } from 'rxjs';
const { bindNodeCallback, empty, from } = Observable;
import { curryN, flatten, filter, pipe } from 'ramda';
import { isString } from '../util/predicates';
import { join } from 'path';

import fs, {
  readdir as fsReaddir,
  readFile as fsReadFile,
  writeFile as fsWriteFile,
  stat as fsStat,
} from 'fs';

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

import glob from './glob';
import mkdirp from './mkdirp';
import resolve from './resolve';
import rmrf from './rmrf';
import traverse from './traverse';
import { watch, watchFile } from './watch';

export { glob, mkdirp, resolve, rmrf, traverse, watch, watchFile };

export default {
  ...fs,
  read: readFile, write: writeFile,
  readdir, readFile, writeFile, stat, node, file, directory,
  glob, mkdirp, resolve, rmrf, traverse, watch, watchFile
};
