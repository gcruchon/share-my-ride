const fs = require('fs');
const path = require('path');

const ENV = process.env.NODE_ENV || 'development';

const envConfig = require(path.join(__dirname, 'environments', ENV));
const dbConfig = loadDbConfig();

const config = Object.assign({
  [ENV]: true,
  env: ENV,
  db: dbConfig
}, envConfig);

module.exports = config;

function loadDbConfig() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  if (fs.existsSync(path.join(__dirname, './database.js'))) {
    const { username, password, database, host, port, dialect } = require('./database')[ENV];
    if (username && password) {
      return `${dialect}://${username}:${password}@${host}:${port}/${database}`;
    } else {
      return `${dialect}://${host}:${port}/${database}`;
    }
  }
}