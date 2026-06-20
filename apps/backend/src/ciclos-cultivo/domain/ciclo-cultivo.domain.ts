export interface CicloCultivo {
  id: number;
  variedadePlanta: string;
  dataInicio: string;
  colhida: boolean;
  rendimentoKg: number;
  estufaId: number;
  createdAt?: Date;
  updatedAt?: Date;
}
