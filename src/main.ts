import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import * as compression from 'compression';
import { SwaggerModule,DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const appConfig={logger:new ConsoleLogger({
    //json:true,
    timestamp:true,
    logLevels:['log','error','warn','debug','verbose']
  })}
  const app = await NestFactory.create(AppModule,appConfig);
  app.use(compression());
  const configDocument=new DocumentBuilder()
    .setTitle('REST API oficina5-studies')
    .setDescription('REST API Testing main features in nestjs')
    .setVersion('1.0')
    .addTag('users')
    .addTag('files')
    .addTag('auth')
    .addBearerAuth()
    .addServer('http://localhost:3000')
    .build()
  ;
  const documentFactory = () => SwaggerModule.createDocument(app, configDocument);
  SwaggerModule.setup('docs', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
