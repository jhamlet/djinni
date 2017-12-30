import { dirname, sep } from 'path';

export const explode = (filepath, memo = []) => {
  const dir = dirname(filepath);
  memo.push(filepath);

  if (dir === sep) {
    memo.push(dir);
    return memo;
  }

  return explode(dir, memo);
};

