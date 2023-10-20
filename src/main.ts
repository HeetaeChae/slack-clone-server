import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exeption.filter';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import { UndefinedToNullInterceptor } from './common/interceptors/undefinedToNull.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new SuccessInterceptor());
  app.useGlobalInterceptors(new UndefinedToNullInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('slack-clone-server')
    .setDescription('slack 서버 클론 api 문서')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(8000);
}
bootstrap();
