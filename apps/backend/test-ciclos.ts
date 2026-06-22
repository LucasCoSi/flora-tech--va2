import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { CicloCultivoService } from './src/ciclos-cultivo/application/ciclo-cultivo.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(CicloCultivoService);
  const ciclos = await service.findAll();
  console.log('CICLOS:', ciclos);
  await app.close();
}
bootstrap();
