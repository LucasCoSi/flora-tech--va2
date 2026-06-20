import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CicloCultivoService } from '../../application/ciclo-cultivo.service';
import {
  CicloCultivoResponseDto,
  CreateCicloCultivoDto,
  UpdateCicloCultivoDto,
} from '../dtos/ciclo-cultivo.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';

/**
 * CONTROLLER (Camada de Apresentação) - Recebe requisições HTTP de CicloCultivo.
 * Sem lógica de negócio. Delega tudo ao CicloCultivoService.
 */
@ApiTags('ciclos-cultivo')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ciclos-cultivo')
export class CicloCultivoController {
  constructor(private readonly cicloCultivoService: CicloCultivoService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos os ciclos de cultivo',
    description: 'Retorna todos os ciclos de cultivo cadastrados no sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ciclos de cultivo retornada com sucesso.',
    type: [CicloCultivoResponseDto],
  })
  async findAll() {
    return this.cicloCultivoService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar ciclo de cultivo por ID',
    description: 'Retorna os dados de um ciclo de cultivo específico pelo seu ID.',
  })
  @ApiParam({ name: 'id', description: 'ID do ciclo de cultivo', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Ciclo de cultivo encontrado.',
    type: CicloCultivoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Ciclo de cultivo não encontrado.' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.cicloCultivoService.findById(id);
  }

  @Get('estufa/:estufaId')
  @ApiOperation({
    summary: 'Listar ciclos de cultivo por estufa',
    description: 'Retorna todos os ciclos de cultivo vinculados a uma estufa específica.',
  })
  @ApiParam({ name: 'estufaId', description: 'ID da estufa', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Ciclos de cultivo da estufa retornados com sucesso.',
    type: [CicloCultivoResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Estufa não encontrada.' })
  async findByEstufaId(@Param('estufaId', ParseIntPipe) estufaId: number) {
    return this.cicloCultivoService.findByEstufaId(estufaId);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar novo ciclo de cultivo',
    description: `Cria um novo ciclo de cultivo em uma estufa ativa. 
    Validações: estufa deve existir e estar ativa, rendimento não pode exceder areaM2×8, 
    se colhida=true o rendimento deve ser >0, dataInicio não pode ser anterior à inauguração da estufa.`,
  })
  @ApiBody({ type: CreateCicloCultivoDto })
  @ApiResponse({
    status: 201,
    description: 'Ciclo de cultivo criado com sucesso.',
    type: CicloCultivoResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou regras de negócio violadas.' })
  @ApiResponse({ status: 404, description: 'Estufa não encontrada ou inativa.' })
  async create(@Body() dto: CreateCicloCultivoDto) {
    return this.cicloCultivoService.create(dto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar ciclo de cultivo',
    description: 'Atualiza os dados de um ciclo de cultivo existente. Campos não enviados não são alterados.',
  })
  @ApiParam({ name: 'id', description: 'ID do ciclo de cultivo', type: Number })
  @ApiBody({ type: UpdateCicloCultivoDto })
  @ApiResponse({
    status: 200,
    description: 'Ciclo de cultivo atualizado com sucesso.',
    type: CicloCultivoResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Ciclo de cultivo não encontrado.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou regras de negócio violadas.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCicloCultivoDto,
  ) {
    return this.cicloCultivoService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remover ciclo de cultivo',
    description: 'Remove um ciclo de cultivo do sistema pelo seu ID.',
  })
  @ApiParam({ name: 'id', description: 'ID do ciclo de cultivo', type: Number })
  @ApiResponse({ status: 200, description: 'Ciclo de cultivo removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Ciclo de cultivo não encontrado.' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.cicloCultivoService.delete(id);
  }
}
