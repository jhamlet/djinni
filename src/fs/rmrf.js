import { Observable } from 'rxjs';
const { bindNodeCallback } = Observable;

import rimraf from 'rimraf';

export const rmrf = bindNodeCallback(rimraf);

export default rmrf;
