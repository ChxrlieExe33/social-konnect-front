import {Component, EventEmitter, HostListener, input, OnInit, Output, signal, ViewContainerRef} from '@angular/core';
import {PostMedia} from '../../../core/models/post/post-media';
import {Router, RouterLink} from '@angular/router';
import {PostWithLikedByMe} from '../../../core/models/post/post-with-liked.model';
import {LikeService} from '../../../features/posts/services/like.service';
import {
    PostOptionsModalComponent
} from '../../../features/posts/components/post-options-modal/post-options-modal.component';
import {AuthService} from '../../../core/services/common/auth.service';
import {exhaustMap, Subject, takeUntil, tap} from 'rxjs';
import {AutoDestroyService} from '../../../core/services/utils/auto-destroy.service';
import {PostService} from '../../../core/services/common/post.service';
import {TimeAgoPipe} from '../../../core/pipes/time-ago-pipe';

@Component({
  selector: 'app-post',
    imports: [
        RouterLink,
        PostOptionsModalComponent,
        TimeAgoPipe
    ],
    providers: [AutoDestroyService],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {

    postData = input.required<PostWithLikedByMe>();
    postMedia = signal<PostMedia[]>([]);

    liked = signal<boolean>(false);

    menuOpen = signal<boolean>(false);

    postOwnedByCurrentUser = signal<boolean>(false);

    @Output() removePost = new EventEmitter<string>();

    deletePost$ = new Subject<void>();

    constructor(
        private readonly router: Router,
        private readonly likeService: LikeService,
        private readonly authService : AuthService,
        private readonly destroy$: AutoDestroyService,
        private readonly postService: PostService,
        private viewContainerRef: ViewContainerRef
    ){}

    ngOnInit(): void {

        this.subscribeToDeletePost();

        this.currentMediaIndex = 0;

        if(this.postData().media){
            this.postMedia!.set(this.postData().media);
        }

        // Set a separate boolean signal since the input signal is readonly.
        this.liked.set(this.postData().liked);

        if(this.postData().username === this.authService.getCurrentUsername()){
            this.postOwnedByCurrentUser.set(true);
        }

    }

    navigateToPostDetail() {

        this.router.navigate(['/posts', 'detail', this.postData().postId]);

    }

    toggleMenu() {

        const currentStatus = this.menuOpen();
        this.menuOpen.set(!currentStatus);

    }

    changeLikeStatus() {

        if(this.liked()){

            this.likeService.removeLikeFromPost(this.postData().postId).subscribe({
                next: () =>{
                    this.liked.set(false);
                },
                error: () =>{
                    alert("Could not change like status");
                }
            });

        } else {

            this.likeService.addLikeToPost(this.postData().postId).subscribe({
                next: () =>{
                    this.liked.set(true);
                },
                error: () =>{
                    alert("Could not change like status");
                }
            });

        }

    }

    // Logic for carousel

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

    subscribeToDeletePost(): void {

        this.deletePost$.pipe(
            tap(() => this.toggleMenu()),
            takeUntil(this.destroy$),
            exhaustMap(() => {
                return this.postService.deletePostById(this.postData().postId);
            })
        ).subscribe({
            next: () =>{

                this.removePost.emit(this.postData().postId);

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
