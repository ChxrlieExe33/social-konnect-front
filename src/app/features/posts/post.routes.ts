import {Routes} from '@angular/router';
import {PostDetailPageComponent} from './pages/post-detail-page/post-detail-page.component';
import {getPostDetailResolver} from '../../core/resolvers/post.resolver';
import {PostNotFoundComponent} from './pages/post-not-found/post-not-found.component';
import {CreatePostComponent} from './pages/create-post/create-post.component';
import {UpdatePostComponent} from './pages/update-post/update-post.component';
import {PostLikesComponent} from './pages/post-likes/post-likes.component';

export const postRoutes : Routes = [
    {
        path: "detail/:postId",
        component: PostDetailPageComponent,
        resolve: {
            postData: getPostDetailResolver
        }
    },
    {
        path: "update/:postId",
        component: UpdatePostComponent,
        resolve: {
            postData: getPostDetailResolver
        }
    },
    {
        path: "not-found",
        component: PostNotFoundComponent
    },
    {
        path: "likes/:postId",
        component: PostLikesComponent,
    },
    {
        path: 'create',
        component: CreatePostComponent
    }
]
