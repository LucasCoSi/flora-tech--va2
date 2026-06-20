import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  /**
   * Extrai a mensagem de erro formatada vinda do backend ou de falhas de rede.
   */
  extractMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
      }
      if (error.error && error.error.message) {
        return error.error.message;
      }
      return `Erro no servidor: ${error.status}`;
    }
    return error.message || 'Ocorreu um erro inesperado.';
  }

  /**
   * Extrai os erros por campo (ex: falhas de validação de formulários do NestJS).
   */
  extractFieldErrors(error: any): Record<string, string[]> | null {
    if (error instanceof HttpErrorResponse && error.error && error.error.errors) {
      return error.error.errors;
    }
    return null;
  }
}
