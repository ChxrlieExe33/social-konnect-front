import {Component, input, OnInit, signal} from '@angular/core';
import {Post} from '../../../core/models/post.model';
import {PostMedia} from '../../../core/models/post-media';
import {Router} from '@angular/router';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css'
})
export class PostComponent implements OnInit {

    postData = input.required<Post>();
    postMedia? = signal<PostMedia[]>([]);

    constructor(private router: Router){}

    ngOnInit(): void {

        if(this.postData().media){
            this.postMedia!.set(this.postData().media);
        }

    }

    navigateToPostDetail() {

        this.router.navigate(['/posts', 'detail', this.postData().postId]);

    }

}
