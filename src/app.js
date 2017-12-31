import pkg from '../package.json';
import debug from './debug';
import { resolve, watchFile, write } from './fs';
import { Observable } from 'rxjs';
import {
  always, assocPath, compose, invoker, is, path as getPath, prop, unary
} from 'ramda';

const { defer, of } = Observable;
const { assign, create } = Object;

const callToString = invoker(0, 'toString');
const getContent   = prop('content');
const parseJson    = unary(JSON.parse);
const toJson       = value => JSON.stringify(value, null, 2);
const bufferToJs   = compose(parseJson, callToString);

const isArray = is(Array);
const rcFile  = defer(() => resolve('.djinnirc').take(1));

const rcContents =
  rcFile.
  concatMap(file =>
    of(file).
    concat(watchFile(file.filename).switchMap(always(rcFile)))
  ).
  concatMap(getContent).
  map(bufferToJs);

import program from 'commander';

program.
  name('djinni').
  version(pkg.version).
  description('Magick');

const app = assign(create(program), {
  configuration: rcContents.publish().refCount(),

  get (path) {
    return rcContents.map(getPath(isArray(path) ? path : [path]));
  },

  set (path, value) {
    return rcContents.
      take(1).
      map(assocPath(isArray(path) ? path : [path], value)).
      map(toJson).
      concatMap(data =>
        rcFile.
        concatMap(({ filename }) =>
          write(filename, data, 'utf8')
        )
      ).
      ignoreElements();
  },

  run (args) {
    program.parse(args);
    app.
      get(['config', 'foo']).
      distinctUntilChanged().
      subscribe(cfg => debug.log(cfg));

    app.set(['config', 'foo'], 'hogarth').subscribe();
  }
});

const mod = require('./plugins/test').default;
mod.register(app);

export default app;


