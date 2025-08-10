import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withViewTransitions} from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {addTokenInterceptor} from './core/interceptors/add-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withViewTransitions()), provideHttpClient(withInterceptors([addTokenInterceptor]))]
};
