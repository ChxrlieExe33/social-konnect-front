import { Injectable } from '@angular/core';
import {UserProfile} from '../../../core/models/user/user-profile.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';
import {UserMetadata} from '../../../core/models/user/user-metadata';

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

    getProfileByUsername(username : string) : Observable<UserProfile> {

        return this.httpClient.get<UserProfile>(`${environment.backendBaseUrl}/api/user/${username}`)

    }

    updateProfileData(data : FormData) : Observable<UserProfile> {

        return this.httpClient.put<UserProfile>(`${environment.backendBaseUrl}/api/user`, data)

    }

    getProfileMetadataByUsername(username : string) : Observable<UserMetadata> {

        return this.httpClient.get<UserMetadata>(`${environment.backendBaseUrl}/api/user/metadata/${username}`)

    }

    getMyProfileMetadata() : Observable<UserMetadata> {

        return this.httpClient.get<UserMetadata>(`${environment.backendBaseUrl}/api/user/metadata/me`)

    }

    followUser(username : string) : Observable<void> {

        return this.httpClient.post<void>(`${environment.backendBaseUrl}/api/follow/${username}`, null)

    }

    unfollowUser(username : string) : Observable<void> {

        return this.httpClient.delete<void>(`${environment.backendBaseUrl}/api/follow/${username}`)

    }

}
