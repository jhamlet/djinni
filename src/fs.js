import { Observable } from 'rxjs';
import { curryN, flatten, filter, is, pipe } from 'ramda';
import {
  readdir as fsReaddir,
  readFile as fsReadFile,
  writeFile as fsWriteFile,
  stat as fsStat
} from 'fs';
import path from './path';

const isString = is(String);
const { bindNodeCallback, empty, from, of } = Observable;

const prefix     = curryN(2, path.join);
const stringArgs = pipe(flatten, filter(isString));

import rimraf from 'rimraf';
export const rmrf = bindNodeCallback(rimraf);

const globby = bindNodeCallback(require('glob'));
export const glob =
  (pattern, opts = {}) => globby(pattern, opts).concatMap(from);

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

