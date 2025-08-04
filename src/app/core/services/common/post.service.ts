import { Injectable } from '@angular/core';
import {Post} from '../../models/post.model';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

type PostResponse = {
    content: Post[],
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
export class PostService {

    private loadedPosts = new BehaviorSubject<Post[]>([]);
    public loadedPosts$ = this.loadedPosts.asObservable();

    constructor(private httpClient : HttpClient) { }

    getExplorePosts(): Observable<PostResponse> {

        return this.httpClient.get<PostResponse>(`${environment.backendBaseUrl}/api/post`,).pipe(
            tap({
                next: (res) =>  {
                    this.loadedPosts.next(res.content);
                }
            })
        );

    }
}
