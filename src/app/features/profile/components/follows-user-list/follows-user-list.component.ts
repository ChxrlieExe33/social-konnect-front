import {Component, EventEmitter, input, Output} from '@angular/core';
import {UsernameAndPfp} from '../../services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-follows-user-list',
  imports: [],
  templateUrl: './follows-user-list.component.html',
  styleUrl: './follows-user-list.component.css'
})
export class FollowsUserListComponent {

    users = input.required<UsernameAndPfp[]>();
    displayGetMoreUsersButton = input.required<boolean>();

    listTitle = input.required<string>();

    @Output() getMoreUsersClicked = new EventEmitter<void>();

    constructor(private readonly router : Router) {}

    loadMoreClicked() {

        this.getMoreUsersClicked.emit();

    }

    navigateToUserPage(username : string) {

        this.router.navigate(['/profile','user',username]).then(() => {});

    }

}
