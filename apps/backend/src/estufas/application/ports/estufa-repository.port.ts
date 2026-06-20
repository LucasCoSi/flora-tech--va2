import { Estufa, EstufaComCiclos } from '../../domain/estufa.domain';

export interface CreateEstufaData {
  nome: string;
  dataInauguracao: string;
  ativa: boolean;
  areaM2: number;
}

export interface UpdateEstufaData {
  nome?: string;
  dataInauguracao?: string;
  ativa?: boolean;
  areaM2?: number;
}

/**
 * PORT (Interface) - Define o contrato do repositório de Estufa.
 * A camada de aplicação (Service) depende desta interface, não da implementação concreta.
 */
export interface IEstufaRepository {
  findAll(): Promise<Estufa[]>;
  findById(id: number): Promise<Estufa | null>;
  findByIdWithCiclos(id: number): Promise<EstufaComCiclos | null>;
  create(data: CreateEstufaData): Promise<Estufa>;
  update(id: number, data: UpdateEstufaData): Promise<Estufa | null>;
  delete(id: number): Promise<boolean>;
}

export const ESTUFA_REPOSITORY = Symbol('IEstufaRepository');
