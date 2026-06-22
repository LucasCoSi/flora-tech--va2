import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IEstufa } from '@flora-tech/utils';
import { EstufaService } from '../services/estufa.service';
import { ToastService } from '../../../core/services/toast.service';
import { ErrorService } from '../../../core/services/error.service';

@Component({
  selector: 'app-estufa-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Estufas</h1>
          <p class="text-slate-500 mt-1">Gerencie suas unidades hidroponicas</p>
        </div>
        <a routerLink="nova" class="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-xl shadow-sm shadow-green-500/20 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Nova Estufa
        </a>
      </div>

      @if (isLoading) {
        <div class="flex justify-center p-12">
          <svg class="animate-spin h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
      } @else if (estufas.length === 0) {
        <div class="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <h3 class="mt-4 text-lg font-medium text-slate-900">Nenhuma estufa encontrada</h3>
          <p class="mt-2 text-sm text-slate-500">Comece adicionando sua primeira estufa ao sistema.</p>
          <div class="mt-6">
            <a routerLink="nova" class="inline-flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              Adicionar Estufa
            </a>
          </div>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (estufa of estufas; track estufa.id) {
            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-green-300 transition-all group flex flex-col">
              <div class="p-6 flex-1">
                <div class="flex items-start justify-between mb-4">
                  <div class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" [ngClass]="estufa.ativa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ estufa.ativa ? 'Ativa' : 'Inativa' }}
                  </div>
                  <div class="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a [routerLink]="['editar', estufa.id]" class="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50" title="Editar">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </a>
                    <button (click)="openDeleteModal(estufa)" class="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50" title="Excluir">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>

                <h3 class="text-xl font-bold text-slate-900 mb-1 line-clamp-1" [title]="estufa.nome">{{ estufa.nome }}</h3>
                <p class="text-sm text-slate-500 mb-4">{{ estufa.areaM2 }} m2</p>
                <p class="text-xs text-slate-400">Inaugurada em {{ estufa.dataInauguracao | date:'dd/MM/yyyy':'UTC' }}</p>
              </div>
            </div>
          }
        </div>
      }

      @if (deleteTarget) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h2 class="text-lg font-bold text-slate-900">Excluir estufa?</h2>
            <p class="mt-2 text-sm text-slate-600">
              Esta acao removera "{{ deleteTarget.nome }}" do sistema. A operacao nao pode ser desfeita.
            </p>
            <div class="mt-6 flex justify-end gap-3">
              <button type="button" (click)="closeDeleteModal()" class="px-4 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Cancelar
              </button>
              <button type="button" (click)="confirmDelete()" [disabled]="isDeleting" class="px-4 py-2 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
                {{ isDeleting ? 'Excluindo...' : 'Excluir' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class EstufaListComponent implements OnInit {
  private estufaService = inject(EstufaService);
  private toast = inject(ToastService);
  private errorService = inject(ErrorService);

  estufas: IEstufa[] = [];
  isLoading = true;
  isDeleting = false;
  deleteTarget: IEstufa | null = null;

  ngOnInit() {
    this.loadEstufas();
  }

  loadEstufas() {
    this.isLoading = true;
    this.estufaService.findAll().subscribe({
      next: (data) => {
        this.estufas = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.toast.error(this.errorService.extractMessage(err));
        this.isLoading = false;
      }
    });
  }

  openDeleteModal(estufa: IEstufa) {
    this.deleteTarget = estufa;
  }

  closeDeleteModal() {
    if (!this.isDeleting) {
      this.deleteTarget = null;
    }
  }

  confirmDelete() {
    if (!this.deleteTarget) return;

    this.isDeleting = true;
    this.estufaService.delete(this.deleteTarget.id).subscribe({
      next: () => {
        this.toast.success('Estufa excluida com sucesso.');
        this.isDeleting = false;
        this.deleteTarget = null;
        this.loadEstufas();
      },
      error: (err: any) => {
        this.isDeleting = false;
        this.toast.error(this.errorService.extractMessage(err));
      }
    });
  }
}
