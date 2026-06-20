import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IUserRepository,
  USER_REPOSITORY,
} from './ports/user-repository.port';
import { UserWithoutPassword } from '../domain/user.domain';
import { ActivateUserDto } from '../presentation/dtos/activate-user.dto';

/**
 * SERVICE (Camada de Aplicação) — Gestão de Usuários (admin).
 * Listagem e ativação/desativação de contas.
 */
@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * GET /users — Lista todos os usuários (somente admin).
   */
  async findAll(): Promise<UserWithoutPassword[]> {
    return this.userRepository.findAll();
  }

  /**
   * PATCH /users/:id/activate — Ativa ou desativa um usuário (somente admin).
   */
  async activate(id: number, dto: ActivateUserDto, adminId: number): Promise<UserWithoutPassword> {
    if (id === adminId) {
      throw new ForbiddenException('Você não pode alterar o status da sua própria conta.');
    }

    const usuario = await this.userRepository.findById(id);
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    const atualizado = await this.userRepository.update(id, { ativo: dto.ativo });
    if (!atualizado) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    const statusStr = dto.ativo ? 'ativado' : 'desativado';
    return atualizado;
  }
}
