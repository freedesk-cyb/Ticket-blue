require('reflect-metadata');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { Client } = require('pg');

let cachedServer;

module.exports = async (req, res) => {
  console.log('Incoming request:', req.method, req.url);
  
  // Quick check for DB URL
  if (process.env.POSTGRES_URL) {
    console.log('POSTGRES_URL is present.');
  } else {
    console.warn('POSTGRES_URL IS MISSING!');
  }

  if (!cachedServer) {
    try {
      console.log('Starting NestJS bootstrap...');
      
      // OPTIONAL: Test DB connection before NestJS starts
      if (process.env.POSTGRES_URL) {
        console.log('Testing direct DB connection...');
        const client = new Client({
          connectionString: process.env.POSTGRES_URL,
          ssl: { rejectUnauthorized: false }
        });
        await client.connect();
        console.log('Direct DB connection success!');
        await client.end();
      }

      const app = await NestFactory.create(AppModule);
      app.enableCors();
      console.log('Initializing app...');
      await app.init();
      console.log('NestJS initialized successfully.');
      cachedServer = app.getHttpAdapter().getInstance();
    } catch (err) {
      console.error('CRITICAL: Error during bootstrap:', err);
      return res.status(500).json({ 
        error: 'Bootstrap failed', 
        message: err.message,
        details: err.toString()
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
