import {ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../services/common/auth.service';
import {inject} from '@angular/core';
import {map} from 'rxjs';

export const isAuthedGuardCanActivateChild: CanActivateChildFn = (route, state) => {

    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.authentication$.pipe(
        map(auth => {
            if (auth) {
                return true;
            } else {
                return router.createUrlTree(['/auth', 'login'], {
                    queryParams: { returnUrl: state.url }
                });
            }
        })
    )

}
