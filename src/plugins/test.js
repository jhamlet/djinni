import debug from '../debug';

export default {
  register (djinni) {
    debug.log('initializing test...');
    djinni.command('test', 'test executables');
  }
};
