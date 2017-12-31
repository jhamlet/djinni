import { Observable } from 'rxjs';
const { bindNodeCallback, from } = Observable;

import node from './';

const globby = bindNodeCallback(require('glob'));

export const glob =
  (pattern, opts = {}) =>
    globby(pattern, opts).
    concatMap(from).
    concatMap(node).
    publishReplay().
    refCount();

export default glob;
