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
import {takeUntil} from 'rxjs';

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

    constructor(
        private userService: UserService,
        private postsService: PostService,
        private authService: AuthService,
        private destroy$: AutoDestroyService
    ) {}

    ngOnInit() {

        this.subscribeToProfileData();
        this.subscribeToPosts();
        this.subscribeToUserMetadata();

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

    subscribeToPosts() {

        this.postsService.getPostsByUsername(this.authService.getCurrentUsername()).pipe(
            takeUntil(this.destroy$),
        ).subscribe({

            next: (data) => {
                this.userPosts.set(data);
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
