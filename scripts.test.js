const { searchSong } = require('./scripts');

describe('print response of api', () => {
  test('Get response', () => {
    searchSong('yes').then(data =>{
    expect(data.data).toContain('yes');
  });
});
});