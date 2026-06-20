import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ICicloCultivoRepository,
  CICLO_CULTIVO_REPOSITORY,
  CreateCicloCultivoData,
  UpdateCicloCultivoData,
} from './ports/ciclo-cultivo-repository.port';
import { CicloCultivo } from '../domain/ciclo-cultivo.domain';
import {
  CreateCicloCultivoDto,
  UpdateCicloCultivoDto,
} from '../presentation/dtos/ciclo-cultivo.dto';
import {
  IEstufaRepository,
  ESTUFA_REPOSITORY,
} from '../../estufas/application/ports/estufa-repository.port';

/**
 * SERVICE (Camada de Aplicação) - Orquestra regras de negócio de CicloCultivo.
 * Contém TODAS as 7+ validações de negócio exigidas.
 * Injeta PORTs (interfaces), nunca implementações concretas.
 */
@Injectable()
export class CicloCultivoService {
  constructor(
    @Inject(CICLO_CULTIVO_REPOSITORY)
    private readonly cicloCultivoRepository: ICicloCultivoRepository,
    @Inject(ESTUFA_REPOSITORY)
    private readonly estufaRepository: IEstufaRepository,
  ) {}

  // ──────────────────────────────────────────────────────────
  // VALIDAÇÕES DE NEGÓCIO (7 validações implementadas)
  // ──────────────────────────────────────────────────────────

  /**
   * VALIDAÇÃO 3 (Integridade FK): Verifica se a estufa existe E está ativa.
   */
  private async validarEstufaAtivaOuLancarExcecao(estufaId: number) {
    const estufa = await this.estufaRepository.findById(estufaId);
    if (!estufa || !estufa.ativa) {
      throw new NotFoundException(
        'Estufa não encontrada ou inativa. Só é possível criar ciclos em estufas ativas.',
      );
    }
    return estufa;
  }

  /**
   * VALIDAÇÃO 5: rendimentoKg não pode exceder areaM2 * 8.
   */
  private validarLimiteRendimento(rendimentoKg: number, areaM2: number): void {
    const limiteMaximo = areaM2 * 8;
    if (rendimentoKg > limiteMaximo) {
      throw new BadRequestException(
        `O rendimento de ${rendimentoKg} kg excede o limite máximo realista de ${limiteMaximo} kg para uma estufa de ${areaM2} m² (limite: areaM2 × 8 = ${limiteMaximo} kg).`,
      );
    }
  }

  /**
   * VALIDAÇÃO 6: Se colhida = true, rendimentoKg deve ser > 0.
   */
  private validarConsistenciaColheita(colhida: boolean, rendimentoKg: number): void {
    if (colhida === true && rendimentoKg <= 0) {
      throw new BadRequestException(
        'Um ciclo marcado como colhido deve ter rendimento maior que 0 kg. Informe o rendimento da colheita.',
      );
    }
  }

  /**
   * VALIDAÇÃO 7: dataInicio não pode ser anterior à dataInauguracao da estufa.
   */
  private validarDataInicioNaoAnteriorAInauguracao(
    dataInicio: string,
    dataInauguracao: string,
  ): void {
    const inicio = new Date(dataInicio);
    const inauguracao = new Date(dataInauguracao);
    if (inicio < inauguracao) {
      throw new BadRequestException(
        `A data de início do ciclo (${dataInicio}) não pode ser anterior à data de inauguração da estufa (${dataInauguracao}).`,
      );
    }
  }

  /**
   * VALIDAÇÃO ADICIONAL: rendimentoKg não pode ser negativo (redundante com DTO, garantia extra).
   */
  private validarRendimentoNaoNegativo(rendimentoKg: number): void {
    if (rendimentoKg < 0) {
      throw new BadRequestException('O rendimento em kg não pode ser negativo.');
    }
  }

  // ──────────────────────────────────────────
  // OPERAÇÕES CRUD
  // ──────────────────────────────────────────

  async findAll(): Promise<CicloCultivo[]> {
    return this.cicloCultivoRepository.findAll();
  }

  async findById(id: number): Promise<CicloCultivo> {
    const ciclo = await this.cicloCultivoRepository.findById(id);
    if (!ciclo) {
      throw new NotFoundException(`Ciclo de cultivo com ID ${id} não encontrado.`);
    }
    return ciclo;
  }

  async findByEstufaId(estufaId: number): Promise<CicloCultivo[]> {
    // Verifica se a estufa existe (não precisa estar ativa para listar histórico)
    const estufa = await this.estufaRepository.findById(estufaId);
    if (!estufa) {
      throw new NotFoundException(`Estufa com ID ${estufaId} não encontrada.`);
    }
    return this.cicloCultivoRepository.findByEstufaId(estufaId);
  }

