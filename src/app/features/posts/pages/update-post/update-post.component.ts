import {Component, HostListener, input, OnInit, signal} from '@angular/core';
import {PostWithLikedByMe} from '../../../../core/models/post/post-with-liked.model';
import {PostMedia} from '../../../../core/models/post/post-media';
import {AuthService} from '../../../../core/services/common/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {catchError, exhaustMap, of, Subject, takeUntil, tap} from 'rxjs';
import {PostService} from '../../../../core/services/common/post.service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-update-post',
    imports: [
        ReactiveFormsModule,
        FormsModule
    ],
    providers: [AutoDestroyService],
  templateUrl: './update-post.component.html',
  styleUrl: './update-post.component.css'
})
export class UpdatePostComponent implements OnInit {

    postData = input.required<PostWithLikedByMe>();
    postMedia = signal<PostMedia[]>([]);

    postOwnedByCurrentUser = signal<boolean>(false);

    updatedCaption = signal<string>('');

    error = signal<string | undefined>(undefined);

    submitted$ = new Subject<void>();

    currentMediaIndex = 0;

    constructor(
       private readonly authService: AuthService,
       private readonly postService: PostService,
       private readonly destroy$: AutoDestroyService,
       private readonly router: Router
    ) {}

    ngOnInit() {

        this.subscribeToSubmit();

        this.postMedia.set(this.postData().media);

        if(this.postData().username === this.authService.getCurrentUsername()){
            this.postOwnedByCurrentUser.set(true);
        } else {
            this.postOwnedByCurrentUser.set(false);
        }

        this.updatedCaption.set(this.postData().caption);
    }

    subscribeToSubmit() {

        this.submitted$.pipe(
            tap(() => this.error.set(undefined)),
            takeUntil(this.destroy$),
            exhaustMap(() => {
                return this.postService.updatePostCaption(this.updatedCaption(), this.postData().postId).pipe(
                    takeUntil(this.destroy$),
                    map(result => ({success: true as const, result: result})),
                    catchError(err => {
                        return of({success: false as const, error: err}); // Cast it as an object to avoid the inner observable stopping the chain on error.
                    })
                )
            })
        ).subscribe({
            next: data => {

                if (data.success) {

                    this.router.navigate(['/posts', 'detail', this.postData().postId]);

                } else {

                    const err = data.error;

                    if (err.error && typeof err.error === 'object' && err.error.message) {
                        console.warn(err.error.message);
                        this.error.set(err.error.message);
                    } else {
                        console.warn(err);
                        this.error.set("Something went wrong when updating this caption, please try again later.");
                    }

                }

            }
        })

    }



    // Carousel functionality.

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

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'ArrowLeft') {
            this.previousMedia();
        } else if (event.key === 'ArrowRight') {
            this.nextMedia();
        }
    }

}
