import R from 'ramda';

const fn = R.pipe(
  R.path(['data', 'user', 'edge_owner_to_timeline_media', 'edges']),
  R.map(
    R.pipe(
      R.path(['node']),
      R.pick(['id', 'display_url']),
    ),
  ),
);

export default R.curry(fn);
