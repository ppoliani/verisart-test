const crypto = require('crypto');
const assert = require('assert');
const timestamp = require('../../timestamp.json');

const sha256 = payload => crypto.createHash('sha256')
  .update(payload)
  .digest('hex')

const getOperator = op => {
  switch(op) {
    case 'sha256':
      return sha256;
    default:
      throw new Error('Operator not supported!');
  }
}

const verifyHash = (operations, msg, merkleRoot) => {
  const reducer = (acc, [operator, prefix, postfix]) => {
    const op = getOperator(operator);

    return op(Buffer.concat([
      hexToBuffer(prefix),
      hexToBuffer(acc),
      hexToBuffer(postfix)
    ]))
  }

  const result = operations.reduce(reducer, msg);

  return convertToBigEndian(result) === merkleRoot;
}

const hexToBuffer = hexStr => new Buffer.from(hexStr, 'hex');
const convertToBigEndian = hexVal => hexToBuffer(hexVal).reverse().toString('hex');

const main = () => {
  const msg = 'b4759e820cb549c53c755e5905c744f73605f8f6437ae7884252a5f204c8c6e6';
  const merkleRoot = 'f832e7458a6140ef22c6bc1743f09610281f66a1b202e7b4d278b83de55ef58c';

  if(verifyHash(timestamp, msg, merkleRoot)) {
    console.log('CORRECT!')
  } 
  else {
    console.log('INCORRECT!')
  }
}

main();

module.exports = {verifyHash}
