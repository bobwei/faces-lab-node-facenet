import R from 'ramda';

const fn = R.pipe(
  R.map(R.length),
  R.sum,
);

export default R.curry(fn);
