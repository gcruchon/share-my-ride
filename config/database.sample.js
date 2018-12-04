module.exports = {
  development: {
    database: 'share-my-ride-dev',
    host: '127.0.0.1',
    port: '27017',
    dialect: 'mongodb'
  },
  test: {
    database: 'share-my-ride-test',
    host: '127.0.0.1',
    port: '27017',
    dialect: 'mongodb'
  },
  production: process.env.APPSETTING_DATABASE_URL
};