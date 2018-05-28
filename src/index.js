import createData from 'modules/core/functions/createData';

const fn = () => {
  return Promise.all([createData()]);
};

if (require.main === module) {
  fn();
}
