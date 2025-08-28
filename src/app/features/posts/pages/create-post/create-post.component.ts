import {Component, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {exhaustMap, Subject} from 'rxjs';
import {PostService} from '../../../../core/services/common/post.service';
import {Post} from '../../../../core/models/post/post.model';
import {PostWithLikedByMe} from '../../../../core/models/post/post-with-liked.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-post',
    imports: [
        FormsModule
    ],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent implements OnInit {

    protected selectedFiles : File[] = [];
    protected caption = signal<string>('');
    protected submitted$ = new Subject<void>();

    protected error = signal<string | undefined>(undefined);

    constructor(private postService: PostService, private router: Router) {}

    ngOnInit() {

        this.subscribeToSubmit()

    }

    subscribeToSubmit() {

        this.submitted$.pipe(
            exhaustMap(val => {
                const postData = this.prepareFormData(this.caption(), this.selectedFiles);
                return this.postService.createNewPost(postData);
            })
        ).subscribe({
            next: (post: Post) => {

                // Map to the correct type for state.
                const postWithNoLikes: PostWithLikedByMe = {
                    postId: post.postId,
                    caption: post.caption,
                    media: post.media,
                    username: post.username,
                    createdAt: post.createdAt,
                    profilePictureUrl: post.profilePictureUrl,
                    liked: false
                };

                this.postService.appendCreatedPostToExploreFeed(postWithNoLikes);

                this.router.navigate(['/profile', 'me']);


            }, error: (err) => {

                if (err.error && typeof err.error === 'object' && err.error.message) {
                    this.error.set(err.error.message);
                } else {
                    this.error.set("Something went wrong when fetching explore posts, please try again later.");
                }

            }
        });

    }

    onFileSelect(event: Event) {

        const input = event.target as HTMLInputElement;

        if(input.files) {
            this.selectedFiles = Array.from(input.files);
        }

    }

    removeFile(index: number) {
        this.selectedFiles.splice(index, 1);
    }

    prepareFormData(caption: string, files: File[]) : FormData {

        const formData = new FormData();

        formData.append('caption', caption);

        this.selectedFiles.forEach((file) => {
            formData.append('files', file);
        })

        return formData;

    }

}
