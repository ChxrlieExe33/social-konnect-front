import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/common/auth.service';

export const addTokenInterceptor : HttpInterceptorFn = (req, next) => {

    const authEndpoints = [
        "/auth/login",
        "/auth/register",
    ]

    // Check if the request URL matches any auth endpoint
    const isAuthEndpoint = authEndpoints.some(endpoint =>
        req.url.includes(endpoint)
    );

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
