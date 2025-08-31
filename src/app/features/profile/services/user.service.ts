import { Injectable } from '@angular/core';
import {UserProfile} from '../../../core/models/user/user-profile.model';
import {Observable, tap} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
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

export type UserSearchResult = {
    username: string,
    profilePictureUrl: string,
    following: boolean,
}

type UserSearchResultPage = {
    content: UserSearchResult[],
    page: {
        number: number,
        size: number,
        totalElements: number,
        totalPages: number
    }
}

export type UsernameAndPfp = {
    username: string,
    profilePictureUrl: string,
}

export type UsernameAndPfpPage = {
    content: UsernameAndPfp[],
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

    // ------------------------------------------------------------------------
    // ---------------------------- User methods ------------------------------
    // ------------------------------------------------------------------------

    getCurrentUser() : Observable<UserProfile> {

        return this.httpClient.get<UserProfile>(`${environment.backendBaseUrl}/api/auth/user`);

    }

    searchUsersByUsername(username : string) : Observable<UserSearchResult[]> {

        return this.httpClient.get<UserSearchResultPage>(`${environment.backendBaseUrl}/api/user/search/${username}`).pipe(
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

    getProfilePictureByUsername(username : string) : Observable<{username: string, profilePictureUrl: string}> {

        return this.httpClient.get<{username: string, profilePictureUrl: string}>(`${environment.backendBaseUrl}/api/user/pfp/${username}`)

    }

    updatePassword(oldPassword: string, newPassword: string) : Observable<void> {

        return this.httpClient.put<void>(`${environment.backendBaseUrl}/api/user/password`, {old_password: oldPassword, new_password: newPassword})

    }

    deleteMyAccount(): Observable<void> {

        return this.httpClient.delete<void>(`${environment.backendBaseUrl}/api/user`)
    }

    // ------------------------------------------------------------------------
    // ---------------------------- Follow methods ----------------------------
    // ------------------------------------------------------------------------

    followUser(username : string) : Observable<void> {

        return this.httpClient.post<void>(`${environment.backendBaseUrl}/api/follow/${username}`, null)

    }

    unfollowUser(username : string) : Observable<void> {

        return this.httpClient.delete<void>(`${environment.backendBaseUrl}/api/follow/${username}`)

    }

    getMyFollowers(page: number) : Observable<UsernameAndPfpPage> {

        const params = new HttpParams()
            .set('page', page)

        return this.httpClient.get<UsernameAndPfpPage>(`${environment.backendBaseUrl}/api/follow/my-followers`, {params})
    }

    getMyFollowing(page: number) : Observable<UsernameAndPfpPage> {

        const params = new HttpParams();
        params.append('page', page);

        return this.httpClient.get<UsernameAndPfpPage>(`${environment.backendBaseUrl}/api/follow/my-following`, {params})

    }


}
