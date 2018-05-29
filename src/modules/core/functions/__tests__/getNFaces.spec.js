import getNFaces from '../getNFaces';

test('logNFaces', () => {
  const result = getNFaces([[1, 2], [3, 4, 5]]);
  expect(result).toEqual(5);
});
