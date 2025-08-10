import {Component, EventEmitter, input, OnInit, Output, signal} from '@angular/core';
import {Comment} from '../../../../core/models/comment.model';
import {TimeAgoPipe} from '../../../../core/pipes/time-ago-pipe';
import {AuthService} from '../../../../core/services/common/auth.service';
import {CommentService} from '../../services/comment.service';
import {take, takeUntil} from 'rxjs';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';

@Component({
  selector: 'app-comment',
  imports: [TimeAgoPipe],
    providers: [AutoDestroyService],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit {

    data = input.required<Comment>();
    protected commentOwnedByCurrentUser = signal<boolean>(false);

    // Emits the deleted comment ID.
    @Output() commentDeleted: EventEmitter<string> = new EventEmitter();

    constructor(private authService: AuthService, private commentService : CommentService, private destroy$: AutoDestroyService) {}

    ngOnInit() {

        if (this.authService.getCurrentUsername() == this.data().username) {
            this.commentOwnedByCurrentUser.set(true);
        }

    }

    deleteComment() {

        this.commentService.deleteComment(this.data().commentId).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.commentDeleted.emit(this.data().commentId);
            },
            error: err => {
                // Check to make sure the body of the custom error dto was actually sent
                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.log(err.error.message);
                    alert(err.error.message);
                } else {
                    console.log(err);
                    alert("Could not delete comment, something went wrong.")
                }
            }
        })

    }

}
