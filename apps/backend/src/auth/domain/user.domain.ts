/**
 * DOMAIN — Interface de domínio do Usuário.
 * Sem dependência de ORM ou framework.
 */
export interface User {
  id: number;
  nome: string;
  email: string;
  senha: string;
  ativo: boolean;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

/** Usuário sem a senha — para retorno em APIs */
export type UserWithoutPassword = Omit<User, 'senha'>;
