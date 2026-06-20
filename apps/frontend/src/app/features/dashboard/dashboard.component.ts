import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl p-8 text-white shadow-xl shadow-green-500/20 relative overflow-hidden">
        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div class="relative z-10">
          <h2 class="text-3xl font-extrabold mb-2">Olá, {{ authService.user()?.nome }}!</h2>
          <p class="text-green-100 text-lg max-w-xl">
            Bem-vindo ao FloraTech. Utilize o menu superior para gerenciar suas estufas hidropônicas e monitorar seus ciclos de cultivo de forma eficiente.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <!-- Quick Action 1 -->
        <a routerLink="/estufas" class="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-green-400 hover:shadow-lg transition-all">
          <div class="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-2">Minhas Estufas</h3>
          <p class="text-slate-500">Visualize e gerencie as estufas cadastradas no sistema.</p>
        </a>

        <!-- Quick Action 2 -->
        <a routerLink="/ciclos" class="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all">
          <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 class="text-xl font-bold text-slate-800 mb-2">Ciclos de Cultivo</h3>
          <p class="text-slate-500">Acompanhe o rendimento e ciclo de vida de suas plantas.</p>
        </a>

        <!-- Quick Action 3 -->
        @if (authService.isAdmin()) {
          <a routerLink="/admin/users" class="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all">
            <div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <h3 class="text-xl font-bold text-slate-800 mb-2">Gestão de Usuários</h3>
            <p class="text-slate-500">Aprove ou bloqueie usuários cadastrados no sistema.</p>
          </a>
        }
      </div>
    </div>
  `
})
export class DashboardComponent {
  authService = inject(AuthService);
}
