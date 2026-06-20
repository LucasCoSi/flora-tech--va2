import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      <!-- Navbar (Glassmorphism) -->
      <nav class="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 bg-white/70 border-b border-slate-900/10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center gap-8">
              <a routerLink="/dashboard" class="flex items-center gap-2 group">
                <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                  F
                </div>
                <span class="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-800">
                  FloraTech
                </span>
              </a>
              
              <!-- Desktop Navigation -->
              <div class="hidden md:flex md:space-x-1">
                <a routerLink="/dashboard" routerLinkActive="bg-slate-100 text-green-700" [routerLinkActiveOptions]="{exact: true}" class="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                  Dashboard
                </a>
                <a routerLink="/estufas" routerLinkActive="bg-slate-100 text-green-700" class="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                  Estufas
                </a>
                <a routerLink="/ciclos" routerLinkActive="bg-slate-100 text-green-700" class="px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors">
                  Ciclos de Cultivo
                </a>
                
                @if (authService.isAdmin()) {
                  <a routerLink="/admin/users" routerLinkActive="bg-slate-100 text-green-700" class="px-3 py-2 rounded-md text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors">
                    Admin
                  </a>
                }
              </div>
            </div>

            <!-- User Menu -->
            <div class="flex items-center gap-4">
              <div class="hidden sm:flex flex-col items-end">
                <span class="text-sm font-semibold text-slate-700">{{ authService.user()?.nome }}</span>
                <span class="text-xs text-slate-500">{{ authService.user()?.email }}</span>
              </div>
              <div class="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold border border-slate-300">
                {{ authService.user()?.nome?.charAt(0) | uppercase }}
              </div>
              <button (click)="logout()" class="ml-2 text-slate-400 hover:text-red-500 transition-colors" title="Sair">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content Area -->
      <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 sm:p-8 min-h-[calc(100vh-12rem)]">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class MainLayoutComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
