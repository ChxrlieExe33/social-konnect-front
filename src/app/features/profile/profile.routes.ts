import {Routes} from '@angular/router';
import {MyProfileComponent} from './pages/my-profile/my-profile.component';
import {OtherUserProfileComponent} from './pages/other-user-profile/other-user-profile.component';
import {EditProfileComponent} from './pages/edit-profile/edit-profile.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {UpdatePasswordComponent} from './pages/update-password/update-password.component';
import {MyFollowingComponent} from './pages/my-following/my-following.component';
import {MyFollowersComponent} from './pages/my-followers/my-followers.component';
import {DeleteMyAccountComponent} from './pages/delete-my-account/delete-my-account.component';

export const profileRoutes : Routes = [
    {
        path: 'me',
        component: MyProfileComponent,
    },
    {
        path: 'user/:username',
        component: OtherUserProfileComponent,
    },
    {
        path: 'edit',
        component: EditProfileComponent
    },
    {
        path: 'settings',
        component: SettingsComponent
    },
    {
        path: 'update-password',
        component: UpdatePasswordComponent
    },
    {
        path: 'my-followers',
        component: MyFollowersComponent
    },
    {
        path: 'my-following',
        component: MyFollowingComponent
    },
    {
        path: 'delete-account',
        component: DeleteMyAccountComponent
    },
    {
        path: '**',
        redirectTo: 'me'
    }
]
