import {Component, input} from '@angular/core';
import {UserProfile} from '../../../../core/models/user/user-profile.model';
import {RouterLink} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {UserMetadata} from '../../../../core/models/user/user-metadata';

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
    userMetadata = input.required<UserMetadata>();

    constructor() {}

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
