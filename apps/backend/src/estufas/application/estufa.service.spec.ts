import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EstufaService } from './estufa.service';
import { IEstufaRepository } from './ports/estufa-repository.port';
import { Estufa, EstufaComCiclos } from '../domain/estufa.domain';
import { CreateEstufaDto, UpdateEstufaDto } from '../presentation/dtos/estufa.dto';

// ─────────────────────────────────────────────────────────────────────────────
// FÁBRICA DE DADOS DE TESTE
// ─────────────────────────────────────────────────────────────────────────────

const criarEstufaFake = (overrides: Partial<Estufa> = {}): Estufa => ({
  id: 1,
  nome: 'Estufa Teste A-1',
  dataInauguracao: '2020-01-01',
  ativa: true,
  areaM2: 100,
  createdAt: new Date('2020-01-01'),
  updatedAt: new Date('2020-01-01'),
  ...overrides,
});

const criarEstufaComCiclosFake = (overrides: Partial<EstufaComCiclos> = {}): EstufaComCiclos => ({
  ...criarEstufaFake(),
  ciclosCultivo: [],
  ...overrides,
});

const criarCreateEstufaDto = (overrides: Partial<CreateEstufaDto> = {}): CreateEstufaDto => ({
  nome: 'Estufa Nova',
  dataInauguracao: '2020-06-15',
  ativa: true,
  areaM2: 50,
  ...overrides,
});

const criarUpdateEstufaDto = (overrides: Partial<UpdateEstufaDto> = {}): UpdateEstufaDto => ({
  nome: 'Estufa Atualizada',
  ...overrides,
});

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DO REPOSITÓRIO (PORT)
// ─────────────────────────────────────────────────────────────────────────────

const criarMockEstufaRepository = (): jest.Mocked<IEstufaRepository> => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findByIdWithCiclos: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE DE TESTES
// ─────────────────────────────────────────────────────────────────────────────

