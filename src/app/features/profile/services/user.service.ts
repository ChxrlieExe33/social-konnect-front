import { Injectable } from '@angular/core';
import {UserProfile} from '../../../core/models/user-profile.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    constructor(
        private httpClient: HttpClient,
    ) { }

    getCurrentUser() : Observable<UserProfile> {

        return this.httpClient.get<UserProfile>(`${environment.backendBaseUrl}/api/auth/user`);

    }

}
