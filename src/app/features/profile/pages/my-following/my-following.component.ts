import {Component, OnInit, signal} from '@angular/core';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {UsernameAndPfp, UserService} from '../../services/user.service';
import {exhaustMap, Subject, takeUntil} from 'rxjs';
import {FollowsUserListComponent} from '../../components/follows-user-list/follows-user-list.component';

@Component({
  selector: 'app-my-following',
    imports: [
        FollowsUserListComponent
    ],
    providers: [AutoDestroyService],
  templateUrl: './my-following.component.html',
  styleUrl: './my-following.component.css'
})
export class MyFollowingComponent implements OnInit {

    users = signal<UsernameAndPfp[]>([]);

    nextPageExists = signal<boolean>(true);
    nextPage = signal<number>(0);

    error = signal<string | undefined>(undefined);

    loadMoreClicked$ = new Subject<void>();

    constructor(
        private readonly userService: UserService,
        private readonly destroy$: AutoDestroyService
    ) {}

    ngOnInit() {

        this.subscribeToFirstPage();
        this.subscribeToLoadMoreClicked();

    }

    subscribeToFirstPage() {

        this.userService.getMyFollowing(this.nextPage()).pipe(takeUntil(this.destroy$)).subscribe({
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
                    this.error.set("Something went wrong when fetching your following, please try again later.");
                }

            }
        })

    }

    subscribeToLoadMoreClicked() {

        this.loadMoreClicked$.pipe(
            takeUntil(this.destroy$),
            exhaustMap(() => {
                return this.userService.getMyFollowing(this.nextPage()).pipe(
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
                    this.error.set("Something went wrong when fetching your following, please try again later.");
                }

            }
        })

    }

}
