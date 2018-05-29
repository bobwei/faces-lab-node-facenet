import logExecTime from '../logExecTime';

test('logExecTime', () => {
  const fn = () => {
    return 1 + 1;
  };
  logExecTime(fn)();
});

test('logExecTime with obj fn', () => {
  const obj = {
    x: 1,
    run() {
      return this.x + 1;
    },
  };
  logExecTime(obj.run.bind(obj))();
});
