const { createContainer, asClass } = require('awilix');

const Application = require('./app/Application');
const Server = require('./interfaces/http/Server');

const container = createContainer();

container
    .register({
        app: asClass(Application).singleton(),
        server: asClass(Server).singleton()
    });

module.exports = container;