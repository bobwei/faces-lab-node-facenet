import R from 'ramda';

import logT from 'modules/utils/functions/logT';

const fn = _fn => {
  const elapsedTimes = [];
  return (...args) => {
    const hrStart = process.hrtime();
    const result = _fn(...args);
    const isPromise = Promise.resolve(result) === result;
    if (!isPromise) {
      logT({ hrStart, elapsedTimes });
      return result;
    }
    return result.then(R.tap(() => logT({ hrStart, elapsedTimes })));
  };
};

export default R.curry(fn);
