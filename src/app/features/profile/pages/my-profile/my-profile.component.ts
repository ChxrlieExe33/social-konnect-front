import {Component, OnInit, signal} from '@angular/core';
import {ProfileHeaderComponent} from '../../components/profile-header/profile-header.component';
import {UserProfile} from '../../../../core/models/user-profile.model';
import {UserService} from '../../services/user.service';
import {PostService} from '../../../../core/services/common/post.service';
import {PostListComponent} from '../../../../shared/components/post-list/post-list.component';
import {AuthService} from '../../../../core/services/common/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {PostWithLikedByMe} from '../../../../core/models/post-with-liked.model';
import {UserMetadata} from '../../../../core/models/user-metadata';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {exhaustMap, filter, Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-my-profile',
    imports: [
        ProfileHeaderComponent,
        PostListComponent
    ],
    providers: [AutoDestroyService],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {

    loadedProfile = signal<UserProfile | undefined>(undefined);
    userPosts = signal<PostWithLikedByMe[]>([]);
    userMetadata = signal<UserMetadata | undefined>(undefined);

    error = signal<string | undefined>(undefined);

    nextPage = signal<number>(0);
    nextPageExists = signal<boolean>(true);
    loadMorePosts$ = new Subject<void>();

    constructor(
        private userService: UserService,
        private postsService: PostService,
        private authService: AuthService,
        private destroy$: AutoDestroyService
    ) {}

    ngOnInit() {

        this.subscribeToProfileData();
        this.subscribeToFirstPosts();
        this.subscribeToUserMetadata();
        this.subscribeToLoadMorePosts()

    }

    subscribeToProfileData() {

        this.userService.getCurrentUser().pipe(
            takeUntil(this.destroy$),
        ).subscribe({
            next: (data) => {
                this.loadedProfile.set(data);
            },
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
        });

    }

    subscribeToFirstPosts() {

        this.postsService.getPostsByUsername(this.authService.getCurrentUsername(), this.nextPage()).pipe(
            takeUntil(this.destroy$),
        ).subscribe({

            next: (data) => {
                this.userPosts.set(data.content);

                if (this.nextPage() + 1 === data.page.totalPages ) {
                    this.nextPageExists.set(false);
                    console.log("There is no more pages of " + this.authService.getCurrentUsername() + " posts");
                } else {
                    this.nextPageExists.set(true);
                    const currentPage = this.nextPage();
                    this.nextPage.set(currentPage + 1);
                    console.log("There is more pages of " + this.authService.getCurrentUsername() + " posts");
                }
            },
            error: (err) => {
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

    subscribeToLoadMorePosts() {

        this.loadMorePosts$.pipe(
            takeUntil(this.destroy$),
            filter(() => this.nextPageExists()), // Don't perform any action if there is no more pages.
            exhaustMap(() => {

                return this.postsService.getPostsByUsername(this.authService.getCurrentUsername(), this.nextPage()).pipe(
                    takeUntil(this.destroy$),
                )
            })
        ).subscribe({
            next: (data) => {

                if (this.nextPage() + 1 === data.page.totalPages ) {
                    this.nextPageExists.set(false);
                    console.log("There is no more explore pages")
                } else {
                    this.nextPageExists.set(true);
                    const currentPage = this.nextPage();
                    this.nextPage.set(currentPage + 1);
                    console.log("There is more explore pages")
                }

                const currentPosts = this.userPosts();

                this.userPosts.set([...currentPosts, ...data.content]);
            }
        });

    }

    subscribeToUserMetadata() {

        this.userService.getMyProfileMetadata().pipe(
            takeUntil(this.destroy$),
        ).subscribe({
            next: (data) => {
                this.userMetadata.set(data);
            }, error: (err) => {

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
