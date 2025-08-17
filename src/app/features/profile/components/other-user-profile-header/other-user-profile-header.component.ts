import {Component, EventEmitter, input, Output} from '@angular/core';
import {UserProfile} from '../../../../core/models/user-profile.model';
import {UserMetadata} from '../../../../core/models/user-metadata';

@Component({
  selector: 'app-other-user-profile-header',
  imports: [],
  templateUrl: './other-user-profile-header.component.html',
  styleUrl: './other-user-profile-header.component.css'
})
export class OtherUserProfileHeaderComponent {

    profile = input.required<UserProfile>();
    userMetadata = input.required<UserMetadata>();
    following = input.required<boolean>();

    @Output() followToggled: EventEmitter<void> = new EventEmitter();

    async shareProfile() {

        const shareData = {
            title: 'Check out this profile on SocialKonnect',
            text: 'Welcome to SocialKonnect, the social media platform of the future.',
            url: window.location.href,
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

    toggleFollow() {

        this.followToggled.emit();

    }

}
