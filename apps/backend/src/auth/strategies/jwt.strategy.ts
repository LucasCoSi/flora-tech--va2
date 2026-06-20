import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JWT Strategy para Passport.
 * Extrai e valida o token JWT do header Authorization: Bearer <token>.
 * Injeta o payload decodificado em req.user.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'flora-tech-default-secret'),
    });
  }

  /**
   * Chamado pelo Passport após validar o token.
   * O retorno é injetado em req.user.
   */
  async validate(payload: { sub: number; email: string; nome: string; role: string }) {
    return {
      id: payload.sub,
      email: payload.email,
      nome: payload.nome,
      role: payload.role,
    };
  }
}
