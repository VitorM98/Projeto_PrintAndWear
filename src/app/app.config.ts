import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core'; // Adicionado LOCALE_ID
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 
import { registerLocaleData } from '@angular/common'; // Adicionado
import localePt from '@angular/common/locales/pt'; // Adicionado

import { routes } from './app.routes';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(), 
    
    { provide: LOCALE_ID, useValue: 'pt' }
  ]
};