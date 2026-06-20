export interface Estufa {
  id: number;
  nome: string;
  dataInauguracao: string;
  ativa: boolean;
  areaM2: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EstufaComCiclos extends Estufa {
  ciclosCultivo: import('../../ciclos-cultivo/domain/ciclo-cultivo.domain').CicloCultivo[];
}
