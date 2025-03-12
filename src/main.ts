import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import * as compression from 'compression';

async function bootstrap() {
  const appConfig={logger:new ConsoleLogger({
    //json:true,
    timestamp:true,
    logLevels:['log','error','warn','debug','verbose']
  })}
  const app = await NestFactory.create(AppModule,appConfig);
  app.use(compression());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
