import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  IsPositive,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateEstufaDto {
  @ApiProperty({
    description: 'Nome identificador da estufa hidropônica',
    example: 'Estufa A-1',
    maxLength: 100,
  })
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome da estufa é obrigatório.' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
  nome: string;

  @ApiProperty({
    description: 'Data de início das operações da estufa (formato ISO 8601)',
    example: '2024-01-15',
  })
  @IsDateString({}, { message: 'A data de inauguração deve estar no formato de data válido (YYYY-MM-DD).' })
  @IsNotEmpty({ message: 'A data de inauguração é obrigatória.' })
  dataInauguracao: string;

  @ApiProperty({
    description: 'Indica se a estufa está em operação (true) ou desativada (false)',
    example: true,
  })
  @IsBoolean({ message: 'O campo "ativa" deve ser um valor booleano.' })
  ativa: boolean;

  @ApiProperty({
    description: 'Área total da estufa em metros quadrados (mínimo 20 m²)',
    example: 150.5,
    minimum: 20,
  })
  @IsNumber({}, { message: 'A área em m² deve ser um número.' })
  @IsPositive({ message: 'A área em m² deve ser um valor positivo.' })
  @Min(20, { message: 'A área deve ser de pelo menos 20 m².' })
  @Transform(({ value }) => parseFloat(value))
  areaM2: number;
}

export class UpdateEstufaDto {
  @ApiPropertyOptional({
    description: 'Nome identificador da estufa hidropônica',
    example: 'Estufa B-2',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
  nome?: string;

  @ApiPropertyOptional({
    description: 'Data de início das operações da estufa (formato ISO 8601)',
    example: '2024-03-20',
  })
  @IsOptional()
  @IsDateString({}, { message: 'A data de inauguração deve estar no formato de data válido (YYYY-MM-DD).' })
  dataInauguracao?: string;

  @ApiPropertyOptional({
    description: 'Indica se a estufa está em operação (true) ou desativada (false)',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'O campo "ativa" deve ser um valor booleano.' })
  ativa?: boolean;

  @ApiPropertyOptional({
    description: 'Área total da estufa em metros quadrados (mínimo 20 m²)',
    example: 200.0,
    minimum: 20,
  })
  @IsOptional()
  @IsNumber({}, { message: 'A área em m² deve ser um número.' })
  @IsPositive({ message: 'A área em m² deve ser um valor positivo.' })
  @Min(20, { message: 'A área deve ser de pelo menos 20 m².' })
  @Transform(({ value }) => parseFloat(value))
  areaM2?: number;
}

export class EstufaResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Estufa A-1' })
  nome: string;

  @ApiProperty({ example: '2024-01-15' })
  dataInauguracao: string;

  @ApiProperty({ example: true })
  ativa: boolean;

  @ApiProperty({ example: 150.5 })
  areaM2: number;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  updatedAt: Date;
}
