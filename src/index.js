import path from 'path';
import glob from 'glob';
import mkdirp from 'mkdirp';
import { Facenet } from 'facenet';
import R from 'ramda';
import async from 'async';

import createData from 'modules/core/functions/createData';
import logExecTime from 'modules/core/functions/logExecTime';
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
    .then(facePaths => {
      console.log(`${facePaths.length} photos processing...`);
      return new Promise((resolve, reject) => {
        const results = [];
        const concurrency = 1;
        const queue = async.queue((facePath, callback) => {
          console.log('processing', facePath);
          return logExecTime(state.facenet.align.bind(state.facenet))(facePath)
            .then(
              R.map(face =>
                face
                  .save(path.join(faceOutputDir, `${face.md5}.jpg`))
                  .then(() => face),
              ),
            )
            .then(waitAll)
            .then(data => results.push(...data))
            .then(callback)
            .catch(callback);
        }, concurrency);
        queue.push(facePaths);
        queue.drain = error => (error ? reject(error) : resolve(results));
      });
    })
    .then(faces => {
      console.log(`${faces.length} faces processing...`);
      return new Promise((resolve, reject) => {
        const concurrency = 1;
        const queue = async.queue((face, callback) => {
          console.log('processing', face.md5);
          return logExecTime(state.facenet.embedding.bind(state.facenet))(face)
            .then(callback)
            .catch(callback);
        }, concurrency);
        queue.push(faces);
        queue.drain = error => (error ? reject(error) : resolve());
      });
    })
    .then(() => state.facenet.quit())
    .catch(console.log);
};

if (require.main === module) {
  fn();
}
