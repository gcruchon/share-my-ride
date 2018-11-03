const express = require('express');
const next = require('next')

class Server {
  constructor({ config, router, logger }) {
    this.config = config;
    this.router = router;
    this.logger = logger;
    this.dev = process.env.NODE_ENV !== 'production';
    this.next = next({ dev: this.dev });
  }

  async start() {
    await this.next.prepare();
    this.express = express();
    this.express.disable('x-powered-by');
    this.express.use(this.router);

    const handle = this.next.getRequestHandler();
    this.express.get('*', (req, res) => { return handle(req, res) });

    const http = await this.express.listen(this.config.web.port);
    const { port } = http.address();
    this.logger.info(`[p ${process.pid}] Listening at port ${port}`);
  }
}

module.exports = Server;