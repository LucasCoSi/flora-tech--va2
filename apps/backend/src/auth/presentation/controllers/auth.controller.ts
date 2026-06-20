import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../../application/auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Cadastro de novo usuário',
    description: 'Cria uma nova conta de usuário. A conta criada aguarda ativação pelo administrador.',
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso aguardando ativação.' })
  @ApiResponse({ status: 400, description: 'Dados de cadastro inválidos.' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado.' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login de usuário',
    description: 'Autentica o usuário com e-mail e senha, retornando o token JWT. Apenas contas ativas podem fazer login.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso. Retorna o token JWT.' })
  @ApiResponse({ status: 401, description: 'E-mail ou senha incorretos.' })
  @ApiResponse({ status: 403, description: 'Conta não ativada.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
