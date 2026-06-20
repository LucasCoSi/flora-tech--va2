import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { UserService } from '../../application/user.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { UserResponseDto } from '../dtos/user-response.dto';
import { ActivateUserDto } from '../dtos/activate-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar todos os usuários (Admin)',
    description: 'Retorna a lista de todos os usuários cadastrados. Requer privilégios de administrador.',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuários', type: [UserResponseDto] })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado. Requer admin.' })
  async findAll() {
    return this.userService.findAll();
  }

  @Patch(':id/activate')
  @ApiOperation({
    summary: 'Ativar/Desativar usuário (Admin)',
    description: 'Altera o status de ativação de um usuário. Requer privilégios de administrador.',
  })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({ type: ActivateUserDto })
  @ApiResponse({ status: 200, description: 'Status do usuário atualizado.', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado (não é admin ou tentando alterar a si mesmo).' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async activate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActivateUserDto,
    @Request() req,
  ) {
    return this.userService.activate(id, dto, req.user.id);
  }
}
