import {Component, EventEmitter, input, Output} from '@angular/core';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-post-options-modal',
  imports: [],
  templateUrl: './post-options-modal.component.html',
  styleUrl: './post-options-modal.component.css'
})
export class PostOptionsModalComponent {

    @Output() closeModal = new EventEmitter<void>();
    @Output() deletePost = new EventEmitter<void>();

    postOwnedByCurrentUser = input.required<boolean>();
    postId = input.required<string>();

    doDeletePost() {

        const confirmation = confirm(`Are you sure you want to delete this post?`);
        if (confirmation) {
            this.deletePost.emit();
        } else {
            return;
        }

    }

    async sharePost() {

        const shareData = {
            title: 'Check out this post on SocialKonnect',
            text: 'Welcome to SocialKonnect, the social media platform of the future.',
            url: `${environment.frontendBaseUrl}/posts/detail/${this.postId()}`,
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
