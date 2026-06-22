import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { EstufaService } from './src/estufas/application/estufa.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(EstufaService);
  const estufas = await service.findAll();
  console.log('ESTUFAS:', estufas);
  await app.close();
}
bootstrap();
