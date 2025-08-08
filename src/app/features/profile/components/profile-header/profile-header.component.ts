import {Component, input} from '@angular/core';
import {UserProfile} from '../../../../core/models/user-profile.model';

@Component({
  selector: 'app-profile-header',
  imports: [],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css'
})
export class ProfileHeaderComponent {

    profile = input.required<UserProfile>();

}
