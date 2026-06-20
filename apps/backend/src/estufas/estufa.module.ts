import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstufaOrmEntity } from './infrastructure/persistence/typeorm/estufa.orm-entity';
import { EstufaTypeOrmRepository } from './infrastructure/persistence/typeorm/estufa.typeorm-repository';
import { EstufaService } from './application/estufa.service';
import { EstufaController } from './presentation/controllers/estufa.controller';
import { ESTUFA_REPOSITORY } from './application/ports/estufa-repository.port';

@Module({
  imports: [TypeOrmModule.forFeature([EstufaOrmEntity])],
  providers: [
    EstufaService,
    {
      provide: ESTUFA_REPOSITORY,
      useClass: EstufaTypeOrmRepository,
    },
  ],
  controllers: [EstufaController],
  exports: [EstufaService, ESTUFA_REPOSITORY],
})
export class EstufaModule {}
