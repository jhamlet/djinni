import { bindNodeCallback } from 'rxjs/observable/bindNodeCallback';
export const mkdirp = bindNodeCallback(require('mkdirp'));
export default mkdirp;
