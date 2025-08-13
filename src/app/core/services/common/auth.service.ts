import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {BehaviorSubject, catchError, Observable, of, tap} from 'rxjs';
import {Auth} from '../../models/auth.model';
import {Router} from '@angular/router';
import {RegistrationModel} from '../../models/registration.model';
import {RegistrationVerifyCodeModel} from '../../models/registration-verify-code.model';

type AuthResponse = {
    message: string,
    username: string,
    expirationDate: Date,
}

type AuthFailure = {
    message: string,
    responseCode: number,
    timestamp: number
}

type RegisterResponse = {
    id: number,
    username: string,
    email: string,
    enabledStatus: boolean,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    // Private BehaviourSubject gets initialized from localstorage, if there is no auth already, then its null.
    private authentication = new BehaviorSubject<Auth | null>(this.retrieveAuthFromStorage());
    public authentication$ = this.authentication.asObservable();

    constructor(private httpClient : HttpClient, private router: Router) { }

    login(username: string, password: string) {

        return this.httpClient.post<AuthResponse | AuthFailure>(`${environment.backendBaseUrl}/api/auth/login`, {
            username: username,
            password: password
        }, {observe: "response"}
        ).pipe(
            tap({
                next: (res) => {

                    if (res.status === 200 && res.body) {

                        const authBody = res.body as AuthResponse;

                        console.log(authBody.expirationDate);

                        const auth = <Auth>{
                            username: authBody.username,
                            jwt: res.headers.get("authorization"),
                            jwtExp: authBody.expirationDate,
                        }

                        this.saveAuthInStorage(auth);

                        this.authentication?.next(auth);

                    }

                }, error: (err : HttpErrorResponse) => {

                    // Check to make sure the body of the custom error dto was actually sent
                    if (err.error && typeof err.error === 'object') {
                        console.log(err.error);
                    } else {
                        console.log(err.message);
                    }


                }

            })
        )

    }

    setAuthenticationAfterRegister(username: string, jwt: string) {

        const expiryDate: Date = new Date();
        expiryDate.setHours(expiryDate.getHours() + 8);

        const auth : Auth = {
            username: username,
            jwt: jwt,
            jwtExp: expiryDate,
        }

        this.saveAuthInStorage(auth);

        this.authentication?.next(auth);

    }

    logout() {

        localStorage.removeItem('auth');

        this.authentication?.next(null);

        console.log("Redirecting to login...");

        setTimeout(() => {
            if (this.router.url !== '/auth/login') {
                this.router.navigate(['/auth', 'login']);
            }
        }, 100);

    }

    retrieveAuthFromStorage() : Auth | null {

        const storedAuth = localStorage.getItem("auth");

        if (storedAuth) {

            const auth : Auth = JSON.parse(storedAuth);

            const now = new Date();
            const expiry = new Date(auth.jwtExp);

            // Check if expired
            if(expiry < now) {
                this.logout();
            }

            return auth;

        } else {
            return null;
        }

    }

    saveAuthInStorage(auth : Auth) {

        localStorage.setItem("auth", JSON.stringify(auth));

    }

    public getCurrentToken() : string {

        const auth = this.authentication.value;

        return auth!.jwt;

    }

    public getCurrentUsername(): string {

        const auth = this.authentication.value;

        return auth!.username;
    }

    public submitRegisterStep1(registrationData: RegistrationModel): Observable<RegisterResponse> {

        return this.httpClient.post<RegisterResponse>(`${environment.backendBaseUrl}/api/auth/register`, registrationData)

    }

    public submitRegisterVerifyCode(verificationData: RegistrationVerifyCodeModel): Observable<HttpResponse<RegisterResponse>> {

        return this.httpClient.post<RegisterResponse>(`${environment.backendBaseUrl}/api/auth/verify`, verificationData, {observe: "response"})

    }

    public checkIfUsernameTaken(username: string): Observable<boolean | null> {

        return this.httpClient.get<boolean>(`${environment.backendBaseUrl}/api/auth/exists/${username}?_=${Date.now()}`).pipe(
            tap(value => {
                console.log(value);
            }),
            catchError(error => {

                console.log(error);

                return of(null);
            })
        )

    }

}
