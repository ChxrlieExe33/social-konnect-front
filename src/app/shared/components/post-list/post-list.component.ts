import {Component, input} from '@angular/core';
import {Post} from '../../../core/models/post.model';
import {PostComponent} from '../post/post.component';

@Component({
  selector: 'app-post-list',
    imports: [
        PostComponent
    ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {

    posts = input.required<Post[]>();
    listTitle = input<string | undefined>(undefined);
    error = input<string | undefined>(undefined);

}
