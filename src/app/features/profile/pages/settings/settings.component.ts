import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {AuthService} from '../../../../core/services/common/auth.service';

@Component({
  selector: 'app-settings',
    imports: [
        RouterLink
    ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

    constructor(private readonly authService: AuthService) {}

    protected logOutClicked() {

        const confirmed : boolean = confirm('Are you sure you want to logout?');

        if (confirmed) {
            this.authService.logout();
        } else {
            return;
        }

    }
}
