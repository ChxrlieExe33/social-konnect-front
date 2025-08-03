import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {BehaviorSubject, Subject, tap} from 'rxjs';
import {Auth} from '../../models/auth.model';

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

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    // Private BehaviourSubject gets initialized from localstorage, if there is no auth already, then its null.
    private authentication = new BehaviorSubject<Auth | null>(this.retrieveAuthFromStorage());
    public authentication$ = this.authentication.asObservable();

    constructor(private httpClient : HttpClient) { }

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

    logout() {

        localStorage.removeItem('auth');

        this.authentication?.next(null);

    }

    retrieveAuthFromStorage() : Auth | null {

        const storedAuth = localStorage.getItem("auth");

        if (storedAuth) {
            return JSON.parse(storedAuth);
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

}
