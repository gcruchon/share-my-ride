const express = require('express');

class Server {
  constructor() {
    this.port = process.env.PORT || 3000;
    this.express = express();
    this.express.disable('x-powered-by');
  }

  addDefaultHandler( handle ) {
    this.express.get('*', (req, res) => {
        return handle(req, res)
    })
  }

  async start() {
      await this.express.listen(this.port);
      console.log('> Ready on http://localhost:' + this.port);
  }
}

module.exports = Server;