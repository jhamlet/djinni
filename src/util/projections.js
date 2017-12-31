import { always, empty, ifElse, identity, of, pipe } from 'ramda';
import { isArray, isNil } from 'util/predicates';
/**
 * A `projection` is a mapping function. Something that 'projects' one thing
 * into something else.
 */
export const emptyArray          = pipe(always([]), empty);
export const defaultToEmptyArray = ifElse(isNil, emptyArray, of);
export const defaultToArray      = ifElse(isArray, identity, defaultToEmptyArray);
