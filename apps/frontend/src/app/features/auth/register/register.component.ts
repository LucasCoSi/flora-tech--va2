import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ErrorService } from '../../../core/services/error.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div class="relative w-full max-w-md">
        <div class="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
          <div class="px-8 pt-10 pb-8">
            <div class="text-center mb-8">
              <h2 class="text-3xl font-bold text-slate-800 tracking-tight">Criar Conta</h2>
              <p class="text-slate-500 mt-2">Junte-se ao FloraTech</p>
            </div>

            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
              
              <div class="space-y-1">
                <label class="block text-sm font-medium text-slate-700 ml-1">Nome Completo</label>
                <input 
                  type="text" 
                  formControlName="nome"
                  class="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="João da Silva"
                >
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-medium text-slate-700 ml-1">E-mail</label>
                <input 
                  type="email" 
                  formControlName="email"
                  class="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="seu@email.com"
                >
              </div>

              <div class="space-y-1">
                <label class="block text-sm font-medium text-slate-700 ml-1">Senha</label>
                <input 
                  type="password" 
                  formControlName="senha"
                  class="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-white/50 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Mínimo 6 caracteres"
                >
              </div>

              <button 
                type="submit" 
                [disabled]="registerForm.invalid || isLoading"
                class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all"
              >
                {{ isLoading ? 'Cadastrando...' : 'Cadastrar' }}
              </button>
            </form>
            
            <div class="mt-8 text-center text-sm text-slate-500">
              Já tem uma conta? 
              <a routerLink="/login" class="font-semibold text-green-600 hover:text-green-500 transition-colors">
                Faça login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private errorService = inject(ErrorService);

  registerForm = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: (res) => {
        this.toast.success(res.message, 'Cadastro efetuado!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.error(this.errorService.extractMessage(err));
      }
    });
  }
}
