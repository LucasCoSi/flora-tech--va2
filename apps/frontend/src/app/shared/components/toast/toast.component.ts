import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      @for (toast of toasts; track toast.id) {
        <div 
          class="flex items-center w-full max-w-xs p-4 rounded-xl shadow-lg transform transition-all duration-300 backdrop-blur-md"
          [ngClass]="{
            'bg-green-50/90 text-green-800 border border-green-200': toast.type === 'success',
            'bg-red-50/90 text-red-800 border border-red-200': toast.type === 'error',
            'bg-blue-50/90 text-blue-800 border border-blue-200': toast.type === 'info',
            'bg-yellow-50/90 text-yellow-800 border border-yellow-200': toast.type === 'warning'
          }"
          role="alert"
        >
          <!-- Icons -->
          <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg"
               [ngClass]="{
                 'text-green-500 bg-green-100': toast.type === 'success',
                 'text-red-500 bg-red-100': toast.type === 'error',
                 'text-blue-500 bg-blue-100': toast.type === 'info',
                 'text-yellow-500 bg-yellow-100': toast.type === 'warning'
               }">
            @if (toast.type === 'success') {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            } @else if (toast.type === 'error') {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            } @else if (toast.type === 'warning') {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            } @else {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            }
          </div>
          
          <div class="ml-3 text-sm font-medium">
            @if (toast.title) {
              <span class="block font-bold mb-0.5">{{ toast.title }}</span>
            }
            <span class="block opacity-90">{{ toast.message }}</span>
          </div>
          
          <button type="button" (click)="remove(toast.id!)" class="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 hover:bg-black/5">
            <span class="sr-only">Close</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent implements OnInit {
  toasts: ToastMessage[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toasts$.subscribe(toast => {
      this.toasts.push(toast);
      setTimeout(() => this.remove(toast.id!), toast.duration);
    });
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
