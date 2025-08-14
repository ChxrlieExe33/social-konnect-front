import {Component, input} from '@angular/core';
import {UserProfile} from '../../../../core/models/user-profile.model';
import {AuthService} from '../../../../core/services/common/auth.service';

@Component({
  selector: 'app-profile-header',
  imports: [],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css'
})
export class ProfileHeaderComponent {

    profile = input.required<UserProfile>();

    constructor(private authService: AuthService) {}

    protected logOutClicked() {

        const confirmed : boolean = confirm('Are you sure you want to logout?');

        if (confirmed) {
            this.authService.logout();
        } else {
            return;
        }

    }

}
