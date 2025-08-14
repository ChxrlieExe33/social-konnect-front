import {Component, EventEmitter, HostListener, input, OnInit, Output, signal} from '@angular/core';
import {PostMedia} from '../../../../core/models/post-media';
import {PostMetaData} from '../../../../core/models/post-metadata.model';
import {PostWithLikedByMe} from '../../../../core/models/post-with-liked.model';
import {LikeService} from '../../services/like.service';

@Component({
  selector: 'app-post-fullscreen',
  imports: [],
  templateUrl: './post-fullscreen.component.html',
  styleUrl: './post-fullscreen.component.css'
})
export class PostFullscreenComponent implements OnInit {

    postData = input.required<PostWithLikedByMe>();
    postMedia = input.required<PostMedia[]>();
    postMetadata = input.required<PostMetaData>();

    liked = signal<boolean>(false);

    @Output() likeAdded = new EventEmitter();
    @Output() likeRemoved = new EventEmitter();

    constructor(
        private readonly likeService: LikeService,
    ) {
    }

    ngOnInit(): void {

        this.currentMediaIndex = 0;
        this.liked.set(this.postData().liked);

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
