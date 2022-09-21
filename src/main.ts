import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters';
import helmet from 'helmet';
import { PrismaService } from './prisma/prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfiguration, appConfiguration } from '@app/util-config';

function configureSwagger(
  appConfig: AppConfiguration,
  app: INestApplication,
  globalPrefix: string,
) {
  const swaggerDocOptions = new DocumentBuilder()
    .setTitle('Posts Demo Project')
    .setDescription('Posts Demo Project with NestJS framework')
    .setVersion('1.0.0')
    .addTag('posts')
    .addServer(appConfig.domain, 'development')
    .addBearerAuth({
      name: 'Authorization',
      bearerFormat: 'Bearer',
      in: 'Header',
      type: 'http',
    })
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerDocOptions);

  const swaggerUiPath = `/${globalPrefix}/docs`;
  SwaggerModule.setup(swaggerUiPath, app, swaggerDoc);

  Logger.log(
    `Swagger Docs enabled: ${appConfig.domain}${swaggerUiPath}`,
    'NestApplication',
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

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

  // const appConfig = app.get<AppConfiguration>(appConfiguration.KEY);
  const appConfig = app.get<AppConfiguration>(appConfiguration.KEY);

  configureSwagger(appConfig, app, globalPrefix);

  // to remove bigint serialization error
  (BigInt.prototype as any).toJSON = function () {
    return Number(this);
  };

  await app.listen(appConfig.port, () => {
    Logger.log(`Listening at ${appConfig.port}`);
  });
}
bootstrap();
