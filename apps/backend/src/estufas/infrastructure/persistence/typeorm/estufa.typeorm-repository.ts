import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstufaOrmEntity } from './estufa.orm-entity';
import {
  IEstufaRepository,
  CreateEstufaData,
  UpdateEstufaData,
} from '../../../application/ports/estufa-repository.port';
import { Estufa, EstufaComCiclos } from '../../../domain/estufa.domain';

/**
 * ADAPTER - Implementação concreta do PORT IEstufaRepository.
 * Traduz operações de domínio para TypeORM/SQLite.
 */
@Injectable()
export class EstufaTypeOrmRepository implements IEstufaRepository {
  constructor(
    @InjectRepository(EstufaOrmEntity)
    private readonly ormRepo: Repository<EstufaOrmEntity>,
  ) {}

  private toEstufaDomain(entity: EstufaOrmEntity): Estufa {
    return {
      id: entity.id,
      nome: entity.nome,
      dataInauguracao: entity.dataInauguracao,
      ativa: entity.ativa,
      areaM2: Number(entity.areaM2),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  async findAll(): Promise<Estufa[]> {
    const entities = await this.ormRepo.find();
    return entities.map((e) => this.toEstufaDomain(e));
  }

  async findById(id: number): Promise<Estufa | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? this.toEstufaDomain(entity) : null;
  }

  async findByIdWithCiclos(id: number): Promise<EstufaComCiclos | null> {
    const entity = await this.ormRepo.findOne({
      where: { id },
      relations: ['ciclosCultivo'],
    });
    if (!entity) return null;

    return {
      ...this.toEstufaDomain(entity),
      ciclosCultivo: (entity.ciclosCultivo ?? []).map((ciclo) => ({
        id: ciclo.id,
        variedadePlanta: ciclo.variedadePlanta,
        dataInicio: ciclo.dataInicio,
        colhida: ciclo.colhida,
        rendimentoKg: Number(ciclo.rendimentoKg),
        estufaId: ciclo.estufaId,
        createdAt: ciclo.createdAt,
        updatedAt: ciclo.updatedAt,
      })),
    };
  }

  async create(data: CreateEstufaData): Promise<Estufa> {
    const entity = this.ormRepo.create({
      nome: data.nome,
      dataInauguracao: data.dataInauguracao,
      ativa: data.ativa,
      areaM2: data.areaM2,
    });
    const saved = await this.ormRepo.save(entity);
    return this.toEstufaDomain(saved);
  }

  async update(id: number, data: UpdateEstufaData): Promise<Estufa | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    if (!entity) return null;

    Object.assign(entity, data);
    const saved = await this.ormRepo.save(entity);
    return this.toEstufaDomain(saved);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.ormRepo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
