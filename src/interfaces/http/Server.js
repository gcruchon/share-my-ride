const express = require('express');

class Server {
  constructor({ config }) {
    this.config = config;
    this.express = express();
    this.express.disable('x-powered-by');
  }

  addDefaultHandler( handle ) {
    this.express.get('*', (req, res) => {
        return handle(req, res)
    })
  }

  async start() {
      const http = await this.express.listen(this.config.web.port);
      const { port } = http.address();
      console.log(`[p ${process.pid}] Listening at port ${port}`);
  }
}

module.exports = Server;