const logT = ({ hrStart, elapsedTimes }) => {
  const [ts, tn] = process.hrtime(hrStart);
  const t = (ts * 1000 + tn / 1000000).toFixed(5);
  const deltaT = t - elapsedTimes.slice(-1)[0];
  console.log(`${deltaT}ms`);
};

export default logT;
