import {PostMedia} from './post-media';

export type Post = {
    postId: string,
    caption: string,
    media: PostMedia[],
    username: string,
    createdAt: Date,
    profilePictureUrl: string,
}
