import {Component, EventEmitter, input, OnInit, Output, signal} from '@angular/core';
import {CommentService} from '../../services/comment.service';
import { Comment } from '../../../../core/models/post/comment.model';
import { CreateCommentDTO } from '../../../../core/models/post/new-comment';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {exhaustMap, filter, Subject, takeUntil} from 'rxjs';
import {CommentComponent} from '../comment/comment.component';
import {AuthService} from '../../../../core/services/common/auth.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-comment-list',
    imports: [
        CommentComponent,
        FormsModule
    ],
    providers: [AutoDestroyService],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css'
})
export class CommentListComponent implements OnInit {

    protected comments = signal<Comment[]>([]);
    protected error = signal<string | undefined>(undefined);
    protected currentUsername = signal<string | undefined>(undefined);

    postId = input.required<string>();

    protected newCommentContent = signal<string>('');
    protected newCommentError = signal<string | undefined>(undefined);

    @Output() createdComment: EventEmitter<void> = new EventEmitter();
    @Output() deletedComment: EventEmitter<void> = new EventEmitter();

    protected nextPage = signal<number>(0);
    protected nextPageExists = signal<boolean>(true);
    protected getMoreComments$ = new Subject<void>();

    constructor(
        private commentService: CommentService,
        private destroy$: AutoDestroyService,
        private authService: AuthService
    )
    {}

    ngOnInit() {

        this.subscribeToComments();
        this.subscribeToGetMoreComments();
        this.currentUsername.set(this.authService.getCurrentUsername());

    }

    subscribeToComments() {

        this.commentService.getCommentsByPostId(this.postId(), this.nextPage()).pipe(takeUntil(this.destroy$)).subscribe({
            next: comments => {
                this.comments.set(comments.content);

                if (this.nextPage() + 1 === comments.page.totalPages || comments.content.length === 0) {

                    console.log("No more comment pages")
                    this.nextPageExists.set(false);
                } else {

                    console.log("There is more comment pages");
                    const currentPage = this.nextPage();
                    this.nextPage.set(currentPage + 1);
                }
            },
            error: err => {

                // Check to make sure the body of the custom error dto was actually sent
                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.log(err.error.message);
                    this.error.set(err.error.message);
                } else {
                    console.log(err);
                    this.error.set("Something went wrong fetching the comments, please try again later.");
                }

            }
        })

    }

    subscribeToGetMoreComments() {

        this.getMoreComments$.pipe(
            takeUntil(this.destroy$),
            filter(() => this.nextPageExists()),
            exhaustMap(() => {
                return this.commentService.getCommentsByPostId(this.postId(), this.nextPage()).pipe(takeUntil(this.destroy$))
            })
        ).subscribe({
            next: comments => {

                const currentComments = this.comments();
                this.comments.set([...currentComments, ...comments.content]);

                if (this.nextPage() + 1 === comments.page.totalPages){

                    console.log("No more comment pages")
                    this.nextPageExists.set(false);
                } else {

                    console.log("There is more comment pages");
                    const currentPage = this.nextPage();
                    this.nextPage.set(currentPage + 1);
                }
            }
        })

    }

    submitNewComment(form: HTMLFormElement) {

        this.newCommentError.set(undefined);

        const dto : CreateCommentDTO = {
            content: this.newCommentContent(),
            post_id: this.postId()
        }

        if (this.newCommentContent().length < 1) {

            this.newCommentError.set("Your comment must be at least 1 character.");
            return;

        }

        this.commentService.createNewComment(dto).pipe(takeUntil(this.destroy$)).subscribe({
            next: comment => {
                this.comments.set([comment, ...this.comments()])
                this.createdComment.emit();
                form.reset()
            },
            error: err => {

                // Check to make sure the body of the custom error dto was actually sent
                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.log(err.error.message);
                    this.newCommentError.set(err.error.message);
                } else {
                    console.log(err);
                    this.newCommentError.set("Something went wrong when posting your comment, please try again later.");
                }

            }
        })

    }

    removeDeletedComment(commentId : string) {

        this.comments.update(comments => comments.filter((comment) => comment.commentId !== commentId));

        this.deletedComment.emit();

    }


}
