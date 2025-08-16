import {Component, input} from '@angular/core';
import {UserProfile} from '../../../../core/models/user-profile.model';

@Component({
  selector: 'app-other-user-profile-header',
  imports: [],
  templateUrl: './other-user-profile-header.component.html',
  styleUrl: './other-user-profile-header.component.css'
})
export class OtherUserProfileHeaderComponent {

    profile = input.required<UserProfile>();

}
