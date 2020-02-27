const test = require('ava');
const timestamp = require('./timestamp.json');

test('should return true if the path is correct',  t => {
  const msg = 'b4759e820cb549c53c755e5905c744f73605f8f6437ae7884252a5f204c8c6e6';
  const merkleRoot = 'f832e7458a6140ef22c6bc1743f09610281f66a1b202e7b4d278b83de55ef58c';

  t.true(verifyHash(timestamp, msg, merkleRoot), 'Message cannot be verified by the path');
})
