import { Routes } from '@angular/router';
import {AuthLayoutComponent} from './core/layouts/auth-layout/auth-layout.component';
import {authRoutes} from './routes/auth/auth.routes';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: authRoutes
    }
];
