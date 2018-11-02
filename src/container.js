const { createContainer, asClass, asFunction, asValue } = require('awilix');

const config = require('../config');
const Application = require('./app/Application');
const Server = require('./interfaces/http/Server');

const logger = require('./infrastructure/logging/logger');

const container = createContainer();

// System
container
    .register({
        app: asClass(Application).singleton(),
        server: asClass(Server).singleton()
    })
    .register({
        logger: asFunction(logger).singleton()
    })
    .register({
        config: asValue(config)
    });

module.exports = container;