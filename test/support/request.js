const request = require('supertest');
const container = require('src/container');
const app = container.resolve('app');

module.exports = () => request(app.server.express);
