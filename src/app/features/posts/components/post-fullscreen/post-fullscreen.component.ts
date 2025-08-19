import {Component, EventEmitter, HostListener, input, OnInit, Output, signal} from '@angular/core';
import {PostMedia} from '../../../../core/models/post-media';
import {PostMetaData} from '../../../../core/models/post-metadata.model';
import {PostWithLikedByMe} from '../../../../core/models/post-with-liked.model';
import {LikeService} from '../../services/like.service';
import {Router, RouterLink} from '@angular/router';
import {PostOptionsModalComponent} from '../post-options-modal/post-options-modal.component';
import {exhaustMap, Subject, takeUntil, tap} from 'rxjs';
import {AuthService} from '../../../../core/services/common/auth.service';
import {PostService} from '../../../../core/services/common/post.service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';

@Component({
  selector: 'app-post-fullscreen',
    imports: [
        RouterLink,
        PostOptionsModalComponent
    ],
    providers: [AutoDestroyService],
  templateUrl: './post-fullscreen.component.html',
  styleUrl: './post-fullscreen.component.css'
})
export class PostFullscreenComponent implements OnInit {

    postData = input.required<PostWithLikedByMe>();
    postMedia = input.required<PostMedia[]>();
    postMetadata = input.required<PostMetaData>();

    liked = signal<boolean>(false);

    menuOpen = signal<boolean>(false);
    postOwnedByCurrentUser = signal<boolean>(false);
    deletePost$ = new Subject<void>();

    @Output() likeAdded = new EventEmitter();
    @Output() likeRemoved = new EventEmitter();

    constructor(
        private readonly likeService: LikeService,
        private readonly authService: AuthService,
        private readonly postService: PostService,
        private readonly destroy$: AutoDestroyService,
        private readonly router: Router
    ) {
    }

    toggleMenu() {

        const currentStatus = this.menuOpen();
        this.menuOpen.set(!currentStatus);

    }

    ngOnInit(): void {

        this.subscribeToDeletePost();

        this.currentMediaIndex = 0;
        this.liked.set(this.postData().liked);

        if(this.postData().username === this.authService.getCurrentUsername()){
            this.postOwnedByCurrentUser.set(true);
        } else {
            this.postOwnedByCurrentUser.set(false);
        }

    }

    changeLikeStatus() {

        if(this.liked()){

            this.likeService.removeLikeFromPost(this.postData().postId).subscribe({
                next: () =>{
                    this.liked.set(false);
                    this.likeRemoved.emit();
                },
                error: () =>{
                    alert("Could not change like status");
                }
            });

        } else {

            this.likeService.addLikeToPost(this.postData().postId).subscribe({
                next: () =>{
                    this.liked.set(true);
                    this.likeAdded.emit();
                },
                error: () =>{
                    alert("Could not change like status");
                }
            });

        }

    }

    subscribeToDeletePost(): void {

        this.deletePost$.pipe(
            tap(() => this.toggleMenu()),
            takeUntil(this.destroy$),
            exhaustMap(() => {
                return this.postService.deletePostById(this.postData().postId);
            })
        ).subscribe({
            next: () =>{

                this.router.navigate(['/profile', 'me']);

            }, error: (err) => {

                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.log(err.error.message);
                    alert(err.error.message);
                } else {
                    console.log(err);
                    alert(err.message);
                }
            }
        });

    }

    // Methods for carousel

    // Add this property to your component class
    currentMediaIndex = 0;

    // Add these methods to your component class

    nextMedia(): void {
        if (this.postMedia() && this.currentMediaIndex < this.postMedia().length - 1) {
            this.currentMediaIndex++;
        }
    }

    previousMedia(): void {
        if (this.currentMediaIndex > 0) {
            this.currentMediaIndex--;
        }
    }

    goToMedia(index: number): void {
        if (this.postMedia() && index >= 0 && index < this.postMedia().length) {
            this.currentMediaIndex = index;
        }
    }


    // Optional: Add keyboard navigation
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'ArrowLeft') {
            this.previousMedia();
        } else if (event.key === 'ArrowRight') {
            this.nextMedia();
        }
    }

}
