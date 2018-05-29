import R from 'ramda';

import logT from 'modules/utils/functions/logT';

const fn = _fn => (...args) => {
  const hrStart = process.hrtime();
  const elapsedTimes = [0];
  const result = _fn(...args);
  const isPromise = Promise.resolve(result) === result;
  if (!isPromise) {
    logT({ hrStart, elapsedTimes });
    return result;
  }
  return result.then(R.tap(() => logT({ hrStart, elapsedTimes })));
};

export default R.curry(fn);
