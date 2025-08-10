import {Component, OnInit, signal} from '@angular/core';
import {Post} from '../../../../core/models/post.model';
import {ActivatedRoute} from '@angular/router';
import {PostMedia} from '../../../../core/models/post-media';
import {PostFullscreenComponent} from '../../components/post-fullscreen/post-fullscreen.component';
import {PostService} from '../../../../core/services/common/post.service';
import {PostMetaData} from '../../../../core/models/post-metadata.model';
import {CommentListComponent} from '../../components/comment-list/comment-list.component';

@Component({
  selector: 'app-post-detail-page',
    imports: [
        PostFullscreenComponent,
        CommentListComponent
    ],
  templateUrl: './post-detail-page.component.html',
  styleUrl: './post-detail-page.component.css'
})
export class PostDetailPageComponent implements OnInit {

    postData = signal<Post | undefined>(undefined);
    postMedia = signal<PostMedia[]>([]);
    postMetadata = signal<PostMetaData | undefined>(undefined);

    constructor(private activatedRoute: ActivatedRoute, private postService : PostService) {}

    ngOnInit() {

        this.subscribeToPostDDataFromResolver()

    }

    subscribeToPostDDataFromResolver() {

        this.activatedRoute.data.subscribe(data => {
            this.postData.set(data['postData']);
            this.postMedia.set(this.postData()!.media)
            this.subscribeToPostMetadata();
        })

    }

    subscribeToPostMetadata() {

        this.postService.getPostMetadataByPostId(this.postData()!.postId).subscribe(data => {
            this.postMetadata.set(data);
        })

    }
}
