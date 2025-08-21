import {Component, OnInit, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AutoDestroyService} from '../../../core/services/utils/auto-destroy.service';
import {UserService} from '../../../features/profile/services/user.service';
import {AuthService} from '../../../core/services/common/auth.service';
import {takeUntil} from 'rxjs';

@Component({
  selector: 'app-bottom-navbar',
    imports: [
        RouterLink,
        RouterLinkActive
    ],
    providers: [AutoDestroyService],
  templateUrl: './bottom-navbar.component.html',
  styleUrl: './bottom-navbar.component.css'
})
export class BottomNavbarComponent implements OnInit {

    protected profilePictureUrl = signal<string | undefined>(undefined);

    constructor(
        private readonly userService : UserService,
        private readonly authService : AuthService,
        private readonly destroy$: AutoDestroyService) {}


    ngOnInit() {

        this.subscribeToProfilePicture()

    }

    subscribeToProfilePicture(){

        this.userService.getProfilePictureByUsername(this.authService.getCurrentUsername()).pipe(takeUntil(this.destroy$)).subscribe({
            next: data => {
                this.profilePictureUrl.set(data.profilePictureUrl);
            }
        })

    }
}
