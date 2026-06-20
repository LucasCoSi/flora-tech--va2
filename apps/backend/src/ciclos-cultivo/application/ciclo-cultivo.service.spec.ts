import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CicloCultivoService } from './ciclo-cultivo.service';
import { ICicloCultivoRepository } from './ports/ciclo-cultivo-repository.port';
import { IEstufaRepository } from '../../estufas/application/ports/estufa-repository.port';
import { CicloCultivo } from '../domain/ciclo-cultivo.domain';
import { Estufa } from '../../estufas/domain/estufa.domain';
import { CreateCicloCultivoDto, UpdateCicloCultivoDto } from '../presentation/dtos/ciclo-cultivo.dto';

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

const criarCicloCultivoFake = (overrides: Partial<CicloCultivo> = {}): CicloCultivo => ({
  id: 1,
  variedadePlanta: 'Alface Crespa',
  dataInicio: '2020-03-01',
  colhida: false,
  rendimentoKg: 0,
  estufaId: 1,
  createdAt: new Date('2020-03-01'),
  updatedAt: new Date('2020-03-01'),
  ...overrides,
});

const criarCreateCicloCultivoDto = (
  overrides: Partial<CreateCicloCultivoDto> = {},
): CreateCicloCultivoDto => ({
  variedadePlanta: 'Alface Crespa',
  dataInicio: '2020-06-01',
  colhida: false,
  rendimentoKg: 0,
  estufaId: 1,
  ...overrides,
});

const criarUpdateCicloCultivoDto = (
  overrides: Partial<UpdateCicloCultivoDto> = {},
): UpdateCicloCultivoDto => ({
  variedadePlanta: 'Rúcula',
  ...overrides,
});

// ─────────────────────────────────────────────────────────────────────────────
// MOCKS DOS REPOSITÓRIOS (PORTS)
// ─────────────────────────────────────────────────────────────────────────────

const criarMockCicloCultivoRepository = (): jest.Mocked<ICicloCultivoRepository> => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEstufaId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

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

