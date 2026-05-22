import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { loadEnv } from './env';

async function bootstrap() {
  loadEnv();

  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL não encontrada. Crie apps/api/.env a partir de apps/api/.env.example e preencha a conexão do Postgres.',
    );
  }

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001);
}

void bootstrap();