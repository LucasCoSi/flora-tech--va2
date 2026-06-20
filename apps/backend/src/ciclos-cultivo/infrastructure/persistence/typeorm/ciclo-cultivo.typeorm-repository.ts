import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CicloCultivoOrmEntity } from './ciclo-cultivo.orm-entity';
import {
  ICicloCultivoRepository,
  CreateCicloCultivoData,
  UpdateCicloCultivoData,
} from '../../../application/ports/ciclo-cultivo-repository.port';
import { CicloCultivo } from '../../../domain/ciclo-cultivo.domain';

/**
 * ADAPTER - Implementação concreta do PORT ICicloCultivoRepository.
 * Traduz operações de domínio para TypeORM/SQLite.
 */
@Injectable()
export class CicloCultivoTypeOrmRepository implements ICicloCultivoRepository {
  constructor(
    @InjectRepository(CicloCultivoOrmEntity)
    private readonly ormRepo: Repository<CicloCultivoOrmEntity>,
  ) {}

  private toDomain(entity: CicloCultivoOrmEntity): CicloCultivo {
    return {
      id: entity.id,
      variedadePlanta: entity.variedadePlanta,
      dataInicio: entity.dataInicio,
      colhida: entity.colhida,
      rendimentoKg: Number(entity.rendimentoKg),
      estufaId: entity.estufaId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  async findAll(): Promise<CicloCultivo[]> {
    const entities = await this.ormRepo.find();
    return entities.map((e) => this.toDomain(e));
  }

  async findById(id: number): Promise<CicloCultivo | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEstufaId(estufaId: number): Promise<CicloCultivo[]> {
    const entities = await this.ormRepo.find({ where: { estufaId } });
    return entities.map((e) => this.toDomain(e));
  }

  async create(data: CreateCicloCultivoData): Promise<CicloCultivo> {
    const entity = this.ormRepo.create({
      variedadePlanta: data.variedadePlanta,
      dataInicio: data.dataInicio,
      colhida: data.colhida,
      rendimentoKg: data.rendimentoKg,
      estufaId: data.estufaId,
    });
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  async update(id: number, data: UpdateCicloCultivoData): Promise<CicloCultivo | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    if (!entity) return null;

    Object.assign(entity, data);
    const saved = await this.ormRepo.save(entity);
    return this.toDomain(saved);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.ormRepo.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
