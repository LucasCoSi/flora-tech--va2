import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  // ── Validação Global de DTOs ────────────────────────────────────────────────
  // Rejeita campos extras (forbidNonWhitelisted) e realiza conversão automática
  // de tipos (transform), complementando as validações de negócio do Service.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = validationErrors.reduce<Record<string, string[]>>(
          (acc, error) => {
            const messages = error.constraints
              ? Object.values(error.constraints)
              : [];

            if (messages.length > 0) {
              acc[error.property] = messages;
            }

            return acc;
          },
          {},
        );

        return new BadRequestException({
          message: 'Erro de validação nos dados enviados.',
          errors,
        });
      },
    }),
  );

  // ── Filtro Global de Exceções ───────────────────────────────────────────────
  // AllExceptionsFilter centraliza TODAS as respostas de erro da API,
  // garantindo formato JSON padronizado: { statusCode, error, message, timestamp, path }
  app.useGlobalFilters(new AllExceptionsFilter());

  // ── Configuração do Swagger ─────────────────────────────────────────────────
  // Documentação automática disponível em http://localhost:3000/api
  const config = new DocumentBuilder()
    .setTitle('FloraTech API')
    .setDescription(
      [
        '## API RESTful para Monitoramento de Estufas Hidropônicas',
        '',
        'Gerencie estufas hidropônicas e seus ciclos de cultivo com:',
        '- **CRUD completo** para ambas as entidades',
        '- **Relacionamento 1:N** (Estufa → CicloCultivo)',
        '- **7+ validações de negócio** com exceções descritivas',
        '- **Arquitetura Hexagonal** (Ports & Adapters)',
        '',
        '> Banco SQLite em `/data/database.sqlite` | `synchronize: true` (uso acadêmico)',
      ].join('\n'),
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticação e Registro')
    .addTag('users', 'Gestão de Usuários (Admin)')
    .addTag('estufas', 'Gerenciamento de Estufas Hidropônicas')
    .addTag('ciclos-cultivo', 'Gerenciamento de Ciclos de Cultivo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: 2,
    },
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  console.log('\n🌱 ================================');
  console.log(`   FloraTech API rodando!`);
  console.log('   ================================');
  console.log(`   🚀 API:     http://localhost:${port}`);
  console.log(`   📚 Swagger: http://localhost:${port}/api`);
  console.log(`   🗄️  DB:      ./data/database.sqlite`);
  console.log('================================\n');
}

bootstrap();
