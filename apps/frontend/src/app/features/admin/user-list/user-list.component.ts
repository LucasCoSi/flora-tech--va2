import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUser } from '@flora-tech/utils';
import { UserService } from '../services/user.service';
import { ToastService } from '../../../core/services/toast.service';
import { ErrorService } from '../../../core/services/error.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="border-b border-slate-200 pb-4">
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Gestão de Usuários</h1>
        <p class="text-slate-500 mt-1">Aprove novos cadastros e gerencie acessos ao sistema.</p>
      </div>

      @if (isLoading) {
        <div class="flex justify-center p-12">
          <svg class="animate-spin h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (user of users; track user.id) {
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden"
                 [ngClass]="{'border-amber-200 bg-amber-50/30': !user.ativo}">
              
              <div class="absolute top-0 right-0 pt-4 pr-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                      [ngClass]="user.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ user.ativo ? 'Ativo' : 'Bloqueado (Pendente)' }}
                </span>
              </div>

              <div class="flex items-center gap-4 mb-4">
                <div class="h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg"
                     [ngClass]="user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'">
                  {{ user.nome.charAt(0) | uppercase }}
                </div>
                <div>
                  <h3 class="text-lg font-bold text-slate-900">{{ user.nome }}</h3>
                  <p class="text-sm text-slate-500">{{ user.email }}</p>
                </div>
              </div>

              <div class="text-sm text-slate-600 mb-6">
                <span class="block mb-1"><strong>Papel:</strong> {{ user.role === 'admin' ? 'Administrador' : 'Usuário Padrão' }}</span>
                <span class="block"><strong>Criado em:</strong> {{ user.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
              </div>

              <!-- Não permitir que o admin altere a si mesmo -->
              @if (user.id !== currentUserId) {
                <div class="flex gap-2">
                  @if (!user.ativo) {
                    <button (click)="toggleActivation(user.id, true)" class="flex-1 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-medium rounded-lg text-sm transition-colors border border-green-200">
                      Aprovar Acesso
                    </button>
                  } @else {
                    <button (click)="toggleActivation(user.id, false)" class="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg text-sm transition-colors border border-red-200">
                      Bloquear
                    </button>
                  }
                </div>
              } @else {
                <div class="text-center py-2 bg-slate-50 text-slate-500 font-medium rounded-lg text-sm border border-slate-200">
                  Sua Conta
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private errorService = inject(ErrorService);

  users: IUser[] = [];
  isLoading = true;
  currentUserId?: number;

  ngOnInit() {
    this.currentUserId = this.authService.user()?.id;
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.findAll().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.toast.error(this.errorService.extractMessage(err));
        this.isLoading = false;
      }
    });
  }

  toggleActivation(id: number, ativo: boolean) {
    this.userService.activate(id, ativo).subscribe({
      next: () => {
        this.toast.success(`Acesso ${ativo ? 'aprovado' : 'bloqueado'} com sucesso.`);
        this.loadUsers();
      },
      error: (err) => {
        this.toast.error(this.errorService.extractMessage(err));
      }
    });
  }
}