describe('CicloCultivoService', () => {
  let service: CicloCultivoService;
  let mockCicloRepository: jest.Mocked<ICicloCultivoRepository>;
  let mockEstufaRepository: jest.Mocked<IEstufaRepository>;

  beforeEach(() => {
    mockCicloRepository = criarMockCicloCultivoRepository();
    mockEstufaRepository = criarMockEstufaRepository();
    service = new CicloCultivoService(mockCicloRepository, mockEstufaRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ───────────────────────────────────────────
  // findAll
  // ───────────────────────────────────────────
  describe('findAll', () => {
    it('deve retornar todos os ciclos de cultivo', async () => {
      const ciclos = [criarCicloCultivoFake(), criarCicloCultivoFake({ id: 2, variedadePlanta: 'Rúcula' })];
      mockCicloRepository.findAll.mockResolvedValue(ciclos);

      const resultado = await service.findAll();

      expect(resultado).toEqual(ciclos);
      expect(resultado).toHaveLength(2);
      expect(mockCicloRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não há ciclos', async () => {
      mockCicloRepository.findAll.mockResolvedValue([]);

      const resultado = await service.findAll();

      expect(resultado).toEqual([]);
    });
  });

  // ───────────────────────────────────────────
  // findById
  // ───────────────────────────────────────────
  describe('findById', () => {
    it('deve retornar o ciclo quando o ID existe', async () => {
      const ciclo = criarCicloCultivoFake();
      mockCicloRepository.findById.mockResolvedValue(ciclo);

      const resultado = await service.findById(1);

      expect(resultado).toEqual(ciclo);
      expect(mockCicloRepository.findById).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException quando o ID não existe', async () => {
      mockCicloRepository.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
      await expect(service.findById(999)).rejects.toThrow(
        'Ciclo de cultivo com ID 999 não encontrado.',
      );
    });
  });

  // ───────────────────────────────────────────
  // findByEstufaId
  // ───────────────────────────────────────────
  describe('findByEstufaId', () => {
    it('deve retornar ciclos de uma estufa existente', async () => {
      const estufa = criarEstufaFake();
      const ciclos = [criarCicloCultivoFake()];
      mockEstufaRepository.findById.mockResolvedValue(estufa);
      mockCicloRepository.findByEstufaId.mockResolvedValue(ciclos);

      const resultado = await service.findByEstufaId(1);

      expect(resultado).toEqual(ciclos);
      expect(mockEstufaRepository.findById).toHaveBeenCalledWith(1);
      expect(mockCicloRepository.findByEstufaId).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException quando a estufa não existe', async () => {
      mockEstufaRepository.findById.mockResolvedValue(null);

      await expect(service.findByEstufaId(999)).rejects.toThrow(NotFoundException);
      expect(mockCicloRepository.findByEstufaId).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────────────────────────
  // create — VALIDAÇÕES DE NEGÓCIO
  // ───────────────────────────────────────────
  describe('create', () => {

    // ── setup padrão de estufa ativa ──────────────────────────────────────
    beforeEach(() => {
      // Por padrão, a estufa existe e está ativa com areaM2 = 100
      mockEstufaRepository.findById.mockResolvedValue(criarEstufaFake());
    });

    it('deve criar um ciclo de cultivo com dados válidos', async () => {
      const dto = criarCreateCicloCultivoDto();
      const cicloCriado = criarCicloCultivoFake();
      mockCicloRepository.create.mockResolvedValue(cicloCriado);

      const resultado = await service.create(dto);

      expect(resultado).toEqual(cicloCriado);
      expect(mockCicloRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          variedadePlanta: dto.variedadePlanta,
          dataInicio: dto.dataInicio,
          colhida: dto.colhida,
          rendimentoKg: dto.rendimentoKg,
          estufaId: dto.estufaId,
        }),
      );
    });

    // ── VALIDAÇÃO 1: Campos obrigatórios ──────────────────────────────────

    it('[VALIDAÇÃO 1 - ERRO] deve lançar BadRequestException quando variedadePlanta está vazia', async () => {
      const dto = criarCreateCicloCultivoDto({ variedadePlanta: '' });
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('[VALIDAÇÃO 1 - ERRO] deve lançar BadRequestException quando rendimentoKg é null', async () => {
      const dto = criarCreateCicloCultivoDto({ rendimentoKg: null as any });
      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    // ── VALIDAÇÃO 3: Integridade FK — estufa existe e está ativa ──────────

    it('[VALIDAÇÃO 3 - SUCESSO] deve criar ciclo quando estufa existe e está ativa', async () => {
      const dto = criarCreateCicloCultivoDto();
      mockCicloRepository.create.mockResolvedValue(criarCicloCultivoFake());

      await expect(service.create(dto)).resolves.not.toThrow();
      expect(mockEstufaRepository.findById).toHaveBeenCalledWith(dto.estufaId);
    });

    it('[VALIDAÇÃO 3 - ERRO] deve lançar NotFoundException quando estufa não existe', async () => {
      mockEstufaRepository.findById.mockResolvedValue(null);
      const dto = criarCreateCicloCultivoDto({ estufaId: 999 });

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      await expect(service.create(dto)).rejects.toThrow(
        'Estufa não encontrada ou inativa.',
      );
      expect(mockCicloRepository.create).not.toHaveBeenCalled();
    });

    it('[VALIDAÇÃO 3 - ERRO] deve lançar NotFoundException quando estufa está inativa', async () => {
      mockEstufaRepository.findById.mockResolvedValue(
        criarEstufaFake({ ativa: false }),
      );
      const dto = criarCreateCicloCultivoDto();

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      await expect(service.create(dto)).rejects.toThrow(
        'Estufa não encontrada ou inativa.',
      );
      expect(mockCicloRepository.create).not.toHaveBeenCalled();
    });

    // ── VALIDAÇÃO 5: rendimentoKg <= areaM2 * 8 ──────────────────────────

    it('[VALIDAÇÃO 5 - SUCESSO] deve aceitar rendimentoKg exatamente no limite (areaM2 * 8)', async () => {
      // Estufa com areaM2 = 100 → limite = 800 kg
      const dto = criarCreateCicloCultivoDto({ rendimentoKg: 800 });
      mockCicloRepository.create.mockResolvedValue(criarCicloCultivoFake({ rendimentoKg: 800 }));

      await expect(service.create(dto)).resolves.not.toThrow();
    });

    it('[VALIDAÇÃO 5 - SUCESSO] deve aceitar rendimentoKg abaixo do limite', async () => {
      const dto = criarCreateCicloCultivoDto({ rendimentoKg: 400 });
      mockCicloRepository.create.mockResolvedValue(criarCicloCultivoFake({ rendimentoKg: 400 }));

      await expect(service.create(dto)).resolves.not.toThrow();
    });

    it('[VALIDAÇÃO 5 - ERRO] deve lançar BadRequestException quando rendimentoKg > areaM2 * 8', async () => {
      // Estufa com areaM2 = 100 → limite = 800 kg
      const dto = criarCreateCicloCultivoDto({ rendimentoKg: 801 });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      await expect(service.create(dto)).rejects.toThrow(
        'excede o limite máximo realista',
      );
      expect(mockCicloRepository.create).not.toHaveBeenCalled();
    });

    it('[VALIDAÇÃO 5 - ERRO] deve calcular o limite corretamente para diferentes areaM2', async () => {
      // Estufa com areaM2 = 50 → limite = 400 kg
      mockEstufaRepository.findById.mockResolvedValue(criarEstufaFake({ areaM2: 50 }));
      const dto = criarCreateCicloCultivoDto({ rendimentoKg: 401 });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    // ── VALIDAÇÃO 6: colhida = true → rendimentoKg > 0 ───────────────────

    it('[VALIDAÇÃO 6 - SUCESSO] deve aceitar colhida = true com rendimentoKg > 0', async () => {
      const dto = criarCreateCicloCultivoDto({ colhida: true, rendimentoKg: 150 });
      mockCicloRepository.create.mockResolvedValue(
        criarCicloCultivoFake({ colhida: true, rendimentoKg: 150 }),
      );

      await expect(service.create(dto)).resolves.not.toThrow();
    });

    it('[VALIDAÇÃO 6 - SUCESSO] deve aceitar colhida = false com rendimentoKg = 0', async () => {
      const dto = criarCreateCicloCultivoDto({ colhida: false, rendimentoKg: 0 });
      mockCicloRepository.create.mockResolvedValue(criarCicloCultivoFake());

      await expect(service.create(dto)).resolves.not.toThrow();
    });

    it('[VALIDAÇÃO 6 - ERRO] deve lançar BadRequestException quando colhida = true mas rendimentoKg = 0', async () => {
      const dto = criarCreateCicloCultivoDto({ colhida: true, rendimentoKg: 0 });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      await expect(service.create(dto)).rejects.toThrow(
        'Um ciclo marcado como colhido deve ter rendimento maior que 0 kg.',
      );
      expect(mockCicloRepository.create).not.toHaveBeenCalled();
    });

    it('[VALIDAÇÃO 6 - ERRO] deve lançar BadRequestException quando colhida = true e rendimentoKg negativo', async () => {
      // A validação de rendimento negativo dispara antes, mas cobrimos o caminho
      const dto = criarCreateCicloCultivoDto({ colhida: true, rendimentoKg: -5 });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    // ── VALIDAÇÃO 7: dataInicio >= dataInauguracao ────────────────────────

    it('[VALIDAÇÃO 7 - SUCESSO] deve aceitar dataInicio igual à dataInauguracao da estufa', async () => {
      // Estufa inaugurada em 2020-01-01
      const dto = criarCreateCicloCultivoDto({ dataInicio: '2020-01-01' });
      mockCicloRepository.create.mockResolvedValue(criarCicloCultivoFake({ dataInicio: '2020-01-01' }));

      await expect(service.create(dto)).resolves.not.toThrow();
    });

    it('[VALIDAÇÃO 7 - SUCESSO] deve aceitar dataInicio posterior à dataInauguracao', async () => {
      // Estufa inaugurada em 2020-01-01, ciclo em 2022-06-15
      const dto = criarCreateCicloCultivoDto({ dataInicio: '2022-06-15' });
      mockCicloRepository.create.mockResolvedValue(criarCicloCultivoFake({ dataInicio: '2022-06-15' }));

      await expect(service.create(dto)).resolves.not.toThrow();
    });

    it('[VALIDAÇÃO 7 - ERRO] deve lançar BadRequestException quando dataInicio é anterior à dataInauguracao', async () => {
      // Estufa inaugurada em 2020-01-01, mas ciclo tenta iniciar em 2019-12-01
      const dto = criarCreateCicloCultivoDto({ dataInicio: '2019-12-01' });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      await expect(service.create(dto)).rejects.toThrow(
        'não pode ser anterior à data de inauguração da estufa',
      );
      expect(mockCicloRepository.create).not.toHaveBeenCalled();
    });

    it('[VALIDAÇÃO 7 - ERRO] exibe as datas corretamente na mensagem de erro', async () => {
      const dto = criarCreateCicloCultivoDto({ dataInicio: '2018-05-01' });
      // Estufa inaugurada em 2020-01-01

      await expect(service.create(dto)).rejects.toThrow('2018-05-01');
      await expect(service.create(dto)).rejects.toThrow('2020-01-01');
    });

    // ── Rendimento negativo ───────────────────────────────────────────────

    it('[VALIDAÇÃO EXTRA - SUCESSO] deve aceitar rendimentoKg = 0 quando não colhido', async () => {
      const dto = criarCreateCicloCultivoDto({ rendimentoKg: 0, colhida: false });
      mockCicloRepository.create.mockResolvedValue(criarCicloCultivoFake());

      await expect(service.create(dto)).resolves.not.toThrow();
    });

    it('[VALIDAÇÃO EXTRA - ERRO] deve lançar BadRequestException quando rendimentoKg é negativo', async () => {
      const dto = criarCreateCicloCultivoDto({ rendimentoKg: -1, colhida: false });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      await expect(service.create(dto)).rejects.toThrow(
        'O rendimento em kg não pode ser negativo.',
      );
    });

    it('deve fazer trim na variedadePlanta antes de persistir', async () => {
      const dto = criarCreateCicloCultivoDto({ variedadePlanta: '  Alface Americana  ' });
      mockCicloRepository.create.mockResolvedValue(criarCicloCultivoFake());

      await service.create(dto);

      expect(mockCicloRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ variedadePlanta: 'Alface Americana' }),
      );
    });
  });

  // ───────────────────────────────────────────
  // update
  // ───────────────────────────────────────────
  describe('update', () => {
    const cicloExistente = criarCicloCultivoFake({
      id: 1,
      estufaId: 1,
      dataInicio: '2020-06-01',
      colhida: false,
      rendimentoKg: 50,
    });

    beforeEach(() => {
      mockCicloRepository.findById.mockResolvedValue(cicloExistente);
      mockEstufaRepository.findById.mockResolvedValue(criarEstufaFake({ areaM2: 100 }));
    });

    it('deve atualizar um ciclo de cultivo com dados válidos', async () => {
      const dto = criarUpdateCicloCultivoDto({ variedadePlanta: 'Espinafre' });
      const cicloAtualizado = { ...cicloExistente, variedadePlanta: 'Espinafre' };
      mockCicloRepository.update.mockResolvedValue(cicloAtualizado);

      const resultado = await service.update(1, dto);

      expect(resultado.variedadePlanta).toBe('Espinafre');
      expect(mockCicloRepository.update).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException quando o ciclo não existe ao atualizar', async () => {
      mockCicloRepository.findById.mockResolvedValue(null);

      await expect(service.update(999, criarUpdateCicloCultivoDto())).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCicloRepository.update).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando a estufa associada não existe', async () => {
      mockEstufaRepository.findById.mockResolvedValue(null);

      await expect(service.update(1, criarUpdateCicloCultivoDto())).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(1, criarUpdateCicloCultivoDto())).rejects.toThrow(
        'Estufa associada ao ciclo não encontrada.',
      );
    });

    it('[VALIDAÇÃO 5 - ERRO] deve lançar BadRequestException quando novo rendimento excede limite na atualização', async () => {
      // areaM2 = 100 → limite = 800 kg
      const dto: UpdateCicloCultivoDto = { rendimentoKg: 850 };

      await expect(service.update(1, dto)).rejects.toThrow(BadRequestException);
      await expect(service.update(1, dto)).rejects.toThrow('excede o limite máximo realista');
    });

    it('[VALIDAÇÃO 6 - ERRO] deve lançar BadRequestException ao marcar como colhido sem rendimento', async () => {
      // cicloExistente tem rendimentoKg = 50, mas vamos testar marcar colhida=true com rendimento zerado
      mockCicloRepository.findById.mockResolvedValue(
        criarCicloCultivoFake({ rendimentoKg: 0, colhida: false }),
      );
      const dto: UpdateCicloCultivoDto = { colhida: true };

      await expect(service.update(1, dto)).rejects.toThrow(BadRequestException);
      await expect(service.update(1, dto)).rejects.toThrow(
        'Um ciclo marcado como colhido deve ter rendimento maior que 0 kg.',
      );
    });

    it('[VALIDAÇÃO 6 - SUCESSO] deve permitir marcar como colhido quando rendimento já existe', async () => {
      // cicloExistente já tem rendimentoKg = 50
      const dto: UpdateCicloCultivoDto = { colhida: true };
      mockCicloRepository.update.mockResolvedValue({ ...cicloExistente, colhida: true });

      await expect(service.update(1, dto)).resolves.not.toThrow();
    });

    it('[VALIDAÇÃO 7 - ERRO] deve lançar BadRequestException ao atualizar dataInicio para antes da inauguração', async () => {
      // Estufa inaugurada em 2020-01-01
      const dto: UpdateCicloCultivoDto = { dataInicio: '2019-01-01' };

      await expect(service.update(1, dto)).rejects.toThrow(BadRequestException);
      await expect(service.update(1, dto)).rejects.toThrow(
        'não pode ser anterior à data de inauguração da estufa',
      );
    });

    it('[VALIDAÇÃO 7 - SUCESSO] deve aceitar nova dataInicio posterior à inauguração', async () => {
      const dto: UpdateCicloCultivoDto = { dataInicio: '2021-03-15' };
      mockCicloRepository.update.mockResolvedValue({
        ...cicloExistente,
        dataInicio: '2021-03-15',
      });

      await expect(service.update(1, dto)).resolves.not.toThrow();
    });

    it('deve usar valores existentes para campos não enviados nas validações', async () => {
      // Não enviar rendimentoKg nem colhida → usar valores do ciclo existente
      const dto: UpdateCicloCultivoDto = { variedadePlanta: 'Cebolinha' };
      mockCicloRepository.update.mockResolvedValue({
        ...cicloExistente,
        variedadePlanta: 'Cebolinha',
      });

      await expect(service.update(1, dto)).resolves.not.toThrow();
      expect(mockCicloRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ variedadePlanta: 'Cebolinha' }),
      );
    });
  });

  // ───────────────────────────────────────────
  // delete
  // ───────────────────────────────────────────
  describe('delete', () => {
    it('deve remover um ciclo existente e retornar mensagem de sucesso', async () => {
      const ciclo = criarCicloCultivoFake({ id: 1, variedadePlanta: 'Alface Crespa' });
      mockCicloRepository.findById.mockResolvedValue(ciclo);
      mockCicloRepository.delete.mockResolvedValue(true);

      const resultado = await service.delete(1);

      expect(resultado.message).toContain('Alface Crespa');
      expect(resultado.message).toContain('1');
      expect(mockCicloRepository.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException ao tentar remover ciclo inexistente', async () => {
      mockCicloRepository.findById.mockResolvedValue(null);

      await expect(service.delete(99)).rejects.toThrow(NotFoundException);
      await expect(service.delete(99)).rejects.toThrow(
        'Ciclo de cultivo com ID 99 não encontrado.',
      );
      expect(mockCicloRepository.delete).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando a deleção falha no repositório', async () => {
      mockCicloRepository.findById.mockResolvedValue(criarCicloCultivoFake());
      mockCicloRepository.delete.mockResolvedValue(false);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
