const container = require('./src/container');

const app = container.resolve('app');
app.start()
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });