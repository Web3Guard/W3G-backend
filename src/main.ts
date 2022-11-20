import { NestFactory } from '@nestjs/core';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

import { AppModule } from './app.module';
import { SupabaseGuard } from './supabase/supabase.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.enableCors({
    origin: true,
    methods: '*',
    allowedHeaders: '*',
    credentials: true,
  });
  app.useLogger(app.get(Logger));
  app.useGlobalGuards(new SupabaseGuard());
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  await app.listen(3001);
}
bootstrap();
