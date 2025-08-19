import {PostMedia} from './post-media';

export type PostWithLikedByMe = {
    postId: string,
    caption: string,
    media: PostMedia[],
    username: string,
    createdAt: Date,
    profilePictureUrl: string,
    liked: boolean,
}
