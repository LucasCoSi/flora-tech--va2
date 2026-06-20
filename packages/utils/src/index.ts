/**
 * @flora-tech/utils — Tipos e utilitários compartilhados entre backend e frontend.
 */

/** Resposta de erro padronizada do backend */
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

/** Resposta de sucesso para operações de exclusão */
export interface DeleteResponse {
  message: string;
}

/** Payload do JWT */
export interface JwtPayload {
  sub: number;
  email: string;
  nome: string;
  role: 'user' | 'admin';
}

/** Resposta do login */
export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    nome: string;
    email: string;
    role: 'user' | 'admin';
  };
}

/** Interface base de Estufa */
export interface IEstufa {
  id: number;
  nome: string;
  dataInauguracao: string;
  ativa: boolean;
  areaM2: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Interface base de CicloCultivo */
export interface ICicloCultivo {
  id: number;
  variedadePlanta: string;
  dataInicio: string;
  colhida: boolean;
  rendimentoKg: number;
  estufaId: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Interface base de Usuário (sem senha) */
export interface IUser {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  role: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}
