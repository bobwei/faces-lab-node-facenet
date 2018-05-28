/* eslint-disable camelcase */
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import async from 'async';
import axios from 'axios';
import R from 'ramda';

import getPhotos from 'modules/core/functions/getPhotos';

const fn = ({
  outputDir = path.resolve('tmp'),
  photoOutputDir = path.join(outputDir, 'photos'),
} = {}) => {
  return Promise.resolve(require('modules/fixtures/data/timeline_media.json'))
    .then(getPhotos)
    .then(photos => {
      console.log(`${photos.length} photos downloading...`);
      return new Promise((resolve, reject) => {
        const concurrency = 2;
        const queue = async.queue(({ id, display_url }, callback) => {
          return axios
            .get(display_url, { responseType: 'stream' })
            .then(R.path(['data']))
            .then(stream => {
              mkdirp.sync(photoOutputDir);
              stream.pipe(
                fs.createWriteStream(path.join(photoOutputDir, `${id}.jpg`)),
              );
              stream.on('end', callback);
              stream.on('error', callback);
            });
        }, concurrency);
        queue.push(photos);
        queue.drain = error => (error ? reject(error) : resolve());
      });
    })
    .catch(console.log);
};

if (require.main === module) {
  fn();
}
