import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

/**
 * GUARD — Permite acesso apenas a usuários com role 'admin'.
 * Deve ser usado junto com JwtAuthGuard (que injeta req.user).
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== 'admin') {
      throw new ForbiddenException(
        'Acesso negado. Esta operação é permitida apenas para administradores.',
      );
    }

    return true;
  }
}
