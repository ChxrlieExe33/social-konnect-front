import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Comment} from '../../../core/models/comment.model';
import {environment} from '../../../../environments/environment';
import {map, Observable} from 'rxjs';
import {CreateCommentDTO} from '../../../core/models/new-comment';

type CommentResponse = {
    content: Comment[],
    page: {
        number: number,
        size: number,
        totalElements: number,
        totalPages: number
    }
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {

    constructor(
        private httpClient: HttpClient
    ) { }

    getCommentsByPostId(postId: string) : Observable<Comment[]> {

        return this.httpClient.get<CommentResponse>(`${environment.backendBaseUrl}/api/comment/${postId}`).pipe(
            map(response => response.content),
        );

    }

    createNewComment(comment: CreateCommentDTO): Observable<Comment> {

        return this.httpClient.post<Comment>(`${environment.backendBaseUrl}/api/comment`, comment);

    }

    deleteComment(id: string) : Observable<void> {

        return this.httpClient.delete<void>(`${environment.backendBaseUrl}/api/comment/${id}`)

    }

}
