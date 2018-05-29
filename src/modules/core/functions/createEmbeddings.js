import R from 'ramda';
import async from 'async';

import logExecTime from 'modules/core/functions/logExecTime';

const fn = ({ facenet }, faces) => {
  console.log(`${faces.length} faces processing...`);
  return new Promise((resolve, reject) => {
    const concurrency = 1;
    const queue = async.queue((face, callback) => {
      return logExecTime(facenet.embedding.bind(facenet))(face)
        .then(callback)
        .catch(callback);
    }, concurrency);
    queue.push(faces);
    queue.drain = error => (error ? reject(error) : resolve());
  });
};

export default R.curry(fn);
