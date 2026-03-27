import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';

let cachedServer: any;

export default async function (req: any, res: any) {
  if (!cachedServer) {
    // We create the Nest instance only once per warm start
    const app = await NestFactory.create(AppModule);
    app.enableCors(); // Allow all origins by default or configure as needed
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer(req, res);
}
