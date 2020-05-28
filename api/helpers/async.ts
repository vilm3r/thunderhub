import { getErrorMsg } from './helpers';
import { logger } from './logger';

export const to = promise => {
  return promise
    .then(data => data)
    .catch(err => {
      logger.error('%o', err);
      throw new Error(getErrorMsg(err));
    });
};

export const toBase = promise => {
  return promise
    .then(data => data)
    .catch(err => {
      const message = `${err}`.split(': ')[1];
      logger.error('%o', message);
      throw new Error(message);
    });
};

export const toWithError = promise => {
  return promise.then(data => [data, undefined]).catch(err => [undefined, err]);
};
