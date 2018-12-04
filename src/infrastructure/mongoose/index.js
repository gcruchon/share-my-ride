const mongoose = require('mongoose');


module.exports = ({ logger, config }) => {
  // set mongoose Promise to Bluebird
  mongoose.Promise = Promise;

  // Exit application on error
  mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  });

  // print mongoose logs in dev env
  if (config.env === 'development') {
    mongoose.set('debug', true);
  }

  mongoose.connect(config.db, {
    keepAlive: 1,
    useNewUrlParser: true
  });

  return new Promise((resolve) => {
    mongoose.connection.on('connected', () => {
      logger.debug(`Mongoose default connection is open to ${config.db}`);
      resolve(mongoose.connection);
    });
  });
};