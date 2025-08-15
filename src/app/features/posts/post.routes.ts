import {Routes} from '@angular/router';
import {PostDetailPageComponent} from './pages/post-detail-page/post-detail-page.component';
import {getPostDetailResolver} from '../../core/resolvers/post.resolver';
import {PostNotFoundComponent} from './pages/post-not-found/post-not-found.component';
import {CreatePostComponent} from './pages/create-post/create-post.component';

export const postRoutes : Routes = [
    {
        path: "detail/:postId",
        component: PostDetailPageComponent,
        resolve: {
            postData: getPostDetailResolver
        }
    },
    {
        path: "not-found",
        component: PostNotFoundComponent
    },
    {
        path: 'create',
        component: CreatePostComponent
    }
]
