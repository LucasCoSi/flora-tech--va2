import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EstufaService } from '../services/estufa.service';
import { ToastService } from '../../../core/services/toast.service';
import { ErrorService } from '../../../core/services/error.service';

@Component({
  selector: 'app-estufa-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center gap-4 mb-6">
        <a routerLink="/estufas" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </a>
        <div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">{{ isEdit ? 'Editar Estufa' : 'Nova Estufa' }}</h1>
          <p class="text-slate-500 mt-1">Preencha os dados da unidade de cultivo</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 sm:p-8 space-y-6">
          @if (apiMessage) {
            <div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {{ apiMessage }}
            </div>
          }

          <div class="space-y-1">
            <label class="block text-sm font-medium text-slate-700 ml-1">Nome da Estufa *</label>
            <input type="text" formControlName="nome" class="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" placeholder="Ex: Estufa Principal Norte">
            @if (fieldErrors['nome']?.[0]) {
              <p class="text-red-500 text-xs mt-1 ml-1">{{ fieldErrors['nome'][0] }}</p>
            } @else if (form.get('nome')?.touched && form.get('nome')?.invalid) {
              <p class="text-red-500 text-xs mt-1 ml-1">Nome e obrigatorio.</p>
            }
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-slate-700 ml-1">Data de Inauguracao *</label>
              <input type="date" formControlName="dataInauguracao" class="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors">
              @if (fieldErrors['dataInauguracao']?.[0]) {
                <p class="text-red-500 text-xs mt-1 ml-1">{{ fieldErrors['dataInauguracao'][0] }}</p>
              } @else if (form.get('dataInauguracao')?.touched && form.get('dataInauguracao')?.invalid) {
                <p class="text-red-500 text-xs mt-1 ml-1">Data obrigatoria ou invalida.</p>
              }
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-slate-700 ml-1">Area (m2) *</label>
              <div class="relative">
                <input type="number" step="0.01" min="0" formControlName="areaM2" class="block w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors" placeholder="0.00">
                <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span class="text-slate-400 sm:text-sm">m2</span>
                </div>
              </div>
              @if (fieldErrors['areaM2']?.[0]) {
                <p class="text-red-500 text-xs mt-1 ml-1">{{ fieldErrors['areaM2'][0] }}</p>
              } @else if (form.get('areaM2')?.touched && form.get('areaM2')?.invalid) {
                <p class="text-red-500 text-xs mt-1 ml-1">Area deve ser um numero positivo.</p>
              }
            </div>
          </div>

          <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div class="relative flex items-start">
              <div class="flex h-6 items-center">
                <input id="ativa" formControlName="ativa" type="checkbox" class="h-5 w-5 rounded border-slate-300 text-green-600 focus:ring-green-600">
              </div>
              <div class="ml-3 text-sm leading-6">
                <label for="ativa" class="font-medium text-slate-900">Estufa Ativa</label>
                <p class="text-slate-500">Marque se a estufa esta atualmente em operacao.</p>
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <a routerLink="/estufas" class="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors">
              Cancelar
            </a>
            <button type="submit" [disabled]="form.invalid || isLoading" class="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors shadow-sm shadow-green-500/30">
              {{ isLoading ? 'Salvando...' : 'Salvar Estufa' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class EstufaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private estufaService = inject(EstufaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private errorService = inject(ErrorService);

  form = this.fb.nonNullable.group({
    nome: ['', Validators.required],
    dataInauguracao: ['', Validators.required],
    areaM2: [0, [Validators.required, Validators.min(0.01)]],
    ativa: [true]
  });

  isEdit = false;
  estufaId?: number;
  isLoading = false;
  apiMessage = '';
  fieldErrors: Record<string, string[]> = {};

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.estufaId = +id;
      this.loadEstufa(this.estufaId);
    }
  }

  loadEstufa(id: number) {
    this.estufaService.findById(id).subscribe({
      next: (data) => {
        const dateStr = new Date(data.dataInauguracao).toISOString().split('T')[0];
        this.form.patchValue({
          nome: data.nome,
          dataInauguracao: dateStr,
          areaM2: data.areaM2,
          ativa: data.ativa
        });
      },
      error: (err) => {
        this.toast.error(this.errorService.extractMessage(err));
        this.router.navigate(['/estufas']);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.apiMessage = '';
    this.fieldErrors = {};

    const formData = this.form.getRawValue();
    const dataInauguracao = new Date(formData.dataInauguracao).toISOString();
    const payload = { ...formData, dataInauguracao };

    const request = this.isEdit
      ? this.estufaService.update(this.estufaId!, payload)
      : this.estufaService.create(payload);

    request.subscribe({
      next: () => {
        this.toast.success(`Estufa ${this.isEdit ? 'atualizada' : 'criada'} com sucesso.`);
        this.router.navigate(['/estufas']);
      },
      error: (err) => {
        this.isLoading = false;

        const fieldErrors = this.errorService.extractFieldErrors(err);
        if (fieldErrors) {
          this.fieldErrors = fieldErrors;
          this.apiMessage = this.errorService.extractMessage(err);
          return;
        }

        const message = this.errorService.extractMessage(err);
        this.apiMessage = message;
        this.toast.error(message);
      }
    });
  }
}
