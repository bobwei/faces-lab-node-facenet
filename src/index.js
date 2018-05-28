import path from 'path';
import glob from 'glob';
import { Facenet } from 'facenet';
import R from 'ramda';

import createData from 'modules/core/functions/createData';
import waitAll from 'modules/utils/functions/waitAll';

const fn = ({
  outputDir = path.resolve('tmp'),
  photoOutputDir = path.join(outputDir, 'photos'),
} = {}) => {
  const facenet = new Facenet();
  return Promise.all([
    createData({ photoOutputDir })
      .then(() => console.log('data created.'))
      .then(() => glob.sync(`${photoOutputDir}/*.jpg`)),
    Promise.resolve()
      .then(() => console.log('init facenet...'))
      .then(() => facenet.init())
      .then(() => console.log('facenet init done.')),
  ])
    .then(R.nth(0))
    .then(
      R.pipe(
        R.map(face => facenet.align(face)),
        waitAll,
      ),
    )
    .then(R.tap(console.log))
    .then(() => facenet.quit())
    .catch(console.log);
};

if (require.main === module) {
  fn();
}
