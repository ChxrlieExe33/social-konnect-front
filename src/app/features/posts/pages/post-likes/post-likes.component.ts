import {Component, input, OnInit, signal} from '@angular/core';
import {UsernameAndPfp} from '../../../profile/services/user.service';
import {exhaustMap, Subject, takeUntil} from 'rxjs';
import {LikeService} from '../../services/like.service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {UsersWhoLikedComponent} from '../../components/users-who-liked/users-who-liked.component';

@Component({
  selector: 'app-post-likes',
    imports: [
        UsersWhoLikedComponent

    ],
    providers: [AutoDestroyService],
  templateUrl: './post-likes.component.html',
  styleUrl: './post-likes.component.css'
})
export class PostLikesComponent implements OnInit {

    // Obtained from the route using component input binding.
    postId = input.required<string>();

    users = signal<UsernameAndPfp[]>([]);

    nextPageExists = signal<boolean>(true);
    nextPage = signal<number>(0);

    error = signal<string | undefined>(undefined);

    loadMoreClicked$ = new Subject<void>();

    constructor(
       private readonly likeService: LikeService,
       private readonly destroy$: AutoDestroyService
    ) {}

    ngOnInit() {
        this.subscribeToFirstPage();
        this.subscribeToLoadMoreClicked();
    }

    subscribeToFirstPage() {

        this.likeService.getUsersWhoLikedPost(this.postId(), this.nextPage()).pipe(takeUntil(this.destroy$)).subscribe({
            next: res => {

                // Make sure no more pages are loaded
                if (this.nextPage() + 1 >= res.page.totalPages) {
                    this.nextPageExists.set(false);
                } else {
                    this.nextPageExists.set(true);
                    const currentPage = this.nextPage();
                    this.nextPage.set(currentPage + 1);
                }

                this.users.set(res.content);

            }, error: err => {

                this.nextPageExists.set(false);

                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.warn(err.error.message);
                    this.error.set(err.error.message);
                } else {
                    console.warn(err);
                    this.error.set("Something went wrong when fetching users who liked, please try again later.");
                }

            }
        })

    }

    subscribeToLoadMoreClicked() {

        this.loadMoreClicked$.pipe(
            takeUntil(this.destroy$),
            exhaustMap(() => {
                return this.likeService.getUsersWhoLikedPost(this.postId() ,this.nextPage()).pipe(
                    takeUntil(this.destroy$),
                )
            })
        ).subscribe({
            next: res => {

                // Make sure no more pages are loaded
                if (this.nextPage() + 1 >= res.page.totalPages) {
                    this.nextPageExists.set(false);
                } else {
                    this.nextPageExists.set(true);
                    const currentPage = this.nextPage();
                    this.nextPage.set(currentPage + 1);
                }

                const currentUsers = this.users();
                this.users.set([...currentUsers, ...res.content]);

            }, error: err => {

                this.nextPageExists.set(false);

                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.warn(err.error.message);
                    this.error.set(err.error.message);
                } else {
                    console.warn(err);
                    this.error.set("Something went wrong when fetching users who liked, please try again later.");
                }

            }
        })

    }

}
