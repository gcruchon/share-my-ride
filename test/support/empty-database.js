const container = require('src/container');
const logger = container.resolve('logger');
const database = container.resolve('database');
const DbUserModel = container.resolve('DbUserModel');

module.exports = async() => {
    logger.debug('Deleting users from test database...');
    await database;
    await DbUserModel.deleteMany({});
    logger.debug('All users have been removed!');
};