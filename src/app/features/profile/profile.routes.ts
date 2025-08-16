import {Routes} from '@angular/router';
import {MyProfileComponent} from './pages/my-profile/my-profile.component';
import {OtherUserProfileComponent} from './pages/other-user-profile/other-user-profile.component';

export const profileRoutes : Routes = [
    {
        path: 'me',
        component: MyProfileComponent,
    },
    {
        path: 'user/:username',
        component: OtherUserProfileComponent,
    }
]
