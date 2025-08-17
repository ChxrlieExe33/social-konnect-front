import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withComponentInputBinding, withViewTransitions} from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {addTokenInterceptor} from './core/interceptors/add-token.interceptor';
import {IMAGE_CONFIG} from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
      provideHttpClient(withInterceptors([addTokenInterceptor])),
      {
          provide: IMAGE_CONFIG,
          useValue: {
              disableImageSizeWarning: true,
              disableImageLazyLoadWarning: true
          }
      }
  ]
};
