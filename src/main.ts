import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters';
import helmet from 'helmet';
import { PrismaService } from './prisma/prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(helmet());

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // to remove bigint serialization error
  (BigInt.prototype as any).toJSON = function () {
    return Number(this);
  };

  // initializing swagger
  const config = new DocumentBuilder()
    .setTitle('Posts Demo Project')
    .setDescription('Posts Demo Project with NestJS framework')
    .setVersion('1.0')
    .addTag('posts')
    .addBearerAuth({
      name: 'Authorization',
      bearerFormat: 'Bearer',
      in: 'Header',
      type: 'http',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(3000);
}
bootstrap();
