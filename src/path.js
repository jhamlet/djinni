import { fromPairs, map, pipe, toPairs } from 'ramda';
import path from 'path';

const defaultSelector = ([ base, value ]) => {
  let name = base;

  switch (name) {
    case 'root':
    case 'dir':
      name = name + 'path';
      break;
    case 'name':
      name = 'file' + name;
      break;
    default:
      name = name + 'name';
  }

  return [name, value];
};

const pathParse = f => path.$$parse(f);

export const parse = (selector = defaultSelector, ...rest) => {
  const fn = pipe(pathParse, toPairs, map(selector, fromPairs));
  return rest.length ? fn(rest[0]) : fn;
};

path.$$parse = path.parse;
path.parse = parse;

export default path;
