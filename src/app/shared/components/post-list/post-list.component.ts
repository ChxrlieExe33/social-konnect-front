import {Component, computed, EventEmitter, input, OnInit, Output, signal} from '@angular/core';
import {PostComponent} from '../post/post.component';
import {PostWithLikedByMe} from '../../../core/models/post-with-liked.model';
import {PostService} from '../../../core/services/common/post.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-post-list',
    imports: [
        PostComponent
    ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {

    posts = input.required<PostWithLikedByMe[]>();
    listTitle = input<string | undefined>(undefined);
    error = input<string | undefined>(undefined);
    displayNextPageButton = input.required<boolean>();

    constructor(protected postService: PostService, private readonly router : Router) { }

    @Output() loadMorePosts = new EventEmitter<void>();

    loadMore(){
        this.loadMorePosts.emit();
    }

    removePost(postId : string) {

        const updatedPosts = this.posts().filter(post => post.postId !== postId);

        this.postService.removePostFromExploreAndFollowingAfterDelete(postId);

        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
        });

    }

}
