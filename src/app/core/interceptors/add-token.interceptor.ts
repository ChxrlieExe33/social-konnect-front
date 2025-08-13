import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/common/auth.service';

export const addTokenInterceptor : HttpInterceptorFn = (req, next) => {

    const authEndpointPrefixes = [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/exists',
        '/api/auth/verify'
    ];

    const url = new URL(req.url, window.location.origin);
    const path = url.pathname;

    const isAuthEndpoint = authEndpointPrefixes.some(prefix => path.startsWith(prefix));

    // Skip adding auth header for auth endpoints
    if (isAuthEndpoint) {
        return next(req);
    }

    const authService = inject(AuthService);

    const jwt = authService.getCurrentToken();

    const authReq = req.clone({
        setHeaders: {
            'Authorization' : jwt
        }
    });

    return next(authReq);

}
