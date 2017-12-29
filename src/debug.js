import createDebug from 'debug';

export default Object.assign(createDebug('djinni:debug'), {
  log: createDebug('djinni:debug'),
  info: createDebug('djinni:info'),
  warn: createDebug('djinni:warn'),
  error: createDebug('djinni:error'),
});
