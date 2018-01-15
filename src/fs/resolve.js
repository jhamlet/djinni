import { Observable } from 'rxjs';
const { from } = Observable;
import { curry } from 'ramda';
import glob from './glob';
import { explode } from '../path';
import { join } from 'path';
import { defaultToArray } from '../util/projections';

export const resolve = curry((patterns,  opts = {}) => {
  const { cwd = process.cwd() } = opts;
  patterns = defaultToArray(patterns);

  return from(explode(cwd)).
    concatMap(dir =>
      from(patterns).
      concatMap(pattern => glob(join(dir, pattern), opts))
    ).
    publishReplay().
    refCount();
});
