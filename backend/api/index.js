require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

let cachedServer;

module.exports = async (req, res) => {
  if (!cachedServer) {
    try {
      const app = await NestFactory.create(AppModule);
      app.enableCors();
      await app.init();
      cachedServer = app.getHttpAdapter().getInstance();
    } catch (err) {
      console.error('NestJS Bootstrap Error:', err);
      return res.status(500).json({ error: 'Bootstrap failed', message: err.message });
    }
  }
  return cachedServer(req, res);
};
