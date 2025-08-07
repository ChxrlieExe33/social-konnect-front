import { Component } from '@angular/core';
import {ProfileHeaderComponent} from '../../components/profile-header/profile-header.component';

@Component({
  selector: 'app-my-profile',
    imports: [
        ProfileHeaderComponent
    ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {

}
