import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
import { ContextService, RequestLogger } from '../../../src/request-context';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: {},
    }),
  );
  app.use(ContextService.middlewareRequest());
  // app.use(ContextService.middleware());

  app.use(
    ContextService.middleware({
      addTraces(req) {
        this.setTraceByUuid();
        this.set('request:session_id', req.session.id);
      },
    }),
  );
  app.useLogger(RequestLogger);

  const options = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
