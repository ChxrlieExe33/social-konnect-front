import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
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

    getCommentsByPostId(postId: string, page: number) : Observable<CommentResponse> {

        const params = new HttpParams().append('page', page);

        return this.httpClient.get<CommentResponse>(`${environment.backendBaseUrl}/api/comment/${postId}`, {params},);

    }

    createNewComment(comment: CreateCommentDTO): Observable<Comment> {

        return this.httpClient.post<Comment>(`${environment.backendBaseUrl}/api/comment`, comment);

    }

    deleteComment(id: string) : Observable<void> {

        return this.httpClient.delete<void>(`${environment.backendBaseUrl}/api/comment/${id}`)

    }

}
