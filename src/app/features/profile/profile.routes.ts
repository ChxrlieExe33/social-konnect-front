import {Routes} from '@angular/router';
import {MyProfileComponent} from './pages/my-profile/my-profile.component';

export const profileRoutes : Routes = [
    {
        path: 'me',
        component: MyProfileComponent,
    }
]
