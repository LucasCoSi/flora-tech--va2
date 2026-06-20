import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CicloCultivoService } from '../services/ciclo-cultivo.service';
import { EstufaService } from '../../estufas/services/estufa.service';
import { ToastService } from '../../../core/services/toast.service';
import { ErrorService } from '../../../core/services/error.service';
import { IEstufa } from '@flora-tech/utils';

@Component({
  selector: 'app-ciclo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center gap-4 mb-6">
        <a routerLink="/ciclos" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </a>
        <div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">{{ isEdit ? 'Editar Ciclo' : 'Novo Ciclo' }}</h1>
          <p class="text-slate-500 mt-1">Informe os dados da safra</p>
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
            <label class="block text-sm font-medium text-slate-700 ml-1">Variedade da Planta *</label>
            <input type="text" formControlName="variedadePlanta" class="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors" placeholder="Ex: Alface Crespa">
            @if (fieldErrors['variedadePlanta']?.[0]) {
              <p class="text-red-500 text-xs mt-1 ml-1">{{ fieldErrors['variedadePlanta'][0] }}</p>
            } @else if (form.get('variedadePlanta')?.touched && form.get('variedadePlanta')?.invalid) {
              <p class="text-red-500 text-xs mt-1 ml-1">Variedade e obrigatoria.</p>
            }
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-slate-700 ml-1">Data de Inicio *</label>
              <input type="date" formControlName="dataInicio" class="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
              @if (fieldErrors['dataInicio']?.[0]) {
                <p class="text-red-500 text-xs mt-1 ml-1">{{ fieldErrors['dataInicio'][0] }}</p>
              } @else if (form.get('dataInicio')?.touched && form.get('dataInicio')?.invalid) {
                <p class="text-red-500 text-xs mt-1 ml-1">Data obrigatoria ou invalida.</p>
              }
            </div>

            <div class="space-y-1">
              <label class="block text-sm font-medium text-slate-700 ml-1">Estufa Associada *</label>
              <select formControlName="estufaId" class="block w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors">
                <option value="" disabled>Selecione uma estufa</option>
                @for (estufa of estufas; track estufa.id) {
                  <option [value]="estufa.id">{{ estufa.nome }} ({{ estufa.ativa ? 'Ativa' : 'Inativa' }})</option>
                }
              </select>
              @if (fieldErrors['estufaId']?.[0]) {
                <p class="text-red-500 text-xs mt-1 ml-1">{{ fieldErrors['estufaId'][0] }}</p>
              } @else if (form.get('estufaId')?.touched && form.get('estufaId')?.invalid) {
                <p class="text-red-500 text-xs mt-1 ml-1">Selecione uma estufa.</p>
              }
            </div>
          </div>

          <div class="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 mt-6">
            <div class="relative flex items-start">
              <div class="flex h-6 items-center">
                <input id="colhida" formControlName="colhida" type="checkbox" class="h-5 w-5 rounded border-slate-300 text-amber-600 focus:ring-amber-600">
              </div>
              <div class="ml-3 text-sm leading-6">
                <label for="colhida" class="font-medium text-slate-900">Safra Colhida</label>
                <p class="text-slate-500">Marque se a colheita ja foi finalizada para este ciclo.</p>
              </div>
            </div>
          </div>

          @if (form.get('colhida')?.value) {
            <div class="space-y-1 mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <label class="block text-sm font-medium text-amber-900 ml-1">Rendimento Final (kg) *</label>
              <div class="relative">
                <input type="number" step="0.1" min="0" formControlName="rendimentoKg" class="block w-full pl-4 pr-12 py-3 border border-amber-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors">
                <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span class="text-amber-600 sm:text-sm">kg</span>
                </div>
              </div>
              @if (fieldErrors['rendimentoKg']?.[0]) {
                <p class="text-red-500 text-xs mt-1 ml-1">{{ fieldErrors['rendimentoKg'][0] }}</p>
              } @else if (form.get('rendimentoKg')?.touched && form.get('rendimentoKg')?.invalid) {
                <p class="text-red-500 text-xs mt-1 ml-1">Informe um rendimento valido.</p>
              }
            </div>
          }

          <div class="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <a routerLink="/ciclos" class="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors">
              Cancelar
            </a>
            <button type="submit" [disabled]="form.invalid || isLoading" class="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors shadow-sm shadow-emerald-500/30">
              {{ isLoading ? 'Salvando...' : 'Salvar Ciclo' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class CicloFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cicloService = inject(CicloCultivoService);
  private estufaService = inject(EstufaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private errorService = inject(ErrorService);

  estufas: IEstufa[] = [];

  form = this.fb.nonNullable.group({
    variedadePlanta: ['', Validators.required],
    dataInicio: ['', Validators.required],
    estufaId: ['', Validators.required],
    colhida: [false],
    rendimentoKg: [0, [Validators.min(0)]]
  });

  isEdit = false;
  cicloId?: number;
  isLoading = false;
  apiMessage = '';
  fieldErrors: Record<string, string[]> = {};

  ngOnInit() {
    this.estufaService.findAll().subscribe(e => this.estufas = e);

    this.form.get('colhida')?.valueChanges.subscribe(colhida => {
      const rendimentoCtrl = this.form.get('rendimentoKg');
      if (colhida) {
        rendimentoCtrl?.setValidators([Validators.required, Validators.min(0.1)]);
      } else {
        rendimentoCtrl?.clearValidators();
        rendimentoCtrl?.setValue(0);
      }
      rendimentoCtrl?.updateValueAndValidity();
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.cicloId = +id;
      this.loadCiclo(this.cicloId);
    }
  }

  loadCiclo(id: number) {
    this.cicloService.findById(id).subscribe({
      next: (data) => {
        const dateStr = new Date(data.dataInicio).toISOString().split('T')[0];
        this.form.patchValue({
          variedadePlanta: data.variedadePlanta,
          dataInicio: dateStr,
          estufaId: String(data.estufaId) as any,
          colhida: data.colhida,
          rendimentoKg: data.rendimentoKg
        });
      },
      error: (err) => {
        this.toast.error(this.errorService.extractMessage(err));
        this.router.navigate(['/ciclos']);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.apiMessage = '';
    this.fieldErrors = {};

    const formData = this.form.getRawValue();
    const payload = {
      ...formData,
      estufaId: Number(formData.estufaId),
      dataInicio: new Date(formData.dataInicio).toISOString()
    };

    if (!payload.colhida) {
      delete (payload as any).rendimentoKg;
    }

    const request = this.isEdit
      ? this.cicloService.update(this.cicloId!, payload)
      : this.cicloService.create(payload);

    request.subscribe({
      next: () => {
        this.toast.success(`Ciclo ${this.isEdit ? 'atualizado' : 'registrado'} com sucesso.`);
        this.router.navigate(['/ciclos']);
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
