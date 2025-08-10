import {Component, input} from '@angular/core';
import {Comment} from '../../../../core/models/comment.model';
import {TimeAgoPipe} from '../../../../core/pipes/time-ago-pipe';

@Component({
  selector: 'app-comment',
  imports: [TimeAgoPipe],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {

    data = input.required<Comment>();


}
