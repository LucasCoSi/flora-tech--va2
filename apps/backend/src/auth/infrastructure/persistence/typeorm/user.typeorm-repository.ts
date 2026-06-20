import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import {
  IUserRepository,
  CreateUserData,
  UpdateUserData,
} from '../../../application/ports/user-repository.port';
import { User, UserWithoutPassword } from '../../../domain/user.domain';

/**
 * ADAPTER — Implementação concreta do PORT IUserRepository.
 * Traduz operações de domínio para TypeORM/SQLite.
 */
@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly ormRepo: Repository<UserOrmEntity>,
  ) {}

  private toUserDomain(entity: UserOrmEntity): User {
    return {
      id: entity.id,
      nome: entity.nome,
      email: entity.email,
      senha: entity.senha,
      ativo: entity.ativo,
      role: entity.role,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private toUserWithoutPassword(entity: UserOrmEntity): UserWithoutPassword {
    return {
      id: entity.id,
      nome: entity.nome,
      email: entity.email,
      ativo: entity.ativo,
      role: entity.role,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  async findAll(): Promise<UserWithoutPassword[]> {
    const entities = await this.ormRepo.find();
    return entities.map((e) => this.toUserWithoutPassword(e));
  }

  async findById(id: number): Promise<User | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    return entity ? this.toUserDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.ormRepo.findOne({ where: { email } });
    return entity ? this.toUserDomain(entity) : null;
  }

  async create(data: CreateUserData): Promise<UserWithoutPassword> {
    const entity = this.ormRepo.create({
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      ativo: data.ativo ?? false,
      role: data.role ?? 'user',
    });
    const saved = await this.ormRepo.save(entity);
    return this.toUserWithoutPassword(saved);
  }

  async update(id: number, data: UpdateUserData): Promise<UserWithoutPassword | null> {
    const entity = await this.ormRepo.findOne({ where: { id } });
    if (!entity) return null;

    Object.assign(entity, data);
    const saved = await this.ormRepo.save(entity);
    return this.toUserWithoutPassword(saved);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.ormRepo.delete({ id });
    return (result.affected ?? 0) > 0;
  }

  async count(): Promise<number> {
    return this.ormRepo.count();
  }
}
