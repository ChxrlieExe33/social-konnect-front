import {Component, OnInit, signal} from '@angular/core';
import {UserProfile} from '../../../../core/models/user-profile.model';
import {UserService} from '../../services/user.service';
import {FormsModule} from '@angular/forms';
import {exhaustMap, Subject, takeUntil} from 'rxjs';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-edit-profile',
    imports: [
        FormsModule
    ],
    providers: [AutoDestroyService],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {

    previousData = signal<UserProfile | undefined>(undefined);

    updatedBio = signal<string>('');
    updatedProfilePic? : File = undefined;
    updatedPfpUrl: string | null = null;

    error = signal<string | undefined>(undefined);

    submitted$ = new Subject<void>();

    constructor(
        private readonly userService: UserService,
        private readonly destroy$: AutoDestroyService,
        private readonly router: Router
    ) {}

    ngOnInit() {

        this.subscribeToPreviousData()
        this.subscribeToSubmit()
    }

    subscribeToPreviousData() {

        this.userService.getCurrentUser().subscribe({
            next: data => {

                this.previousData.set(data);
                this.updatedBio.set(data.bio);

            }, error: err => {

                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.log(err.error.message);
                    this.error.set(err.error.message);
                } else {
                    console.log(err);
                    this.error.set("Something went wrong when fetching your profile data, please try again later.");
                }

            }
        })

    }

    subscribeToSubmit() {

        this.submitted$.pipe(
            exhaustMap(() => {
                return this.userService.updateProfileData(this.prepareFormData()).pipe(
                    takeUntil(this.destroy$)
                )
            })
        ).subscribe({
            next: data => {
                this.router.navigateByUrl('/profile/me');
            }, error: err => {

                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.log(err.error.message);
                    this.error.set(err.error.message);
                } else {
                    console.log(err);
                    this.error.set("Something went wrong when fetching your profile data, please try again later.");
                }

            }
        })

    }

    onFileSelect(event: Event) {

        const input = event.target as HTMLInputElement;

        if(input.files) {
            this.updatedProfilePic = input.files[0];
            this.displayNewPfp(input.files[0]);
        }

    }

    displayNewPfp(file: File) {

        const reader = new FileReader();
        reader.onload = (e) => {
            this.updatedPfpUrl = e.target?.result as string;
        };
        reader.readAsDataURL(file);

    }

    prepareFormData(): FormData {

        const data = new FormData();

        data.append('bio', this.updatedBio());

        // Only add the file if it has been changed.
        if(this.updatedProfilePic) {
            data.append('pfp', this.updatedProfilePic);
        }

        return data;

    }

}
