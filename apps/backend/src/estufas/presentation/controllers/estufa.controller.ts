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
import { EstufaService } from '../../application/estufa.service';
import {
  CreateEstufaDto,
  EstufaResponseDto,
  UpdateEstufaDto,
} from '../dtos/estufa.dto';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';

/**
 * CONTROLLER (Camada de Apresentação) - Recebe requisições HTTP.
 * Sem lógica de negócio. Delega tudo ao EstufaService.
 */
@ApiTags('estufas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('estufas')
export class EstufaController {
  constructor(private readonly estufaService: EstufaService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todas as estufas',
    description: 'Retorna uma lista com todas as estufas cadastradas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de estufas retornada com sucesso.',
    type: [EstufaResponseDto],
  })
  async findAll() {
    return this.estufaService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar estufa por ID',
    description: 'Retorna os dados de uma estufa específica pelo seu ID.',
  })
  @ApiParam({ name: 'id', description: 'ID da estufa', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Estufa encontrada com sucesso.',
    type: EstufaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Estufa não encontrada.' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.estufaService.findById(id);
  }

  @Get(':id/ciclos')
  @ApiOperation({
    summary: 'Buscar estufa com todos os seus ciclos de cultivo',
    description:
      'Retorna os dados da estufa junto com todos os ciclos de cultivo relacionados (1:N com relations do TypeORM).',
  })
  @ApiParam({ name: 'id', description: 'ID da estufa', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Estufa com ciclos retornada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Estufa não encontrada.' })
  async findByIdWithCiclos(@Param('id', ParseIntPipe) id: number) {
    return this.estufaService.findByIdWithCiclos(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Criar nova estufa',
    description:
      'Cria uma nova estufa hidropônica. Valida data de inauguração (não pode ser futura) e área mínima de 20 m².',
  })
  @ApiBody({ type: CreateEstufaDto })
  @ApiResponse({
    status: 201,
    description: 'Estufa criada com sucesso.',
    type: EstufaResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou regras de negócio violadas.' })
  async create(@Body() dto: CreateEstufaDto) {
    return this.estufaService.create(dto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Atualizar estufa',
    description: 'Atualiza os dados de uma estufa existente. Campos não enviados não são alterados.',
  })
  @ApiParam({ name: 'id', description: 'ID da estufa', type: Number })
  @ApiBody({ type: UpdateEstufaDto })
  @ApiResponse({
    status: 200,
    description: 'Estufa atualizada com sucesso.',
    type: EstufaResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Estufa não encontrada.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou regras de negócio violadas.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstufaDto,
  ) {
    return this.estufaService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Remover estufa',
    description: 'Remove uma estufa do sistema pelo seu ID.',
  })
  @ApiParam({ name: 'id', description: 'ID da estufa', type: Number })
  @ApiResponse({ status: 200, description: 'Estufa removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Estufa não encontrada.' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.estufaService.delete(id);
  }
}
