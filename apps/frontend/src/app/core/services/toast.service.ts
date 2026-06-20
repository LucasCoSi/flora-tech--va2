import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  id?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new Subject<ToastMessage>();
  toasts$ = this.toastsSubject.asObservable();

  show(toast: ToastMessage) {
    const id = Math.random().toString(36).substring(2, 9);
    this.toastsSubject.next({ ...toast, id, duration: toast.duration || 5000 });
  }

  success(message: string, title?: string) {
    this.show({ type: 'success', message, title });
  }

  error(message: string, title?: string) {
    this.show({ type: 'error', message, title });
  }

  info(message: string, title?: string) {
    this.show({ type: 'info', message, title });
  }

  warning(message: string, title?: string) {
    this.show({ type: 'warning', message, title });
  }
}
