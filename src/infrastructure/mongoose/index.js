const mongoose = require('mongoose');

module.exports = ({ logger }) => {
    let uri = process.env.DATABASE_URL;

    // set mongoose Promise to Bluebird
    mongoose.Promise = Promise;

    // Exit application on error
    mongoose.connection.on('error', (err) => {
        logger.error(`MongoDB connection error: ${err}`);
        process.exit(1);
    });

    // print mongoose logs in dev env
    mongoose.set('debug', true);

    mongoose.connect(uri, {
        keepAlive: 1,
        useNewUrlParser: true
    });

    return new Promise((resolve, reject) => {
        mongoose.connection.on('connected', () => {
            logger.info(`Mongoose default connection is open to ${uri}`);
            resolve(mongoose.connection)
        });
    });
};