import { mkdir, mkdtemp } from 'fs';
import { bindNodeCallback } from 'rxjs/observable/bindNodeCallback';
export const mkdirp = bindNodeCallback(require('mkdirp'));
export default mkdirp;


