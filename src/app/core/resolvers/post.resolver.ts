import {ResolveFn} from '@angular/router';
import {Post} from '../models/post.model';
import {Observable} from 'rxjs';
import {inject} from '@angular/core';
import {PostService} from '../services/common/post.service';

export const getPostDetailResolver : ResolveFn<Post> = (activatedRoute, routerState) : Observable<Post> => {

    const postService = inject(PostService);

    return postService.getPostByPostId(activatedRoute.params['postId']).pipe()

}
