import {Routes} from '@angular/router';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {RegisterPageComponent} from './pages/register-page/register-page.component';
import {ForgotPasswordComponent} from './pages/forgot-password/forgot-password.component';

export const authRoutes: Routes = [
    {
        path: 'login',
        component: LoginPageComponent
    },
    {
        path: 'register',
        component: RegisterPageComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
    }
]
