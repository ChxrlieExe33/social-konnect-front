import {Component, input} from '@angular/core';
import {PostComponent} from '../post/post.component';
import {PostWithLikedByMe} from '../../../core/models/post-with-liked.model';

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

}
