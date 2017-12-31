import { Observable } from 'rxjs';
const { from } = Observable;
import { curry } from 'ramda';
import glob from './glob';
import { explode } from '../path';
import { join } from 'path';
import { isArray } from '../util/predicates';

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
