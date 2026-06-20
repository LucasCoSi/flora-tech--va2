import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '@flora-tech/utils';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  findAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(this.apiUrl);
  }

  activate(id: number, ativo: boolean): Observable<IUser> {
    return this.http.patch<IUser>(`${this.apiUrl}/${id}/activate`, { ativo });
  }
}
