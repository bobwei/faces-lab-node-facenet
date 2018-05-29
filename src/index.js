import path from 'path';
import glob from 'glob';
import mkdirp from 'mkdirp';
import { Facenet } from 'facenet';
import R from 'ramda';

import createData from 'modules/core/functions/createData';
import createFaces from 'modules/core/functions/createFaces';
import createEmbeddings from 'modules/core/functions/createEmbeddings';

const fn = ({
  outputDir = path.resolve('tmp'),
  photoOutputDir = path.join(outputDir, 'photos'),
  faceOutputDir = path.join(outputDir, 'faces'),
} = {}) => {
  mkdirp.sync(photoOutputDir);
  mkdirp.sync(faceOutputDir);
  const state = {
    facenet: new Facenet(),
  };
  return Promise.all([
    createData({ photoOutputDir })
      .then(() => glob.sync(`${photoOutputDir}/*.jpg`))
      .then(R.tap(data => console.log(`${data.length} photos downloaded.`))),
    Promise.resolve()
      .then(() => console.log('init facenet...'))
      .then(() => state.facenet.init())
      .then(() => console.log('facenet init done.')),
  ])
    .then(R.nth(0))
    .then(createFaces({ ...state, faceOutputDir }))
    .then(R.tap(() => console.log()))
    .then(createEmbeddings({ ...state }))
    .then(R.tap(() => console.log()))
    .then(() => state.facenet.quit())
    .catch(console.log);
};

if (require.main === module) {
  fn();
}
