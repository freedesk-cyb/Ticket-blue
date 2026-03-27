const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

let cachedServer;

module.exports = async (req, res) => {
  if (!cachedServer) {
    // Bootstrap NestJS using the compiled AppModule from the dist folder
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer(req, res);
};
