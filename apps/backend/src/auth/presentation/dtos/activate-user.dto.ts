import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class ActivateUserDto {
  @ApiProperty({
    description: 'Define se o usuário deve ser ativado (true) ou desativado (false)',
    example: true,
  })
  @IsBoolean({ message: 'O campo "ativo" deve ser um valor booleano.' })
  ativo: boolean;
}
