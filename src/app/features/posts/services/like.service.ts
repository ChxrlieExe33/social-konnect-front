import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

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

}
