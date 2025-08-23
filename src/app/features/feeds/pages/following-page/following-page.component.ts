import {Component, OnInit, signal} from '@angular/core';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {PostService} from '../../../../core/services/common/post.service';
import {exhaustMap, Subject, takeUntil} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {PostWithLikedByMe} from '../../../../core/models/post/post-with-liked.model';
import {PostListComponent} from '../../../../shared/components/post-list/post-list.component';

@Component({
  selector: 'app-following-page',
    imports: [
        PostListComponent
    ],
    providers: [AutoDestroyService],
  templateUrl: './following-page.component.html',
  styleUrl: './following-page.component.css'
})
export class FollowingPageComponent implements OnInit {

    loadedPosts = signal<PostWithLikedByMe[]>([]);
    error = signal<string>('');

    loadMorePosts$ = new Subject<void>();

    constructor(
        protected readonly postService: PostService,
        private readonly destroy$: AutoDestroyService
    ) {}

    ngOnInit() {

        this.subscribeToPosts();
        this.subscribeToLoadMorePosts();

        this.postService.getFollowingPostsIfEmpty().subscribe({
            // Only handle the error since the state is being set in the state.
            error: (err : HttpErrorResponse) => {

                // Check to make sure the body of the custom error dto was actually sent
                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.log(err.error.message);
                    this.error.set(err.error.message);
                } else {
                    console.log(err);
                    this.error.set("Something went wrong when fetching explore posts, please try again later.");
                }

            }
        })
    }

    subscribeToPosts() {

        this.postService.loadedFollowingPosts$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(posts => {
                this.loadedPosts.set(posts);
            })

    }

    subscribeToLoadMorePosts(){

        this.loadMorePosts$.pipe(
            takeUntil(this.destroy$),
            exhaustMap(() => {
                return this.postService.getFollowingPosts()
            })
        ).subscribe({
            error: (err : HttpErrorResponse) => {

                // Check to make sure the body of the custom error dto was actually sent
                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.log(err.error.message);
                    this.error.set(err.error.message);
                } else {
                    console.log(err);
                    this.error.set("Something went wrong when fetching explore posts, please try again later.");
                }

            }
        })

    }

}