describe('EstufaService', () => {
  let service: EstufaService;
  let mockRepository: jest.Mocked<IEstufaRepository>;

  beforeEach(() => {
    mockRepository = criarMockEstufaRepository();
    service = new EstufaService(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ───────────────────────────────────────────
  // findAll
  // ───────────────────────────────────────────
  describe('findAll', () => {
    it('deve retornar uma lista de estufas', async () => {
      const estufas = [criarEstufaFake(), criarEstufaFake({ id: 2, nome: 'Estufa B-2' })];
      mockRepository.findAll.mockResolvedValue(estufas);

      const resultado = await service.findAll();

      expect(resultado).toEqual(estufas);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não há estufas', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const resultado = await service.findAll();

      expect(resultado).toEqual([]);
    });
  });

  // ───────────────────────────────────────────
  // findById
  // ───────────────────────────────────────────
  describe('findById', () => {
    it('deve retornar a estufa quando o ID existe', async () => {
      const estufa = criarEstufaFake();
      mockRepository.findById.mockResolvedValue(estufa);

      const resultado = await service.findById(1);

      expect(resultado).toEqual(estufa);
      expect(mockRepository.findById).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException quando o ID não existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
      await expect(service.findById(999)).rejects.toThrow(
        'Estufa com ID 999 não encontrada.',
      );
    });
  });

  // ───────────────────────────────────────────
  // findByIdWithCiclos
  // ───────────────────────────────────────────
  describe('findByIdWithCiclos', () => {
    it('deve retornar a estufa com seus ciclos de cultivo', async () => {
      const estufaComCiclos = criarEstufaComCiclosFake();
      mockRepository.findByIdWithCiclos.mockResolvedValue(estufaComCiclos);

      const resultado = await service.findByIdWithCiclos(1);

      expect(resultado).toEqual(estufaComCiclos);
      expect(resultado.ciclosCultivo).toBeInstanceOf(Array);
      expect(mockRepository.findByIdWithCiclos).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException quando a estufa não existe', async () => {
      mockRepository.findByIdWithCiclos.mockResolvedValue(null);

      await expect(service.findByIdWithCiclos(99)).rejects.toThrow(NotFoundException);
    });
  });

  // ───────────────────────────────────────────
  // create — VALIDAÇÕES DE NEGÓCIO
  // ───────────────────────────────────────────
  describe('create', () => {
    it('deve criar uma estufa com dados válidos', async () => {
      const dto = criarCreateEstufaDto();
      const estufaCriada = criarEstufaFake({ nome: dto.nome });
      mockRepository.create.mockResolvedValue(estufaCriada);

      const resultado = await service.create(dto);

      expect(resultado).toEqual(estufaCriada);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: dto.nome.trim(),
          dataInauguracao: dto.dataInauguracao,
          ativa: dto.ativa,
          areaM2: dto.areaM2,
        }),
      );
    });

    // ── VALIDAÇÃO 1: Campos obrigatórios ──────────────────────────────────

    it('[VALIDAÇÃO 1 - ERRO] deve lançar BadRequestException quando o nome está vazio', async () => {
      const dto = criarCreateEstufaDto({ nome: '' });
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('[VALIDAÇÃO 1 - ERRO] deve lançar BadRequestException quando ativa é null', async () => {
      const dto = criarCreateEstufaDto({ ativa: null as any });
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    // ── VALIDAÇÃO 2: dataInauguracao ──────────────────────────────────────────

    it('[VALIDAÇÃO 2 - SUCESSO] deve aceitar dataInauguracao no passado', async () => {
      const dto = criarCreateEstufaDto({ dataInauguracao: '2015-03-10' });
      mockRepository.create.mockResolvedValue(criarEstufaFake());

      await expect(service.create(dto)).resolves.not.toThrow();
    });

    it('[VALIDAÇÃO 2 - ERRO] deve lançar BadRequestException quando dataInauguracao é futura', async () => {
      const dataFutura = '2099-12-31';
      const dto = criarCreateEstufaDto({ dataInauguracao: dataFutura });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      await expect(service.create(dto)).rejects.toThrow(
        'Data de inauguração não pode ser no futuro.',
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    // ── VALIDAÇÃO: areaM2 ──────────────────────────────────────────────────

    it('[VALIDAÇÃO 4 - SUCESSO] deve aceitar areaM2 igual a 20 m²', async () => {
      const dto = criarCreateEstufaDto({ areaM2: 20 });
      mockRepository.create.mockResolvedValue(criarEstufaFake({ areaM2: 20 }));

      await expect(service.create(dto)).resolves.not.toThrow();
    });

    it('[VALIDAÇÃO 4 - SUCESSO] deve aceitar areaM2 maior que 20 m²', async () => {
      const dto = criarCreateEstufaDto({ areaM2: 250 });
      mockRepository.create.mockResolvedValue(criarEstufaFake({ areaM2: 250 }));

      await expect(service.create(dto)).resolves.not.toThrow();
    });

    it('[VALIDAÇÃO 4 - ERRO] deve lançar BadRequestException quando areaM2 < 20', async () => {
      const dto = criarCreateEstufaDto({ areaM2: 19.9 });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      await expect(service.create(dto)).rejects.toThrow(
        'A área da estufa deve ser de pelo menos 20 m²',
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('[VALIDAÇÃO 4 - ERRO] deve lançar BadRequestException quando areaM2 = 0', async () => {
      const dto = criarCreateEstufaDto({ areaM2: 0 });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('deve fazer trim no nome antes de persistir', async () => {
      const dto = criarCreateEstufaDto({ nome: '  Estufa com espaços  ' });
      mockRepository.create.mockResolvedValue(criarEstufaFake({ nome: 'Estufa com espaços' }));

      await service.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ nome: 'Estufa com espaços' }),
      );
    });
  });

  // ───────────────────────────────────────────
  // update
  // ───────────────────────────────────────────
  describe('update', () => {
    it('deve atualizar uma estufa com dados válidos', async () => {
      const estufaExistente = criarEstufaFake();
      const estufaAtualizada = criarEstufaFake({ nome: 'Novo Nome' });
      mockRepository.findById.mockResolvedValue(estufaExistente);
      mockRepository.update.mockResolvedValue(estufaAtualizada);

      const dto = criarUpdateEstufaDto({ nome: 'Novo Nome' });
      const resultado = await service.update(1, dto);

      expect(resultado).toEqual(estufaAtualizada);
      expect(mockRepository.update).toHaveBeenCalledWith(1, { nome: 'Novo Nome' });
    });

    it('deve lançar NotFoundException quando a estufa não existe ao atualizar', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.update(999, criarUpdateEstufaDto())).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('[VALIDAÇÃO 2 - ERRO] deve lançar BadRequestException ao atualizar com dataInauguracao futura', async () => {
      mockRepository.findById.mockResolvedValue(criarEstufaFake());
      const dto = criarUpdateEstufaDto({ dataInauguracao: '2099-01-01' });

      await expect(service.update(1, dto)).rejects.toThrow(BadRequestException);
      await expect(service.update(1, dto)).rejects.toThrow(
        'Data de inauguração não pode ser no futuro.',
      );
    });

    it('[VALIDAÇÃO 4 - ERRO] deve lançar BadRequestException ao atualizar com areaM2 < 20', async () => {
      mockRepository.findById.mockResolvedValue(criarEstufaFake());
      const dto = criarUpdateEstufaDto({ areaM2: 10 });

      await expect(service.update(1, dto)).rejects.toThrow(BadRequestException);
    });

    it('deve permitir atualização parcial sem alterar campos não enviados', async () => {
      const estufaExistente = criarEstufaFake();
      mockRepository.findById.mockResolvedValue(estufaExistente);
      mockRepository.update.mockResolvedValue({ ...estufaExistente, ativa: false });

      const dto: UpdateEstufaDto = { ativa: false };
      await service.update(1, dto);

      expect(mockRepository.update).toHaveBeenCalledWith(1, { ativa: false });
    });
  });

  // ───────────────────────────────────────────
  // delete
  // ───────────────────────────────────────────
  describe('delete', () => {
    it('deve remover uma estufa existente e retornar mensagem de sucesso', async () => {
      const estufa = criarEstufaFake({ nome: 'Estufa A-1' });
      mockRepository.findById.mockResolvedValue(estufa);
      mockRepository.delete.mockResolvedValue(true);

      const resultado = await service.delete(1);

      expect(resultado).toEqual({ message: 'Estufa "Estufa A-1" removida com sucesso.' });
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException ao tentar remover estufa inexistente', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.delete(99)).rejects.toThrow(NotFoundException);
      await expect(service.delete(99)).rejects.toThrow(
        'Estufa com ID 99 não encontrada.',
      );
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando a deleção falha no repositório', async () => {
      mockRepository.findById.mockResolvedValue(criarEstufaFake());
      mockRepository.delete.mockResolvedValue(false);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
