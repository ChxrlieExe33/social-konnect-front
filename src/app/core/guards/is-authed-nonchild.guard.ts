import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import {AuthService} from '../services/common/auth.service';

export const isAuthedGuardCanActivate: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.authentication$.pipe(
        map(auth => {
            return auth
                ? true
                : router.createUrlTree(['/auth', 'login'], {
                    queryParams: { returnUrl: state.url }
                });
        })
    );
};
