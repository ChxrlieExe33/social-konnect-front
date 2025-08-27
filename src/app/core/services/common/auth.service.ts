import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {BehaviorSubject, catchError, Observable, of, tap} from 'rxjs';
import {Auth} from '../../models/auth/auth.model';
import {Router} from '@angular/router';
import {RegistrationModel} from '../../models/auth/registration.model';
import {RegistrationVerifyCodeModel} from '../../models/auth/registration-verify-code.model';
import {PostService} from './post.service';

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

type ForgotPasswordInitialResponse = {
    resetId : string,
    message: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    // Private BehaviourSubject gets initialized from localstorage, if there is no auth already, then its null.
    private authentication = new BehaviorSubject<Auth | null>(this.retrieveAuthFromStorage());
    public authentication$ = this.authentication.asObservable();

    constructor(private httpClient : HttpClient, private router: Router, private postService: PostService) { }

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

                        const auth = <Auth>{
                            username: authBody.username,
                            jwt: res.headers.get("authorization"),
                            jwtExp: authBody.expirationDate,
                        }

                        this.saveAuthInStorage(auth);

                        this.authentication?.next(auth);

                    }

                }, error: (err : HttpErrorResponse) => {

                    if (err.error && typeof err.error === 'object' && err.error.message) {
                        console.warn(err.error.message);
                    } else {
                        console.warn(err);
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
        this.postService.emptySavedFeeds();

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

        return this.httpClient.get<boolean>(`${environment.backendBaseUrl}/api/auth/exists/${username}`).pipe(
            catchError(error => {

                console.warn(error);

                return of(null);
            })
        )

    }

    public submitForgotPasswordRequest(username: string) : Observable<ForgotPasswordInitialResponse> {

        return this.httpClient.post<ForgotPasswordInitialResponse>(`${environment.backendBaseUrl}/api/auth/resetpassword/${username}`, {})

    }

    public submitForgotPasswordCode(code: string, resetId: string) : Observable<ForgotPasswordInitialResponse> {

        return this.httpClient.post<ForgotPasswordInitialResponse>(`${environment.backendBaseUrl}/api/auth/resetpassword/verify`, {reset_id : resetId, reset_code: code})

    }

    public submitForgotPasswordNewPassword( resetId : string, password: string) : Observable<{message: string}> {

        return this.httpClient.post<{message : string}>(`${environment.backendBaseUrl}/api/auth/resetpassword/submitnew`, {reset_id : resetId, new_password: password})

    }

    public requestNewRegisterVerificationCode(username: string) : Observable<void> {

        return this.httpClient.post<void>(`${environment.backendBaseUrl}/api/auth/send-code-again/${username}`, {})

    }

}
