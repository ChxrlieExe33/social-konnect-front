import {Component, input} from '@angular/core';
import {UserProfile} from '../../../../core/models/user-profile.model';
import {AuthService} from '../../../../core/services/common/auth.service';
import {RouterLink} from '@angular/router';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-profile-header',
    imports: [
        RouterLink
    ],
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

    async shareProfile() {

        const shareData = {
            title: 'Check out this profile on SocialKonnect',
            text: 'Welcome to SocialKonnect, the social media platform of the future.',
            url: `${environment.frontendBaseUrl}/profile/user/${this.profile().username}`,
        }

        try {
            // Proper feature detection
            if ('share' in navigator && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                console.log('Content shared successfully');
            } else {
                // Fallback to custom share menu or copy
                this.fallbackShare(shareData);
            }
        } catch (err : any) {
            // Handle user cancellation or other errors
            if (err.name !== 'AbortError') {
                console.error('Error sharing:', err);
                this.fallbackShare(shareData);
            }
        }
    }

    async fallbackShare(shareData :any) {

        // Copy to clipboard as fallback
        try {
            await navigator.clipboard.writeText(shareData.url);
            alert('Link copied to clipboard!');
        } catch (err : any) {
            console.log('Error sharing:', err);
        }

    }

}
