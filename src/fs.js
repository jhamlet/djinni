import { Observable } from 'rxjs';
import path, { parse } from 'util/path';
import fs, {
  readdir as fsReaddir,
  readFile as fsReadFile,
  stat as fsStat
} from 'fs';

const { bindNodeCallback, empty, from } = Observable;

const readdir  = bindNodeCallback(fsReaddir);
const readFile = bindNodeCallback(fsReadFile);
const stat     = bindNodeCallback(fsStat);

export { readdir, readFile, stat };

export const node = filepath =>
  stat(filepath).
    map(stats => ({
      stats,
      filepath,
      ...(parse(filepath)),
      content: stats.isDirectory() ?
        readdir(filepath).
        concatMap(from).
        map(name => path.join(filepath, name)).
        concatMap(node)
        :
        stats.isFile() ? readFile(filepath) : empty()
    })).
    publishLast().
    refCount();

export const file = filepath =>
  node(filepath).
  do(node => {
    if (!node.stats.isFile()) {
      throw new Error(`'${filepath}' is not a file.`);
    }
  }).
  publishLast().
  refCount();

export const directory = filepath =>
  node(filepath).
  do(node => {
    if (!node.stats.isDirectory()) {
      throw new Error(`'${filepath}' is not a directory.`);
    }
  }).
  publishLast().
  refCount();

export default fs;
