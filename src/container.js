const { createContainer, asClass, asValue } = require('awilix');

const config = require('../config');
const Application = require('./app/Application');
const Server = require('./interfaces/http/Server');

const container = createContainer();

container
    .register({
        app: asClass(Application).singleton(),
        server: asClass(Server).singleton()
    })
    .register({
        config: asValue(config)
    });
module.exports = container;