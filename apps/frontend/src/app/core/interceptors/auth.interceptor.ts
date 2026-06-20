import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/**
 * Interceptor HTTP que anexa o token JWT a todas as requisições,
 * caso o usuário esteja autenticado.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);
  const token = authService.token();

  const authReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && token) {
        authService.clearSession();
        toast.warning('Sua sessão expirou. Faça login novamente.');
        router.navigate(['/login'], {
          queryParams: { sessionExpired: 'true', returnUrl: router.url },
        });
      }

      return throwError(() => error);
    }),
  );
};
