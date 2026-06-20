import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/database/database.module';
import { EstufaModule } from './estufas/estufa.module';
import { CicloCultivoModule } from './ciclos-cultivo/ciclo-cultivo.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    EstufaModule,
    CicloCultivoModule,
  ],
})
export class AppModule {}
