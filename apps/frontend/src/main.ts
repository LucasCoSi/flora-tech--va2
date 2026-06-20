import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

console.log('Bootstrapping Angular...');

bootstrapApplication(AppComponent, appConfig)
  .then(() => console.log('Angular Bootstrapped Successfully!'))
  .catch((err) => {
    console.error('Angular Bootstrap Error:', err);
    alert('Erro ao inicializar o Angular: ' + err.message);
  });
