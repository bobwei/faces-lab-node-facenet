import { stdout as log } from 'single-line-log';
import R from 'ramda';

const fn = ({ hrStart, elapsedTimes }) => {
  const [ts, tn] = process.hrtime(hrStart);
  const deltaT = (ts * 1000 + tn / 1000000).toFixed(5);
  elapsedTimes.push(deltaT);
  const avgT = R.converge(R.divide, [R.sum, R.length])(elapsedTimes);
  log(`avg. time: ${avgT}`);
};

export default fn;
