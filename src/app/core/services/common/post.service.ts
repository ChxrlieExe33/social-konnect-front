import { Injectable } from '@angular/core';
import {Post} from '../../models/post.model';
import {BehaviorSubject, map, Observable, of, tap} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {PostMetaData} from '../../models/post-metadata.model';
import {PostWithLikedByMe} from '../../models/post-with-liked.model';

type PostResponse = {
    content: PostWithLikedByMe[],
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

    private loadedPosts = new BehaviorSubject<PostWithLikedByMe[]>([]);
    public loadedPosts$ = this.loadedPosts.asObservable();

    constructor(private httpClient : HttpClient) { }

    getExplorePosts(): Observable<PostWithLikedByMe[]> {

        return this.httpClient.get<PostResponse>(`${environment.backendBaseUrl}/api/post/all-with-liked-check`,).pipe(
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

    getExplorePostsIfEmpty(): Observable<PostWithLikedByMe[]> {

        const currentPosts = this.loadedPosts.value;

        if (currentPosts.length === 0) {

            return this.getExplorePosts();

        } else {

            return of(currentPosts);

        }

    }

    getPostsByUsername(username: string): Observable<PostWithLikedByMe[]> {

        return this.httpClient.get<PostResponse>(`${environment.backendBaseUrl}/api/post/by-username-with-liked-check/${username}`,).pipe(
            map(res => res.content),
            tap({
                error: (err : HttpErrorResponse) => {
                    // Check to make sure the body of the custom error dto was actually sent
                    if (err.error && typeof err.error === 'object') {
                        console.log(err.error);
                    } else {
                        console.log(err.message);
                    }
                }
            })
        );

    }

    // TODO: This endpoint doesn't support the liked check yet, need to add it.
    getPostByPostId(id : string) : Observable<Post> {

        return this.httpClient.get<Post>(`${environment.backendBaseUrl}/api/post/${id}`,).pipe();

    }

    getPostMetadataByPostId(postId: string) : Observable<PostMetaData> {

        return this.httpClient.get<PostMetaData>(`${environment.backendBaseUrl}/api/post/metadata/${postId}`,).pipe()

    }

}