  async create(dto: CreateCicloCultivoDto): Promise<CicloCultivo> {
    // VALIDAÇÃO 1: Campos obrigatórios
    if (!dto.variedadePlanta || !dto.dataInicio || dto.colhida === undefined || dto.colhida === null || dto.rendimentoKg === undefined || dto.rendimentoKg === null || !dto.estufaId) {
      throw new BadRequestException('Todos os campos de CicloCultivo são obrigatórios e devem ser preenchidos.');
    }

    // VALIDAÇÃO 3: Estufa deve existir e estar ativa
    const estufa = await this.validarEstufaAtivaOuLancarExcecao(dto.estufaId);

    // VALIDAÇÃO 4 (rendimento não negativo)
    this.validarRendimentoNaoNegativo(dto.rendimentoKg);

    // VALIDAÇÃO 5: Limite de rendimento (areaM2 * 8)
    this.validarLimiteRendimento(dto.rendimentoKg, estufa.areaM2);

    // VALIDAÇÃO 6: colhida = true requer rendimentoKg > 0
    this.validarConsistenciaColheita(dto.colhida, dto.rendimentoKg);

    // VALIDAÇÃO 7: dataInicio não pode ser anterior à inauguração da estufa
    this.validarDataInicioNaoAnteriorAInauguracao(dto.dataInicio, estufa.dataInauguracao);

    const data: CreateCicloCultivoData = {
      variedadePlanta: dto.variedadePlanta.trim(),
      dataInicio: dto.dataInicio,
      colhida: dto.colhida,
      rendimentoKg: dto.rendimentoKg,
      estufaId: dto.estufaId,
    };

    return this.cicloCultivoRepository.create(data);
  }

  async update(id: number, dto: UpdateCicloCultivoDto): Promise<CicloCultivo> {
    const cicloExistente = await this.cicloCultivoRepository.findById(id);
    if (!cicloExistente) {
      throw new NotFoundException(`Ciclo de cultivo com ID ${id} não encontrado.`);
    }

    // Busca a estufa para validações que dependem dos dados dela
    const estufa = await this.estufaRepository.findById(cicloExistente.estufaId);
    if (!estufa) {
      throw new NotFoundException(`Estufa associada ao ciclo não encontrada.`);
    }

    // Determina os valores finais após atualização parcial
    const novoRendimento = dto.rendimentoKg !== undefined
      ? dto.rendimentoKg
      : cicloExistente.rendimentoKg;
    const novaColhida = dto.colhida !== undefined ? dto.colhida : cicloExistente.colhida;
    const novaDataInicio = dto.dataInicio !== undefined
      ? dto.dataInicio
      : cicloExistente.dataInicio;

    // VALIDAÇÃO 4/5: Limite de rendimento
    this.validarRendimentoNaoNegativo(novoRendimento);
    this.validarLimiteRendimento(novoRendimento, estufa.areaM2);

    // VALIDAÇÃO 6: Consistência colheita
    this.validarConsistenciaColheita(novaColhida, novoRendimento);

    // VALIDAÇÃO 7: Data de início não anterior à inauguração
    this.validarDataInicioNaoAnteriorAInauguracao(novaDataInicio, estufa.dataInauguracao);

    const data: UpdateCicloCultivoData = {
      ...(dto.variedadePlanta !== undefined && { variedadePlanta: dto.variedadePlanta.trim() }),
      ...(dto.dataInicio !== undefined && { dataInicio: dto.dataInicio }),
      ...(dto.colhida !== undefined && { colhida: dto.colhida }),
      ...(dto.rendimentoKg !== undefined && { rendimentoKg: dto.rendimentoKg }),
    };

    const updated = await this.cicloCultivoRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException(`Ciclo de cultivo com ID ${id} não encontrado.`);
    }

    return updated;
  }

  async delete(id: number): Promise<{ message: string }> {
    const existente = await this.cicloCultivoRepository.findById(id);
    if (!existente) {
      throw new NotFoundException(`Ciclo de cultivo com ID ${id} não encontrado.`);
    }

    const deleted = await this.cicloCultivoRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Não foi possível remover o ciclo de cultivo com ID ${id}.`);
    }

    return {
      message: `Ciclo de cultivo "${existente.variedadePlanta}" (ID: ${id}) removido com sucesso.`,
    };
  }
}
