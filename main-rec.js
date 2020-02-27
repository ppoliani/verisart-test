const crypto = require('crypto');
const assert = require('assert');
const timestamp = require('./timestamp.json');

const sha256 = payload => crypto.createHash('sha256')
  .update(payload)
  .digest('hex')

const getOperator = op => {
  switch(op) {
    case 'sha256':
      return sha256;
    default:
      throw new Error('Operation unavailable');
  }
}

const verifyHash = (operations, msg, merkleRoot) => {
  const rec = (operation, root) => {
    if(operation === undefined) {
      return convertToBigEndian(root) === merkleRoot;
    }

    const [operator, prefix, postfix] = operation;
    const op = getOperator(operator);
    const nextMsg = op(Buffer.concat([
      hexToBuffer(prefix),
      hexToBuffer(root),
      hexToBuffer(postfix)
    ]));

    return rec(operations.shift(), nextMsg);
  }

  return rec(operations.shift(), msg);
}

const hexToBuffer = hexStr => new Buffer.from(hexStr, 'hex');
const convertToBigEndian = hexVal => hexToBuffer(hexVal).reverse().toString('hex');

const main = () => {
  const msg = 'b4759e820cb549c53c755e5905c744f73605f8f6437ae7884252a5f204c8c6e6';
  const merkleRoot = 'f832e7458a6140ef22c6bc1743f09610281f66a1b202e7b4d278b83de55ef58c';

  assert.ok(verifyHash(timestamp, msg, merkleRoot), 'Message cannot be verified by the path');

  console.log('Path is verified!')
}

main();
