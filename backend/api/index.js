const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');

let cachedServer;

module.exports = async (req, res) => {
  console.log('Incoming request:', req.method, req.url);
  
  if (!cachedServer) {
    try {
      console.log('Starting NestJS bootstrap...');
      const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'debug'], // Detailed logs in Vercel
      });
      app.enableCors();
      console.log('Initializing app...');
      await app.init();
      console.log('NestJS initialized successfully.');
      cachedServer = app.getHttpAdapter().getInstance();
    } catch (err) {
      console.error('CRITICAL: NestJS Bootstrap Error:', err);
      return res.status(500).json({ 
        error: 'Bootstrap failed', 
        message: err.message,
        stack: err.stack 
      });
    }
  }
  
  try {
    return cachedServer(req, res);
  } catch (err) {
    console.error('CRITICAL: Handler Error:', err);
    return res.status(500).json({ error: 'Handler error', message: err.message });
  }
};
