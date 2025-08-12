import {ResolveFn, Router} from '@angular/router';
import {catchError, Observable, of} from 'rxjs';
import {inject} from '@angular/core';
import {PostService} from '../services/common/post.service';
import {PostWithLikedByMe} from '../models/post-with-liked.model';

export const getPostDetailResolver : ResolveFn<PostWithLikedByMe | undefined> = (activatedRoute, routerState) : Observable<PostWithLikedByMe | undefined> => {

    const postService = inject(PostService);
    const router = inject(Router)

    return postService.getPostByPostId(activatedRoute.params['postId']).pipe(
        catchError(err => {
            router.navigate(['/posts', 'not-found']);

            return of(undefined);
        })
    )

}
