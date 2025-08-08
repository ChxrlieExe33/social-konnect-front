import {Component, OnInit, signal} from '@angular/core';
import {ProfileHeaderComponent} from '../../components/profile-header/profile-header.component';
import {UserProfile} from '../../../../core/models/user-profile.model';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-my-profile',
    imports: [
        ProfileHeaderComponent
    ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {

    loadedProfile = signal<UserProfile | undefined>(undefined);
    error = signal<string | null>(null);

    constructor(
        private userService: UserService
    ) {}

    ngOnInit() {

        this.userService.getCurrentUser().subscribe({
            next: (data) => {
                this.loadedProfile.set(data);
                console.log(this.loadedProfile());
            },
            error: (err) => {

                // Check to make sure the body of the custom error dto was actually sent
                if (err.error && typeof err.error === 'object') {
                    this.error.set(err.error.message);
                } else {
                    this.error.set("An unknown error has occurred.");
                }

            }
        });

    }

}
