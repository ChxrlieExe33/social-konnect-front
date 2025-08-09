import {Routes} from '@angular/router';
import {PostDetailPageComponent} from './pages/post-detail-page/post-detail-page.component';
import {getPostDetailResolver} from '../../core/resolvers/post.resolver';

export const postRoutes : Routes = [
    {
        path: "detail/:postId",
        component: PostDetailPageComponent,
        resolve: {
            postData: getPostDetailResolver
        }
    }
]
