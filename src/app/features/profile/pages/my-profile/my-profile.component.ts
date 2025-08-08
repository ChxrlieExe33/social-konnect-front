import {Component, OnInit, signal} from '@angular/core';
import {ProfileHeaderComponent} from '../../components/profile-header/profile-header.component';
import {UserProfile} from '../../../../core/models/user-profile.model';
import {UserService} from '../../services/user.service';
import {PostService} from '../../../../core/services/common/post.service';
import {Post} from '../../../../core/models/post.model';
import {PostListComponent} from '../../../../shared/components/post-list/post-list.component';
import {AuthService} from '../../../../core/services/common/auth.service';

@Component({
  selector: 'app-my-profile',
    imports: [
        ProfileHeaderComponent,
        PostListComponent
    ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {

    loadedProfile = signal<UserProfile | undefined>(undefined);
    error = signal<string | undefined>(undefined);

    userPosts = signal<Post[]>([]);

    constructor(
        private userService: UserService,
        private postsService: PostService,
        private authService: AuthService
    ) {}

    ngOnInit() {

        this.subscribeToProfileData();
        this.subscribeToPosts();

    }

    subscribeToProfileData() {

        this.userService.getCurrentUser().subscribe({
            next: (data) => {
                this.loadedProfile.set(data);
                console.log(this.loadedProfile());
            },
            error: (err) => {
                // Check to make sure the body of the custom error dto was actually sent
                if (err.error && typeof err.error === 'object') {
                this.error.set(err.error.message);
                } else {
                this.error.set("An unknown error has occurred.");
                }
            }
        });

    }

    subscribeToPosts() {

        this.postsService.getPostsByUsername(this.authService.getCurrentUsername()).subscribe({

            next: (data) => {
                this.userPosts.set(data);
            },
            error: (err) => {
                // Check to make sure the body of the custom error dto was actually sent
                if (err.error && typeof err.error === 'object') {
                    this.error.set(err.error.message);
                } else {
                    this.error.set("An unknown error has occurred.");
                }
            }

        })

    }



}
