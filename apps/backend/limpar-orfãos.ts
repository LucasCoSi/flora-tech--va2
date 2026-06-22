import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  
  await dataSource.query(`DELETE FROM ciclos_cultivo WHERE estufa_id NOT IN (SELECT id FROM estufas)`);
  console.log('Ciclos órfãos limpos com sucesso!');
  
  await app.close();
}
bootstrap();
