import {Component, OnInit, signal} from '@angular/core';
import {PostMetaData} from '../../../../core/models/post/post-metadata.model';
import {ActivatedRoute} from '@angular/router';
import {PostMedia} from '../../../../core/models/post/post-media';
import {PostFullscreenComponent} from '../../components/post-fullscreen/post-fullscreen.component';
import {PostService} from '../../../../core/services/common/post.service';
import {CommentListComponent} from '../../components/comment-list/comment-list.component';
import {catchError, map, of, switchMap, takeUntil} from 'rxjs';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {PostWithLikedByMe} from '../../../../core/models/post/post-with-liked.model';

@Component({
  selector: 'app-post-detail-page',
    imports: [
        PostFullscreenComponent,
        CommentListComponent
    ],
    providers: [AutoDestroyService],
  templateUrl: './post-detail-page.component.html',
  styleUrl: './post-detail-page.component.css'
})
export class PostDetailPageComponent implements OnInit {

    postData = signal<PostWithLikedByMe | undefined>(undefined);
    postMedia = signal<PostMedia[]>([]);
    error = signal<string | undefined>(undefined);

    postMetadata = signal<PostMetaData>({
        post_id: '',
        likes: 0,
        comments: 0,
    });

    constructor(private activatedRoute: ActivatedRoute, private postService : PostService, private destroy$ : AutoDestroyService) {}

    ngOnInit() {

        this.getPostDataAndSubscribeToMetadata()

    }

    getPostDataAndSubscribeToMetadata() {

        this.activatedRoute.data.pipe(
            takeUntil(this.destroy$),
            switchMap(routeData => {

                const post : PostWithLikedByMe = routeData['postData'];

                this.postData.set(post);
                this.postMedia.set(post.media);

                return this.postService.getPostMetadataByPostId(post.postId).pipe(
                    takeUntil(this.destroy$),
                    map(metadata => ({post, metadata})),
                    catchError(err => {

                        if (err.error && typeof err.error === 'object' && err.error.message) {
                            console.log(err.error.message);
                            this.error.set(err.error.message);
                        } else {
                            console.log(err);
                            this.error.set("Something went wrong when fetching like and comment count, please try again later.");
                        }

                        return of({post, metadata : null});

                    })
                );
            })
        ).subscribe({
            next: ({post, metadata}) => {

                if(metadata) {
                    this.postMetadata.set(metadata);
                }
            },
            error: err => {

            }
        })

    }

    /**
     * Triggered when a new comment created successfully event happens in the comment list.
     */
    increaseCommentCountOnNewComment() {

        if (this.postMetadata()) {

            const prevComments = this.postMetadata()!.comments;

            this.postMetadata.update((meta : PostMetaData) => ({
                ...meta,
                comments: prevComments + 1
            }))

        }
    }

    decreaseCommentCountWhenDeleteComment() {

        if (this.postMetadata()) {

            const prevComments = this.postMetadata()!.comments;

            this.postMetadata.update((meta : PostMetaData) => ({
                ...meta,
                comments: prevComments - 1
            }))

        }

    }

    increaseLikeCountOnNewLike() {

        if (this.postMetadata()) {

            const prevLikes = this.postMetadata()!.likes;

            this.postMetadata.update((meta : PostMetaData) => ({
                ...meta,
                likes: prevLikes + 1
            }))

        }

    }

    decreaseLikeCountOnRemovedLike() {

        if (this.postMetadata()) {

            const prevLikes = this.postMetadata()!.likes;

            this.postMetadata.update((meta : PostMetaData) => ({
                ...meta,
                likes: prevLikes - 1
            }))

        }

    }
}
