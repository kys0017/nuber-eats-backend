import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://studio.apollographql.com',
      'https://nuber-eats-frontend-kys.netlify.app',
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: 'Content-Type, Accept, x-jwt',
    credentials: true,
  });
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
