/* eslint-disable no-param-reassign */
import path from 'path';
import glob from 'glob';
import mkdirp from 'mkdirp';
import { Facenet } from 'facenet';
import R from 'ramda';

import createData from 'modules/core/functions/createData';
import waitAll from 'modules/utils/functions/waitAll';

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
      .then(R.tap(data => console.log(`${data.length} photos created.`))),
    Promise.resolve()
      .then(() => console.log('init facenet...'))
      .then(() => state.facenet.init())
      .then(() => console.log('facenet init done.')),
  ])
    .then(R.nth(0))
    .then(
      R.pipe(
        R.map(facePath =>
          state.facenet
            .align(facePath)
            .then(
              R.map(face =>
                face
                  .save(path.join(faceOutputDir, `${face.md5}.jpg`))
                  .then(() => face),
              ),
            )
            .then(waitAll),
        ),
        waitAll,
      ),
    )
    .then(
      R.pipe(
        R.map(
          R.pipe(
            R.map(face =>
              state.facenet.embedding(face).then(embedding => {
                face.embedding = embedding;
                return face;
              }),
            ),
            waitAll,
          ),
        ),
        waitAll,
      ),
    )
    .then(R.tap(console.log))
    .then(() => state.facenet.quit())
    .catch(console.log);
};

if (require.main === module) {
  fn();
}
