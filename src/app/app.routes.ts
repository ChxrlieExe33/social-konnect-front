import { Routes } from '@angular/router';
import {MainLayoutComponent} from './core/layouts/main-layout/main-layout.component';
import {isAuthedGuardCanActivate} from './core/guards/is-authed-nonchild.guard';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [isAuthedGuardCanActivate],
        children: [
            {
                path: 'feed',
                loadChildren: () => import('./features/feeds/feed.routes').then(r => r.feedRoutes)
            },
            {
                path: '',
                redirectTo: 'feed',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then(r => r.authRoutes),
    }
];
