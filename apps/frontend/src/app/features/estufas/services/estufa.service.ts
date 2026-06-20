import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEstufa } from '@flora-tech/utils';
import { environment } from '../../../../environments/environment';

export interface CreateEstufaDto {
  nome: string;
  dataInauguracao: string;
  ativa?: boolean;
  areaM2: number;
}

export interface UpdateEstufaDto extends Partial<CreateEstufaDto> {}

@Injectable({
  providedIn: 'root'
})
export class EstufaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/estufas`;

  findAll(): Observable<IEstufa[]> {
    return this.http.get<IEstufa[]>(this.apiUrl);
  }

  findById(id: number): Observable<IEstufa> {
    return this.http.get<IEstufa>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateEstufaDto): Observable<IEstufa> {
    return this.http.post<IEstufa>(this.apiUrl, data);
  }

  update(id: number, data: UpdateEstufaDto): Observable<IEstufa> {
    return this.http.put<IEstufa>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
