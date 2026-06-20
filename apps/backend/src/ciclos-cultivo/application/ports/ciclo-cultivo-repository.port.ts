import { CicloCultivo } from '../../domain/ciclo-cultivo.domain';

export interface CreateCicloCultivoData {
  variedadePlanta: string;
  dataInicio: string;
  colhida: boolean;
  rendimentoKg: number;
  estufaId: number;
}

export interface UpdateCicloCultivoData {
  variedadePlanta?: string;
  dataInicio?: string;
  colhida?: boolean;
  rendimentoKg?: number;
}

/**
 * PORT (Interface) - Define o contrato do repositório de CicloCultivo.
 */
export interface ICicloCultivoRepository {
  findAll(): Promise<CicloCultivo[]>;
  findById(id: number): Promise<CicloCultivo | null>;
  findByEstufaId(estufaId: number): Promise<CicloCultivo[]>;
  create(data: CreateCicloCultivoData): Promise<CicloCultivo>;
  update(id: number, data: UpdateCicloCultivoData): Promise<CicloCultivo | null>;
  delete(id: number): Promise<boolean>;
}

export const CICLO_CULTIVO_REPOSITORY = Symbol('ICicloCultivoRepository');
