import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {UsernameAndPfp} from '../../profile/services/user.service';

export type UsersWhoLikedPage = {
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
export class LikeService {

    constructor(
      private readonly httpClient: HttpClient,
    ) { }

    addLikeToPost(postId : string) : Observable<void> {

        return this.httpClient.post<void>(`${environment.backendBaseUrl}/api/like/${postId}`, null);

    }

    removeLikeFromPost(postId : string): Observable<void> {

        return this.httpClient.delete<void>(`${environment.backendBaseUrl}/api/like/${postId}`);

    }

    getUsersWhoLikedPost(postId : string, page : number) : Observable<UsersWhoLikedPage> {

        const params = new HttpParams().set('page', page);

        return this.httpClient.get<UsersWhoLikedPage>(`${environment.backendBaseUrl}/api/like/users/${postId}`, {params});

    }

}
