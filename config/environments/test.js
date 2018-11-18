module.exports = {
    web: {
        port: 3001
    },
    logging: {
        appenders: {
            out: { type: 'console', layout: { type: 'coloured' } }
        },
        categories: {
            default: { appenders: ['out'], level: 'info' }
        }
    }
};