const fs = require('fs');
const path = require('path');

module.exports = {
  log: 'debug',
  port: '3000',
  host: 'localhost',
  key: fs
    .readFileSync(path.resolve(__dirname, '../ssl/key.pem'))
    .toString('utf8'),
  cert: fs
    .readFileSync(path.resolve(__dirname, '../ssl/cert.pem'))
    .toString('utf8'),
};
