import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const fs = require('fs');

const PORT = 3001;

async function bootstrap() {
  const keyFile = fs.readFileSync(__dirname + '/server.key');
  const certFile = fs.readFileSync(__dirname + '/server.crt');
  const app = await NestFactory.create(AppModule, {
    // httpsOptions: {
    //   key: keyFile,
    //   cert: certFile,
    // },
  });
  await app.enableCors();
  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
  return;
}

bootstrap();
