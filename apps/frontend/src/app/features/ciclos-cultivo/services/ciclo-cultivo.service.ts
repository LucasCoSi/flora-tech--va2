import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ICicloCultivo } from '@flora-tech/utils';
import { environment } from '../../../../environments/environment';

export interface CreateCicloCultivoDto {
  variedadePlanta: string;
  dataInicio: string;
  estufaId: number;
  colhida?: boolean;
  rendimentoKg?: number;
}

export interface UpdateCicloCultivoDto extends Partial<CreateCicloCultivoDto> {}

@Injectable({
  providedIn: 'root'
})
export class CicloCultivoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ciclos-cultivo`;

  findAll(): Observable<ICicloCultivo[]> {
    return this.http.get<ICicloCultivo[]>(this.apiUrl);
  }

  findById(id: number): Observable<ICicloCultivo> {
    return this.http.get<ICicloCultivo>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateCicloCultivoDto): Observable<ICicloCultivo> {
    return this.http.post<ICicloCultivo>(this.apiUrl, data);
  }

  update(id: number, data: UpdateCicloCultivoDto): Observable<ICicloCultivo> {
    return this.http.put<ICicloCultivo>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
