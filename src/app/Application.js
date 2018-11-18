class Application {
    constructor({ server, database }) {
        this.server = server;
        this.database = database;
    }

    async start() {
        if (this.database) {
            await this.database;
        }
        await this.server.start();
    }
}

module.exports = Application;