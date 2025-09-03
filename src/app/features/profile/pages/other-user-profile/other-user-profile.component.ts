import {Component, input, OnInit, signal} from '@angular/core';
import {PostListComponent} from '../../../../shared/components/post-list/post-list.component';
import {UserProfile} from '../../../../core/models/user/user-profile.model';
import {PostWithLikedByMe} from '../../../../core/models/post/post-with-liked.model';
import {UserService} from '../../services/user.service';
import {PostService} from '../../../../core/services/common/post.service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {exhaustMap, filter, Subject, takeUntil} from 'rxjs';
import {
    OtherUserProfileHeaderComponent
} from '../../components/other-user-profile-header/other-user-profile-header.component';
import {UserMetadata} from '../../../../core/models/user/user-metadata';
import {AuthService} from '../../../../core/services/common/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-other-user-profile',
    imports: [
        PostListComponent,
        OtherUserProfileHeaderComponent
    ],
    providers: [AutoDestroyService],
  templateUrl: './other-user-profile.component.html',
  styleUrl: './other-user-profile.component.css'
})
export class OtherUserProfileComponent implements OnInit {

    error = signal<string | undefined>(undefined);
    loadedProfile = signal<UserProfile | undefined>(undefined);
    userPosts = signal<PostWithLikedByMe[] | undefined>(undefined);
    userMetadata = signal<UserMetadata | undefined>(undefined);

    following = signal<boolean>(false);

    // Obtained from the route using component input binding.
    username = input.required<string>();

    nextPage = signal<number>(0);
    nextPageExists = signal<boolean>(true);
    loadMorePosts$ = new Subject<void>();

    constructor(
        private readonly userService: UserService,
        private readonly postService: PostService,
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly destroy$: AutoDestroyService
    ) {
    }

    ngOnInit() {

        // If it's the current user, go to /profile/me to avoid showing the following button on a user's own profile.
        if(this.authService.getCurrentUsername() === this.username()){

            this.router.navigate(['/profile', 'me']);

        }

        this.subscribeToProfileData();
        this.subscribeToFirstUserPosts();
        this.subscribeToUserMetadata();
        this.subscribeToLoadMorePosts();

    }

    subscribeToProfileData() {

        this.userService.getProfileByUsername(this.username()).pipe(
            takeUntil(this.destroy$),
        ).subscribe({
            next: data => {

                this.loadedProfile.set(data);

            }, error: err => {

                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.log(err.error.message);
                    this.error.set(err.error.message);
                } else {
                    console.log(err);
                    this.error.set("Something went wrong when fetching this profile, please try again later.");
                }

            }
        })

    }

    subscribeToFirstUserPosts() {

        this.postService.getPostsByUsername(this.username(), this.nextPage()).pipe(
            takeUntil(this.destroy$),
        ).subscribe({
            next: data => {

                this.userPosts.set(data.content);

                if (this.nextPage() + 1 === data.page.totalPages ) {

                    this.nextPageExists.set(false);

                } else {

                    this.nextPageExists.set(true);
                    const currentPage = this.nextPage();
                    this.nextPage.set(currentPage + 1);

                }

            },
            error: err => {

                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.log(err.error.message);
                    this.error.set(err.error.message);
                    this.nextPageExists.set(false);
                } else {
                    this.nextPageExists.set(false);
                    console.log(err);
                    this.error.set("Something went wrong when fetching this profile, please try again later.");
                }

            }
        })

    }

    subscribeToLoadMorePosts() {

        this.loadMorePosts$.pipe(
            takeUntil(this.destroy$),
            filter(() => this.nextPageExists()), // Don't perform any action if there is no more pages.
            exhaustMap(() => {
                return this.postService.getPostsByUsername(this.username(), this.nextPage()).pipe(
                    takeUntil(this.destroy$),
                )
            })
        ).subscribe({
            next: (data) => {

                if (this.nextPage() + 1 === data.page.totalPages ) {

                    this.nextPageExists.set(false);

                } else {

                    this.nextPageExists.set(true);
                    const currentPage = this.nextPage();
                    this.nextPage.set(currentPage + 1);

                }

                const currentPosts = this.userPosts();

                this.userPosts.set([...currentPosts!, ...data.content]);
            }
        });

    }

    subscribeToUserMetadata() {

        this.userService.getProfileMetadataByUsername(this.username()).pipe(
            takeUntil(this.destroy$),
        ).subscribe({
            next: (data) => {

                this.userMetadata.set(data);
                this.following.set(data.current_user_follows);

            }, error: (err) => {

                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.log(err.error.message);
                    this.error.set(err.error.message);
                } else {
                    console.log(err);
                    this.error.set("Something went wrong when fetching this user's posts, please try again later.");
                }
            }
        })

    }

    increaseFollowers() {

        if (this.userMetadata()) {
            this.userMetadata.update((meta: UserMetadata | undefined) => {
                if (!meta) return meta; // or return undefined

                return {
                    ...meta,
                    followers: meta.followers + 1
                };
            });
        }

    }

    decreaseFollowers() {

        if (this.userMetadata()) {
            this.userMetadata.update((meta: UserMetadata | undefined) => {
                if (!meta) return meta; // or return undefined

                return {
                    ...meta,
                    followers: meta.followers - 1
                };
            });
        }

    }

    toggleFollowing() {

        if (this.following()) {

            this.userService.unfollowUser(this.username()).subscribe({
                next: () => {

                    this.following.set(false)
                    this.decreaseFollowers();

                }, error: err => {

                    if (err.error && typeof err.error === 'object' && err.error.message) {
                        console.log(err.error.message);
                        this.error.set(err.error.message);
                    } else {
                        console.log(err);
                        this.error.set("Something went wrong when following, please try again later.");
                    }

                }
            })

        } else {

            this.userService.followUser(this.username()).subscribe({
                next: () => {
                    this.following.set(true)
                    this.increaseFollowers();
                }, error: err => {

                    if (err.error && typeof err.error === 'object' && err.error.message) {
                        console.log(err.error.message);
                        this.error.set(err.error.message);
                    } else {
                        console.log(err);
                        this.error.set("Something went wrong when unfollowing, please try again later.");
                    }

                }
            })

        }

    }

}
