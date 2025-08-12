import {Component, input, OnInit, signal} from '@angular/core';
import {Post} from '../../../core/models/post.model';
import {PostMedia} from '../../../core/models/post-media';
import {Router} from '@angular/router';
import {PostWithLikedByMe} from '../../../core/models/post-with-liked.model';
import {LikeService} from '../../../features/posts/services/like.service';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {

    postData = input.required<PostWithLikedByMe>();
    postMedia? = signal<PostMedia[]>([]);

    liked = signal<boolean>(false);

    constructor(
        private readonly router: Router,
        private readonly likeService: LikeService,
    ){}

    ngOnInit(): void {

        if(this.postData().media){
            this.postMedia!.set(this.postData().media);
        }

        // Set a separate boolean signal since the input signal is readonly.
        this.liked.set(this.postData().liked);

    }

    navigateToPostDetail() {

        this.router.navigate(['/posts', 'detail', this.postData().postId]);

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

}
