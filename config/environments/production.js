module.exports = {
    web: {
        port: process.env.PORT
    },
    logging: {
        appenders: { out: { type: 'console', layout: { type: 'basic' } } },
        categories: { default: { appenders: ['out'], level: 'info' } }
    }
};