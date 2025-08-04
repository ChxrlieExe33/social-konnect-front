import {Routes} from '@angular/router';

export const feedRoutes : Routes = [
    {
        path: 'following',
        loadComponent: () => import('./pages/following-page/following-page.component').then(r => r.FollowingPageComponent),
    },
    {
        path: 'explore',
        loadComponent: () => import('./pages/explore-page/explore-page.component').then(r => r.ExplorePageComponent),
    },
    {
        path: '',
        redirectTo: 'following',
        pathMatch: 'full',
    }
]
