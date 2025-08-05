import { Injectable } from '@angular/core';
import {Post} from '../../models/post.model';
import {BehaviorSubject, map, Observable, of, tap} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
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

    getExplorePosts(): Observable<Post[]> {

        return this.httpClient.get<PostResponse>(`${environment.backendBaseUrl}/api/post`,).pipe(
            tap({
                next: (res) =>  {
                    this.loadedPosts.next(res.content);
                }
            }),
            map(
                (res: PostResponse) => res.content
            )
        );

    }

    getExplorePostsIfEmpty(): Observable<Post[]> {

        const currentPosts = this.loadedPosts.value;

        if (currentPosts.length === 0) {

            return this.getExplorePosts();

        } else {

            return of(currentPosts);

        }

    }


}
