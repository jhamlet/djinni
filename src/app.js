import program from 'commander';
import pkg from '../package.json';
import debug from './debug';
import { resolve, watchFile } from './fs';
import { AsyncSubject, Observable } from 'rxjs';
import { prop } from 'ramda';

const { defer, of } = Observable;
const { assign, create } = Object;

program.
  name('djinni').
  version(pkg.version);

const rcFile     = defer(() => resolve('.djinnirc'));
const rcFilepath = rcFile.map(prop('filename'));

const config =
  rcFile.
  concatMap(prop('content')).
  map(json => JSON.parse(json)).
  publish().
  refCount();

rcFilepath.
  take(1).
  concatMap(filepath => watchFile(filepath)).
  subscribe(
    ({ type, original, filename }) =>
      debug.log(`file: ${original}, changed: ${type} => ${filename}`),
    error => debug.error(error)
  );

const app = assign(create(program), {
  get (path) {

  },

  set (path, value) {

  }
});

const appSubject = new AsyncSubject();
export default appSubject;

appSubject.next(app);
appSubject.complete();

program.parse(process.argv);

