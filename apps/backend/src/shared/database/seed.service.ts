import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstufaOrmEntity } from '../../estufas/infrastructure/persistence/typeorm/estufa.orm-entity';
import { CicloCultivoOrmEntity } from '../../ciclos-cultivo/infrastructure/persistence/typeorm/ciclo-cultivo.orm-entity';
import { UserOrmEntity } from '../../auth/infrastructure/persistence/typeorm/user.orm-entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

/**
 * SEED SERVICE — Popula o banco com dados de demonstração na primeira execução.
 * Executa apenas se as tabelas estiverem vazias, garantindo idempotência.
 * Uso exclusivamente acadêmico/desenvolvimento.
 */
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(EstufaOrmEntity)
    private readonly estufaRepo: Repository<EstufaOrmEntity>,
    @InjectRepository(CicloCultivoOrmEntity)
    private readonly cicloRepo: Repository<CicloCultivoOrmEntity>,
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const totalUsers = await this.userRepo.count();
    const totalEstufas = await this.estufaRepo.count();
    
    if (totalUsers > 0 && totalEstufas > 0) {
      this.logger.log('Banco já populado — seed ignorado.');
      return;
    }

    this.logger.log('🌱 Executando seed de dados de demonstração...');

    // ── Admin User ───────────────────────────────────────────────────────────
    if (totalUsers === 0) {
      const email = this.configService.get<string>('ADMIN_EMAIL', 'admin@floratech.com');
      const password = this.configService.get<string>('ADMIN_PASSWORD', 'Admin@123');
      const nome = this.configService.get<string>('ADMIN_NAME', 'Administrador');

      const senhaHash = await bcrypt.hash(password, 10);
      
      await this.userRepo.save(
        this.userRepo.create({
          nome,
          email,
          senha: senhaHash,
          ativo: true,
          role: 'admin',
        })
      );
      this.logger.log(`✅ Seed: Usuário admin criado (${email})`);
    }

    if (totalEstufas > 0) {
      return;
    }

    // ── Estufas ──────────────────────────────────────────────────────────────
    const estufas = await this.estufaRepo.save([
      this.estufaRepo.create({
        nome: 'Estufa A-1',
        dataInauguracao: '2022-03-10',
        ativa: true,
        areaM2: 120,
      }),
      this.estufaRepo.create({
        nome: 'Estufa B-2',
        dataInauguracao: '2021-07-01',
        ativa: true,
        areaM2: 80,
      }),
      this.estufaRepo.create({
        nome: 'Estufa C-3 (Inativa)',
        dataInauguracao: '2019-01-15',
        ativa: false,
        areaM2: 50,
      }),
    ]);

    // ── Ciclos de Cultivo ──────────────────────────────────────────────────
    await this.cicloRepo.save([
      this.cicloRepo.create({
        variedadePlanta: 'Alface Crespa',
        dataInicio: '2022-04-01',
        colhida: true,
        rendimentoKg: 200,
        estufaId: estufas[0].id,
      }),
      this.cicloRepo.create({
        variedadePlanta: 'Rúcula',
        dataInicio: '2022-08-15',
        colhida: false,
        rendimentoKg: 0,
        estufaId: estufas[0].id,
      }),
      this.cicloRepo.create({
        variedadePlanta: 'Espinafre',
        dataInicio: '2021-09-01',
        colhida: true,
        rendimentoKg: 150,
        estufaId: estufas[1].id,
      }),
      this.cicloRepo.create({
        variedadePlanta: 'Manjericão',
        dataInicio: '2022-01-10',
        colhida: false,
        rendimentoKg: 0,
        estufaId: estufas[1].id,
      }),
    ]);

    this.logger.log(
      `✅ Seed concluído: ${estufas.length} estufas e 4 ciclos de cultivo criados.`,
    );
  }
}
