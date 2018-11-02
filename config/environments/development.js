const path = require('path');

module.exports = {
    web: {
        port: 3000
    },
    logging: {
        appenders: {
            out: { type: 'console', layout: { type: 'coloured' } },
            app: {
                type: 'dateFile',
                filename: path.join(__dirname, '../../logs/development'),
                pattern: '-yyyy-MM-dd.log',
                alwaysIncludePattern: true
            }
        },
        categories: {
            default: { appenders: ['out', 'app'], level: 'debug' }
        }
    }
};