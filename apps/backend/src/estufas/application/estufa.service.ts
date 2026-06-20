import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IEstufaRepository,
  ESTUFA_REPOSITORY,
  CreateEstufaData,
  UpdateEstufaData,
} from './ports/estufa-repository.port';
import { Estufa, EstufaComCiclos } from '../domain/estufa.domain';
import { CreateEstufaDto, UpdateEstufaDto } from '../presentation/dtos/estufa.dto';

/**
 * SERVICE (Camada de Aplicação) - Orquestra regras de negócio.
 * Injeta a PORT (IEstufaRepository), nunca a implementação concreta.
 * Todas as validações de negócio estão aqui.
 */
@Injectable()
export class EstufaService {
  constructor(
    @Inject(ESTUFA_REPOSITORY)
    private readonly estufaRepository: IEstufaRepository,
  ) {}

  // ──────────────────────────────────────────
  // VALIDAÇÕES DE NEGÓCIO PRIVADAS
  // ──────────────────────────────────────────

  /**
   * VALIDAÇÃO 1: Data de inauguração não pode ser no futuro.
   */
  private validarDataInauguracao(dataInauguracao: string): void {
    const dataFornecida = new Date(dataInauguracao);
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);
    if (dataFornecida > hoje) {
      throw new BadRequestException(
        'Data de inauguração não pode ser no futuro.',
      );
    }
  }

  /**
   * VALIDAÇÃO 2: areaM2 deve ser >= 20.
   * (Já validado no DTO, mas garantido também no Service)
   */
  private validarAreaM2(areaM2: number): void {
    if (areaM2 < 20) {
      throw new BadRequestException(
        'A área da estufa deve ser de pelo menos 20 m² para ser considerada uma estufa comercial viável.',
      );
    }
  }

  // ──────────────────────────────────────────
  // OPERAÇÕES CRUD
  // ──────────────────────────────────────────

  async findAll(): Promise<Estufa[]> {
    return this.estufaRepository.findAll();
  }

  async findById(id: number): Promise<Estufa> {
    const estufa = await this.estufaRepository.findById(id);
    if (!estufa) {
      throw new NotFoundException(`Estufa com ID ${id} não encontrada.`);
    }
    return estufa;
  }

  async findByIdWithCiclos(id: number): Promise<EstufaComCiclos> {
    const estufa = await this.estufaRepository.findByIdWithCiclos(id);
    if (!estufa) {
      throw new NotFoundException(`Estufa com ID ${id} não encontrada.`);
    }
    return estufa;
  }

  async create(dto: CreateEstufaDto): Promise<Estufa> {
    // VALIDAÇÃO 1: Todos os campos obrigatórios
    if (!dto.nome || dto.ativa === undefined || dto.ativa === null || !dto.dataInauguracao || dto.areaM2 === undefined || dto.areaM2 === null) {
      throw new BadRequestException('Todos os campos de Estufa são obrigatórios e devem ser preenchidos.');
    }

    // VALIDAÇÃO 2: Data de inauguração
    this.validarDataInauguracao(dto.dataInauguracao);

    // VALIDAÇÃO 4: Área mínima
    this.validarAreaM2(dto.areaM2);

    const data: CreateEstufaData = {
      nome: dto.nome.trim(),
      dataInauguracao: dto.dataInauguracao,
      ativa: dto.ativa,
      areaM2: dto.areaM2,
    };

    return this.estufaRepository.create(data);
  }

  async update(id: number, dto: UpdateEstufaDto): Promise<Estufa> {
    const existente = await this.estufaRepository.findById(id);
    if (!existente) {
      throw new NotFoundException(`Estufa com ID ${id} não encontrada.`);
    }

    // Validar data se fornecida
    if (dto.dataInauguracao !== undefined) {
      this.validarDataInauguracao(dto.dataInauguracao);
    }

    // Validar área se fornecida
    if (dto.areaM2 !== undefined) {
      this.validarAreaM2(dto.areaM2);
    }

    const data: UpdateEstufaData = {
      ...(dto.nome !== undefined && { nome: dto.nome.trim() }),
      ...(dto.dataInauguracao !== undefined && { dataInauguracao: dto.dataInauguracao }),
      ...(dto.ativa !== undefined && { ativa: dto.ativa }),
      ...(dto.areaM2 !== undefined && { areaM2: dto.areaM2 }),
    };

    const updated = await this.estufaRepository.update(id, data);
    if (!updated) {
      throw new NotFoundException(`Estufa com ID ${id} não encontrada.`);
    }

    return updated;
  }

  async delete(id: number): Promise<{ message: string }> {
    const existente = await this.estufaRepository.findById(id);
    if (!existente) {
      throw new NotFoundException(`Estufa com ID ${id} não encontrada.`);
    }

    const deleted = await this.estufaRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Não foi possível remover a estufa com ID ${id}.`);
    }

    return { message: `Estufa "${existente.nome}" removida com sucesso.` };
  }
}
