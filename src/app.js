import program from 'commander';
import pkg from '../package.json';
import debug from './debug';
import { resolve } from './fs';
import { AsyncSubject, Observable } from 'rxjs';
import { prop } from 'ramda';

const { defer } = Observable;
const { assign, create } = Object;

program.
  name('djinni').
  version(pkg.version);

const rcFile =
  defer(() => resolve('.djinnirc')).
  take(1).
  publishLast().
  refCount();

const rcFilepath =
  rcfile.
  map(prop('filename')).
  do(rcfilepath => debug.info(`rcfilepath: ${rcfilepath}`)).
  publishLast().
  refCount();

const config =
  rcfile.
  concatMap(prop('content')).
  map(json => JSON.parse(json)).
  publish().
  refCount();

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

