import {Component, input, signal} from '@angular/core';
import {Post} from '../../../../core/models/post.model';
import {PostMedia} from '../../../../core/models/post-media';
import {PostMetaData} from '../../../../core/models/post-metadata.model';

@Component({
  selector: 'app-post-fullscreen',
  imports: [],
  templateUrl: './post-fullscreen.component.html',
  styleUrl: './post-fullscreen.component.css'
})
export class PostFullscreenComponent {

    postData = input.required<Post>();
    postMedia = input.required<PostMedia[]>();
    postMetadata = input.required<PostMetaData>();

}
