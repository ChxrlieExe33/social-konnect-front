import {Component, OnInit, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AutoDestroyService} from '../../../core/services/utils/auto-destroy.service';
import {UserService} from '../../../features/profile/services/user.service';
import {AuthService} from '../../../core/services/common/auth.service';
import {takeUntil} from 'rxjs';

@Component({
  selector: 'app-vertical-navbar',
    imports: [
        RouterLink,
        RouterLinkActive
    ],
    providers: [AutoDestroyService],
  templateUrl: './vertical-navbar.component.html',
  styleUrl: './vertical-navbar.component.css'
})
export class VerticalNavbarComponent implements OnInit {

    protected username = signal<string | undefined>(undefined);
    protected profilePictureUrl = signal<string | undefined>(undefined);

    constructor(
        private readonly userService : UserService,
        private readonly authService : AuthService,
        private readonly destroy$: AutoDestroyService) {}


    ngOnInit() {

        this.username.set(this.authService.getCurrentUsername());
        this.subscribeToProfilePicture()

    }

    subscribeToProfilePicture(){

        this.userService.getProfilePictureByUsername(this.username()!).pipe(takeUntil(this.destroy$)).subscribe({
            next: data => {
                this.profilePictureUrl.set(data.profilePictureUrl);
            }
        })

    }
}
