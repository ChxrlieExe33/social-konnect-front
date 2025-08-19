import {Component, inject, OnInit, signal} from '@angular/core';
import {PostService} from '../../../../core/services/common/post.service';
import {HttpErrorResponse} from '@angular/common/http';
import {exhaustMap, Subject, takeUntil} from 'rxjs';
import { AutoDestroyService } from '../../../../core/services/utils/auto-destroy.service';
import {PostListComponent} from '../../../../shared/components/post-list/post-list.component';
import {PostWithLikedByMe} from '../../../../core/models/post/post-with-liked.model';

@Component({
  selector: 'app-explore-page',
    imports: [
        PostListComponent
    ],
    providers: [AutoDestroyService],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.css'
})
export class ExplorePageComponent implements OnInit {

    loadedPosts = signal<PostWithLikedByMe[]>([]);
    error = signal<string>('');

    protected readonly destroy$: AutoDestroyService = inject(AutoDestroyService);

    loadMorePosts$ = new Subject<void>();


    constructor(protected postService: PostService) {
    }

    ngOnInit() {

        this.subscribeToPosts();

        this.subscribeToLoadMorePosts()

        this.postService.getExplorePostsIfEmpty().subscribe({

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

        this.postService.loadedExplorePosts$
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
                return this.postService.getExplorePosts()
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
