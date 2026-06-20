import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import * as fs from 'fs';
import { EstufaOrmEntity } from '../../estufas/infrastructure/persistence/typeorm/estufa.orm-entity';
import { CicloCultivoOrmEntity } from '../../ciclos-cultivo/infrastructure/persistence/typeorm/ciclo-cultivo.orm-entity';
import { UserOrmEntity } from '../../auth/infrastructure/persistence/typeorm/user.orm-entity';
import { SeedService } from './seed.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Garante que a pasta data/ exista antes de o TypeORM tentar criar o arquivo
const dataDir = join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        type: 'better-sqlite3' as const,
        database: join(process.cwd(), 'data', 'database.sqlite'),
        entities: [EstufaOrmEntity, CicloCultivoOrmEntity, UserOrmEntity],
        /**
         * ATENÇÃO — synchronize: true
         * Uso EXCLUSIVAMENTE acadêmico/desenvolvimento.
         * Em produção, utilizar migrations para evitar perda de dados.
         * Referência: https://typeorm.io/migrations
         */
        synchronize: true,
        logging: false,
      }),
    }),
    TypeOrmModule.forFeature([EstufaOrmEntity, CicloCultivoOrmEntity, UserOrmEntity]),
  ],
  providers: [SeedService],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
