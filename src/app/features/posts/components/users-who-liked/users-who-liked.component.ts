import {Component, EventEmitter, input, Output} from '@angular/core';
import {UsernameAndPfp} from '../../../profile/services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-users-who-liked',
  imports: [],
  templateUrl: './users-who-liked.component.html',
  styleUrl: './users-who-liked.component.css'
})
export class UsersWhoLikedComponent {

    users = input.required<UsernameAndPfp[]>();
    displayGetMoreUsersButton = input.required<boolean>();

    @Output() getMoreUsersClicked = new EventEmitter<void>();

    constructor(private readonly router : Router) {}

    loadMoreClicked() {

        this.getMoreUsersClicked.emit();

    }

    navigateToUserPage(username : string) {

        this.router.navigate(['/profile','user',username]).then(() => {});

    }
}
