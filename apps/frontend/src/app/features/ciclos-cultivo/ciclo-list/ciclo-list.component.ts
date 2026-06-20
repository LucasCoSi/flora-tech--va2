import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ICicloCultivo, IEstufa } from '@flora-tech/utils';
import { CicloCultivoService } from '../services/ciclo-cultivo.service';
import { EstufaService } from '../../estufas/services/estufa.service';
import { ToastService } from '../../../core/services/toast.service';
import { ErrorService } from '../../../core/services/error.service';

@Component({
  selector: 'app-ciclo-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Ciclos de Cultivo</h1>
          <p class="text-slate-500 mt-1">Monitore e analise as safras das estufas</p>
        </div>
        <a routerLink="novo" class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-sm shadow-emerald-500/20 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Novo Ciclo
        </a>
      </div>

      @if (isLoading) {
        <div class="flex justify-center p-12">
          <svg class="animate-spin h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
      } @else if (ciclos.length === 0) {
        <div class="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <svg class="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <h3 class="mt-4 text-lg font-medium text-slate-900">Nenhum ciclo encontrado</h3>
          <p class="mt-2 text-sm text-slate-500">Registre os ciclos das suas plantas para obter métricas de rendimento.</p>
        </div>
      } @else {
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Variedade</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Estufa</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Início</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Rendimento</th>
                  <th scope="col" class="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                @for (ciclo of ciclos; track ciclo.id) {
                  <tr class="hover:bg-slate-50 transition-colors group">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="font-medium text-slate-900">{{ ciclo.variedadePlanta }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-slate-500">{{ getEstufaName(ciclo.estufaId) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-slate-500">{{ ciclo.dataInicio | date:'dd/MM/yyyy' }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                            [ngClass]="ciclo.colhida ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'">
                        {{ ciclo.colhida ? 'Colhida' : 'Em Andamento' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {{ ciclo.rendimentoKg ? (ciclo.rendimentoKg + ' kg') : '-' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a [routerLink]="['editar', ciclo.id]" class="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded-lg transition-colors">Editar</a>
                        <button (click)="delete(ciclo.id)" class="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg transition-colors">Excluir</button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `
})
export class CicloListComponent implements OnInit {
  private cicloService = inject(CicloCultivoService);
  private estufaService = inject(EstufaService);
  private toast = inject(ToastService);
  private errorService = inject(ErrorService);

  ciclos: ICicloCultivo[] = [];
  estufasMap = new Map<number, string>();
  isLoading = true;

  ngOnInit() {
    // Load estufas first to map IDs to names
    this.estufaService.findAll().subscribe({
      next: (estufas) => {
        estufas.forEach(e => this.estufasMap.set(e.id, e.nome));
        this.loadCiclos();
      },
      error: () => this.loadCiclos() // fallback
    });
  }

  loadCiclos() {
    this.isLoading = true;
    this.cicloService.findAll().subscribe({
      next: (data) => {
        this.ciclos = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.toast.error(this.errorService.extractMessage(err));
        this.isLoading = false;
      }
    });
  }

  getEstufaName(id: number): string {
    return this.estufasMap.get(id) || `Estufa #${id}`;
  }

  delete(id: number) {
    if (confirm('Excluir este ciclo de cultivo?')) {
      this.cicloService.delete(id).subscribe({
        next: () => {
          this.toast.success('Ciclo excluído.');
          this.loadCiclos();
        },
        error: (err: any) => {
          this.toast.error(this.errorService.extractMessage(err));
        }
      });
    }
  }
}
