import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  IUserRepository,
  USER_REPOSITORY,
} from './ports/user-repository.port';
import { RegisterDto } from '../presentation/dtos/register.dto';
import { LoginDto } from '../presentation/dtos/login.dto';

/**
 * SERVICE (Camada de Aplicação) — Autenticação.
 * Responsável por registro, login e geração de JWT.
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * POST /auth/register — Cadastro de novo usuário.
   * Cria com ativo = false (aguarda liberação do admin).
   */
  async register(dto: RegisterDto) {
    // Verificar se email já existe
    const existente = await this.userRepository.findByEmail(dto.email);
    if (existente) {
      throw new ConflictException(
        'Já existe um usuário cadastrado com este e-mail. Faça login ou utilize outro e-mail.',
      );
    }

    // Hash da senha com bcrypt
    const senhaHash = await bcrypt.hash(dto.senha, 10);

    const novoUsuario = await this.userRepository.create({
      nome: dto.nome.trim(),
      email: dto.email.toLowerCase().trim(),
      senha: senhaHash,
      ativo: false,
      role: 'user',
    });

    return {
      message: 'Cadastro realizado com sucesso! Sua conta aguarda ativação pelo administrador.',
      user: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
      },
    };
  }

  /**
   * POST /auth/login — Login com email e senha.
   * Retorna JWT com payload { sub, email, nome, role }.
   */
  async login(dto: LoginDto) {
    const mensagemGenérica = 'E-mail ou senha incorretos.';

    // Buscar usuário pelo email
    const usuario = await this.userRepository.findByEmail(
      dto.email.toLowerCase().trim(),
    );

    if (!usuario) {
      throw new UnauthorizedException(mensagemGenérica);
    }

    // Verificar senha com bcrypt
    const senhaValida = await bcrypt.compare(dto.senha, usuario.senha);
    if (!senhaValida) {
      throw new UnauthorizedException(mensagemGenérica);
    }

    // Verificar se está ativo
    if (!usuario.ativo) {
      throw new ForbiddenException(
        'Sua conta ainda não foi ativada pelo administrador. Aguarde a liberação.',
      );
    }

    // Gerar JWT
    const payload = {
      sub: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      role: usuario.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    };
  }
}
