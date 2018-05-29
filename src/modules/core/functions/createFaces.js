import path from 'path';
import R from 'ramda';
import async from 'async';

import logExecTime from 'modules/core/functions/logExecTime';
import waitAll from 'modules/utils/functions/waitAll';

const fn = ({ facenet, faceOutputDir }, facePaths) => {
  console.log(`${facePaths.length} photos processing...`);
  return new Promise((resolve, reject) => {
    const results = [];
    const concurrency = 1;
    const queue = async.queue((facePath, callback) => {
      console.log('processing', facePath);
      return logExecTime(facenet.align.bind(facenet))(facePath)
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
};

export default R.curry(fn);
