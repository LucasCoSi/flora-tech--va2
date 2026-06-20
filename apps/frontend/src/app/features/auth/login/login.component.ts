import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ErrorService } from '../../../core/services/error.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div class="relative w-full max-w-md">
        <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
          <div class="px-8 pt-12 pb-8">
            <div class="text-center mb-8">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/40 mb-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <span class="text-3xl font-bold">F</span>
              </div>
              <h2 class="text-3xl font-bold text-slate-800 tracking-tight">Bem-vindo</h2>
              <p class="text-slate-500 mt-2">Faca login para gerenciar suas estufas</p>
            </div>

            @if (notice) {
              <div class="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                {{ notice }}
              </div>
            }

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <div class="space-y-1">
                <label class="block text-sm font-medium text-slate-700 ml-1">E-mail</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <input type="email" formControlName="email" class="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-colors" placeholder="seu@email.com">
                </div>
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-medium text-slate-700 ml-1">Senha</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                  <input type="password" formControlName="senha" class="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-colors" placeholder="********">
                </div>
              </div>

              <div class="flex items-center justify-end">
                <button type="button" (click)="showRecoveryInfo()" class="text-sm font-semibold text-green-600 hover:text-green-500 transition-colors">
                  Recuperar senha
                </button>
              </div>

              <button type="submit" [disabled]="loginForm.invalid || isLoading" class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-green-500/30">
                @if (isLoading) {
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Entrando...
                } @else {
                  Entrar
                }
              </button>
            </form>
            
            <div class="mt-8 text-center text-sm text-slate-500">
              Nao tem uma conta?
              <a routerLink="/register" class="font-semibold text-green-600 hover:text-green-500 transition-colors">
                Criar conta
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private errorService = inject(ErrorService);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required]]
  });

  isLoading = false;
  notice = '';

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    if (params.get('sessionExpired') === 'true') {
      this.notice = 'Sua sessao expirou. Faca login novamente para continuar.';
    } else if (params.get('returnUrl')) {
      this.notice = 'Entre com sua conta para acessar a pagina solicitada.';
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.toast.success('Bem-vindo de volta!');
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigateByUrl(returnUrl || '/dashboard');
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(this.errorService.extractMessage(err));
      }
    });
  }

  showRecoveryInfo() {
    this.toast.info('Procure o administrador do sistema para recuperar seu acesso.');
  }
}
