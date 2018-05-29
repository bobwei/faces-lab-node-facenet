import R from 'ramda';
import async from 'async';

import logExecTime from 'modules/core/functions/logExecTime';

const fn = ({ facenet }, faces) => {
  console.log(`${faces.length} faces creating embeddings...`);
  const embedding = logExecTime(facenet.embedding.bind(facenet));
  return new Promise((resolve, reject) => {
    const results = [];
    const concurrency = 1;
    const queue = async.queue((face, callback) => {
      return embedding(face)
        .then(data => results.push(data))
        .then(callback)
        .catch(callback);
    }, concurrency);
    queue.push(faces);
    queue.drain = error => (error ? reject(error) : resolve(results));
  });
};

export default R.curry(fn);
