import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CicloCultivoOrmEntity } from './infrastructure/persistence/typeorm/ciclo-cultivo.orm-entity';
import { CicloCultivoTypeOrmRepository } from './infrastructure/persistence/typeorm/ciclo-cultivo.typeorm-repository';
import { CicloCultivoService } from './application/ciclo-cultivo.service';
import { CicloCultivoController } from './presentation/controllers/ciclo-cultivo.controller';
import { CICLO_CULTIVO_REPOSITORY } from './application/ports/ciclo-cultivo-repository.port';
import { EstufaModule } from '../estufas/estufa.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CicloCultivoOrmEntity]),
    EstufaModule,
  ],
  providers: [
    CicloCultivoService,
    {
      provide: CICLO_CULTIVO_REPOSITORY,
      useClass: CicloCultivoTypeOrmRepository,
    },
  ],
  controllers: [CicloCultivoController],
  exports: [CicloCultivoService],
})
export class CicloCultivoModule {}
