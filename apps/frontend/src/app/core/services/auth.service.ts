import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, JwtPayload } from '@flora-tech/utils';

/**
 * Serviço de Autenticação utilizando Signals para gerenciar estado reativo.
 * O Token NÃO é persistido no localStorage para evitar XSS (por requisito).
 * Fica em memória, perdendo a sessão ao recarregar a página.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Estado em memória (Signals)
  private readonly _token = signal<string | null>(null);
  private readonly _user = signal<LoginResponse['user'] | null>(null);

  // Computed properties para os componentes consumirem
  public readonly token = computed(() => this._token());
  public readonly user = computed(() => this._user());
  public readonly isAuthenticated = computed(() => !!this._token());
  public readonly isAdmin = computed(() => this._user()?.role === 'admin');

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Realiza login e armazena o token na memória (signal).
   */
  login(credentials: { email: string; senha: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this._token.set(response.access_token);
        this._user.set(response.user);
      })
    );
  }

  /**
   * Realiza o cadastro do usuário.
   */
  register(data: { nome: string; email: string; senha: string }): Observable<{ message: string; user: any }> {
    return this.http.post<{ message: string; user: any }>(`${this.apiUrl}/register`, data);
  }

  /**
   * Realiza o logout limpando o estado em memória e redirecionando.
   */
  logout(): void {
    this._token.set(null);
    this._user.set(null);
    this.router.navigate(['/login']);
  }
}
