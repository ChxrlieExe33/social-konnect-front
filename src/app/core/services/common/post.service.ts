import {Injectable, signal} from '@angular/core';
import {BehaviorSubject, map, Observable, of, tap} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {PostMetaData} from '../../models/post/post-metadata.model';
import {PostWithLikedByMe} from '../../models/post/post-with-liked.model';
import {Post} from '../../models/post/post.model';

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

    private loadedExplorePosts = new BehaviorSubject<PostWithLikedByMe[]>([]);
    public loadedExplorePosts$ = this.loadedExplorePosts.asObservable();
    public nextExplorePage = signal<number>(0);
    public nextExplorePageExists = signal<boolean>(true);

    private loadedFollowingPosts = new BehaviorSubject<PostWithLikedByMe[]>([]);
    public loadedFollowingPosts$ = this.loadedFollowingPosts.asObservable();
    public nextFollowingPage = signal<number>(0);
    public nextFollowingPageExists = signal<boolean>(true);

    constructor(private httpClient : HttpClient) { }

    getExplorePosts(): Observable<PostWithLikedByMe[]> {

        // Don't fetch anything if there is no more.
        if(!this.nextExplorePageExists()){
            return of([]);
        }

        const params = new HttpParams()
            .set('page', this.nextExplorePage())

        return this.httpClient.get<PostResponse>(`${environment.backendBaseUrl}/api/post/all-with-liked-check`, {params}).pipe(
            tap({
                next: (res) =>  {

                    const currentPosts = this.loadedExplorePosts.getValue();

                    this.loadedExplorePosts.next([ ...currentPosts, ...res.content]);

                    if (this.nextExplorePage() + 1 === res.page.totalPages ) {
                        this.nextExplorePageExists.set(false);
                    } else {
                        this.nextExplorePageExists.set(true);
                        const currentPage = this.nextExplorePage();
                        this.nextExplorePage.set(currentPage + 1);
                    }

                }, error : (err) => {
                    this.nextExplorePageExists.set(false);
                }
            }),
            map(
                (res: PostResponse) => res.content
            )
        );

    }

    getExplorePostsIfEmpty(): Observable<PostWithLikedByMe[]> {

        const currentPosts = this.loadedExplorePosts.value;

        if (currentPosts.length === 0) {

            return this.getExplorePosts();

        } else {

            return of(currentPosts);

        }

    }

    getFollowingPosts(): Observable<PostWithLikedByMe[]> {

        // Don't fetch anything if there is no more.
        if(!this.nextFollowingPageExists()){
            return of([]);
        }

        const params = new HttpParams()
            .set('page', this.nextFollowingPage())

        return this.httpClient.get<PostResponse>(`${environment.backendBaseUrl}/api/feed/following`, {params}).pipe(
            tap({
                next: (res) =>  {

                    const currentPosts = this.loadedFollowingPosts.getValue();

                    this.loadedFollowingPosts.next([ ...currentPosts, ...res.content]);

                    if (this.nextFollowingPage() + 1 === res.page.totalPages ) {
                        this.nextFollowingPageExists.set(false);
                    } else {
                        this.nextFollowingPageExists.set(true);
                        const currentPage = this.nextFollowingPage();
                        this.nextFollowingPage.set(currentPage + 1);
                    }

                }, error : (err) => {
                    this.nextFollowingPageExists.set(false);
                }
            }),
            map(
                (res: PostResponse) => res.content
            )
        );

    }

    getFollowingPostsIfEmpty(): Observable<PostWithLikedByMe[]> {


        const currentPosts = this.loadedFollowingPosts.value;

        if (currentPosts.length === 0) {

            return this.getFollowingPosts();

        } else {

            return of(currentPosts);

        }

    }

    getPostsByUsername(username: string, page: number): Observable<PostResponse> {

        const params = new HttpParams()
            .set('page', page)

        return this.httpClient.get<PostResponse>(`${environment.backendBaseUrl}/api/post/by-username-with-liked-check/${username}`, {params}).pipe(
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

    appendCreatedPostToExploreFeed(post: PostWithLikedByMe) {

        const currentPosts = this.loadedExplorePosts.value;
        const updatedPosts = [post, ...currentPosts];

        this.loadedExplorePosts.next(updatedPosts);

    }

    getPostByPostId(id : string) : Observable<PostWithLikedByMe> {

        return this.httpClient.get<PostWithLikedByMe>(`${environment.backendBaseUrl}/api/post/with-liked/${id}`,).pipe();

    }

    getPostMetadataByPostId(postId: string) : Observable<PostMetaData> {

        return this.httpClient.get<PostMetaData>(`${environment.backendBaseUrl}/api/post/metadata/${postId}`,).pipe()

    }

    createNewPost(postData: FormData) : Observable<Post> {

        return this.httpClient.post<Post>(`${environment.backendBaseUrl}/api/post`, postData).pipe()

    }

    updatePostCaption(caption: string, id: string) : Observable<Post> {

        return this.httpClient.put<Post>(`${environment.backendBaseUrl}/api/post/${id}`, {caption: caption})

    }

    deletePostById(id: string) : Observable<void> {

        return this.httpClient.delete<void>(`${environment.backendBaseUrl}/api/post/${id}`,).pipe();

    }

    // Only need to remove it from the explore feed as a user's own post won't be present in the following feed.
    removePostFromExploreFeedAfterDelete(id: string){

        const updatedExplorePosts = this.loadedExplorePosts.value.filter(post => post.postId !== id);
        this.loadedExplorePosts.next(updatedExplorePosts);

    }

    // To empty both feeds from state, for example on logout, as the state will still be present on the new login and show the wrong feed otherwise.
    emptySavedFeeds(): void {

        this.loadedFollowingPosts.next([]);
        this.loadedExplorePosts.next([]);

        this.nextExplorePageExists.set(true);
        this.nextFollowingPageExists.set(true);

        this.nextExplorePage.set(0);
        this.nextFollowingPage.set(0);

    }

}
