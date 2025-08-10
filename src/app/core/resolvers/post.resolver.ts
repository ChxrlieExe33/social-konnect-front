import {ResolveFn, Router} from '@angular/router';
import {Post} from '../models/post.model';
import {catchError, Observable, of} from 'rxjs';
import {inject} from '@angular/core';
import {PostService} from '../services/common/post.service';

export const getPostDetailResolver : ResolveFn<Post | undefined> = (activatedRoute, routerState) : Observable<Post | undefined> => {

    const postService = inject(PostService);
    const router = inject(Router)

    return postService.getPostByPostId(activatedRoute.params['postId']).pipe(
        catchError(err => {
            router.navigate(['/posts', 'not-found']);

            return of(undefined);
        })
    )

}
