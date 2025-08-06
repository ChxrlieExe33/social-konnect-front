import {Component, inject, OnInit, signal} from '@angular/core';
import {PostComponent} from '../../../../shared/components/post/post.component';
import {Post} from '../../../../core/models/post.model';
import {PostService} from '../../../../core/services/common/post.service';
import {HttpErrorResponse} from '@angular/common/http';
import { takeUntil } from 'rxjs';
import { AutoDestroyService } from '../../../../core/services/utils/auto-destroy.service';

@Component({
  selector: 'app-explore-page',
    imports: [
        PostComponent
    ],
    providers: [AutoDestroyService],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.css'
})
export class ExplorePageComponent implements OnInit {

    loadedPosts = signal<Post[]>([]);
    error = signal<string>('');

    protected readonly destroy$: AutoDestroyService = inject(AutoDestroyService);

    constructor(private postService: PostService) {
    }

    ngOnInit() {

        this.subscribeToPosts();

        this.postService.getExplorePostsIfEmpty().subscribe({

            // Only handle the error since the state is being set in the state.
            error: (err : HttpErrorResponse) => {

                // Check to make sure the body of the custom error dto was actually sent
                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.log(err.error.message);
                    this.error.set(err.error.message);
                } else {
                    console.log(err);
                    this.error.set("Something went wrong, please try again later.");
                }

            }
        })

    }

    subscribeToPosts() {

        this.postService.loadedPosts$
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(posts => {
                this.loadedPosts.set(posts);
            })

    }

}
