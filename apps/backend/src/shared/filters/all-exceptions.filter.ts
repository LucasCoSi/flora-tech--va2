import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * FILTRO GLOBAL DE EXCEÇÕES (AllExceptionsFilter)
 *
 * Centraliza o tratamento de todas as exceções da aplicação.
 * Registrado globalmente em main.ts via app.useGlobalFilters().
 *
 * Garante uma resposta JSON padronizada para TODOS os erros:
 * {
 *   statusCode: number,
 *   error:      string,   — nome HTTP do status (e.g. "Bad Request")
 *   message:    string | string[],
 *   timestamp:  string,   — ISO 8601
 *   path:       string,   — rota que originou o erro
 * }
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number;
    let message: string;
    let error: string;
    let errors: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as Record<string, unknown>;
        
        // Tratamento especial para erros do ValidationPipe
        if (
          res.errors &&
          typeof res.errors === 'object' &&
          !Array.isArray(res.errors)
        ) {
          message = (res.message as string) ?? 'Erro de validação nos dados enviados.';
          errors = res.errors as Record<string, string[]>;
        } else if (Array.isArray(res.message)) {
          message = 'Erro de validação nos dados enviados.';
          errors = {};
          // O ValidationPipe retorna array de strings "campo de erro".
          // Vamos agrupar as mensagens por campo usando a primeira palavra como chave
          // Ou podemos apenas retornar a lista bruta num array simples (errors: { general: res.message })
          errors['fields'] = res.message as string[];
        } else {
          message = (res.message as string) ?? exception.message;
        }
        
        error = (res.error as string) ?? exception.name;
      } else {
        message = exceptionResponse as string;
        error = exception.name;
      }
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      error = 'Internal Server Error';
      message = 'Erro interno do servidor. Por favor, tente novamente mais tarde.';
      this.logger.error(
        `Exceção não tratada em ${request.method} ${request.url}:`,
        exception,
      );
    }

    const errorResponse = {
      statusCode,
      error,
      message,
      ...(errors && { errors }),
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(statusCode).json(errorResponse);
  }
}
