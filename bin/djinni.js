#!/usr/bin/env node -r babel-register

import { Observable } from 'rxjs';
const { from } = Observable;

import { prop } from 'ramda';

import path from '../src/path';
import { glob, node } from '../src/fs';
import debug from '../src/debug';
import djinni from '../src/index';

const patterns =
  path.
  explode(process.cwd()).
  map(base => path.join(base, '{djinni,djinni.js,.djinni,.djinni.js}'));

from(patterns).
  map(pattern => glob(pattern)).
  concatAll().
  concatMap(node).
  filter(n => n.stats.isFile()).
  map(prop('filename')).
  subscribe(filename => {
    debug.info(filename);
    require(filename);
    debug.info(djinni.properties);
  });
