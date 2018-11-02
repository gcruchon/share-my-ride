const next = require('next')


class Application {
    constructor({ server }) {
      this.server = server;
      this.dev = process.env.NODE_ENV !== 'production';
      this.app = next({ dev: this.dev });
    }
  
    async start() {
        await this.app.prepare();
        this.server.addDefaultHandler(this.app.getRequestHandler());
        await this.server.start();
    }
  }
  
  module.exports = Application;