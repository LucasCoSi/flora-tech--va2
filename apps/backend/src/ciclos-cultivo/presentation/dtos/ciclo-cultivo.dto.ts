import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCicloCultivoDto {
  @ApiProperty({
    description: 'Tipo/variedade de planta sendo cultivada neste ciclo',
    example: 'Alface Crespa',
    maxLength: 100,
  })
  @IsString({ message: 'A variedade de planta deve ser uma string.' })
  @IsNotEmpty({ message: 'A variedade de planta é obrigatória.' })
  @MaxLength(100, { message: 'A variedade de planta deve ter no máximo 100 caracteres.' })
  variedadePlanta: string;

  @ApiProperty({
    description: 'Data em que o ciclo de cultivo foi iniciado (formato ISO 8601)',
    example: '2024-02-01',
  })
  @IsDateString({}, { message: 'A data de início deve estar no formato de data válido (YYYY-MM-DD).' })
  @IsNotEmpty({ message: 'A data de início é obrigatória.' })
  dataInicio: string;

  @ApiProperty({
    description: 'Indica se a colheita deste ciclo já foi realizada',
    example: false,
  })
  @IsBoolean({ message: 'O campo "colhida" deve ser um valor booleano.' })
  colhida: boolean;

  @ApiProperty({
    description: 'Rendimento total da colheita em quilogramas (0 se ainda não colhido)',
    example: 0,
    minimum: 0,
  })
  @IsNumber({}, { message: 'O rendimento deve ser um número.' })
  @Min(0, { message: 'O rendimento não pode ser negativo.' })
  @Transform(({ value }) => parseFloat(value))
  rendimentoKg: number;

  @ApiProperty({
    description: 'ID da estufa à qual este ciclo pertence',
    example: 1,
  })
  @IsInt({ message: 'O ID da estufa deve ser um número inteiro.' })
  @IsPositive({ message: 'O ID da estufa deve ser um valor positivo.' })
  @Transform(({ value }) => parseInt(value, 10))
  estufaId: number;
}

export class UpdateCicloCultivoDto {
  @ApiPropertyOptional({
    description: 'Tipo/variedade de planta sendo cultivada neste ciclo',
    example: 'Rúcula',
    maxLength: 100,
  })
  @IsOptional()
  @IsString({ message: 'A variedade de planta deve ser uma string.' })
  @IsNotEmpty({ message: 'A variedade de planta não pode ser vazia.' })
  @MaxLength(100, { message: 'A variedade de planta deve ter no máximo 100 caracteres.' })
  variedadePlanta?: string;

  @ApiPropertyOptional({
    description: 'Data em que o ciclo de cultivo foi iniciado (formato ISO 8601)',
    example: '2024-03-01',
  })
  @IsOptional()
  @IsDateString({}, { message: 'A data de início deve estar no formato de data válido (YYYY-MM-DD).' })
  dataInicio?: string;

  @ApiPropertyOptional({
    description: 'Indica se a colheita deste ciclo já foi realizada',
    example: true,
  })
  @IsOptional()
  @IsBoolean({ message: 'O campo "colhida" deve ser um valor booleano.' })
  colhida?: boolean;

  @ApiPropertyOptional({
    description: 'Rendimento total da colheita em quilogramas',
    example: 120.5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({}, { message: 'O rendimento deve ser um número.' })
  @Min(0, { message: 'O rendimento não pode ser negativo.' })
  @Transform(({ value }) => parseFloat(value))
  rendimentoKg?: number;
}

export class CicloCultivoResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Alface Crespa' })
  variedadePlanta: string;

  @ApiProperty({ example: '2024-02-01' })
  dataInicio: string;

  @ApiProperty({ example: false })
  colhida: boolean;

  @ApiProperty({ example: 0 })
  rendimentoKg: number;

  @ApiProperty({ example: 1 })
  estufaId: number;

  @ApiProperty({ example: '2024-02-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-02-01T10:00:00.000Z' })
  updatedAt: Date;
}
