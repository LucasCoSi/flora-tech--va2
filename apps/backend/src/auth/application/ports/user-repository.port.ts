import { User, UserWithoutPassword } from '../../domain/user.domain';

export interface CreateUserData {
  nome: string;
  email: string;
  senha: string;
  ativo?: boolean;
  role?: 'user' | 'admin';
}

export interface UpdateUserData {
  nome?: string;
  email?: string;
  senha?: string;
  ativo?: boolean;
  role?: 'user' | 'admin';
}

/**
 * PORT (Interface) — Define o contrato do repositório de Usuário.
 * A camada de aplicação (Service) depende desta interface, não da implementação concreta.
 */
export interface IUserRepository {
  findAll(): Promise<UserWithoutPassword[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserData): Promise<UserWithoutPassword>;
  update(id: number, data: UpdateUserData): Promise<UserWithoutPassword | null>;
  delete(id: number): Promise<boolean>;
  count(): Promise<number>;
}

export const USER_REPOSITORY = Symbol('IUserRepository');
