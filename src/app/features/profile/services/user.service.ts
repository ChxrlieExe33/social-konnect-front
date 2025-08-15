import { Injectable } from '@angular/core';
import {UserProfile} from '../../../core/models/user-profile.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';

type UserPage = {
    content: UserProfile[],
    page: {
        number: number,
        size: number,
        totalElements: number,
        totalPages: number
    }
}

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

    searchUsersByUsername(username : string) : Observable<UserProfile[]> {

        return this.httpClient.get<UserPage>(`${environment.backendBaseUrl}/api/user/search/${username}`).pipe(
            map(res => res.content)
        );

    }

}
