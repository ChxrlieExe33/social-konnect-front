import {Component, OnInit, signal} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {AuthService} from '../../../../core/services/common/auth.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {exhaustMap, Subject, takeUntil} from 'rxjs';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';

@Component({
  selector: 'app-delete-my-account',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [AutoDestroyService],
  templateUrl: './delete-my-account.component.html',
  styleUrl: './delete-my-account.component.css'
})
export class DeleteMyAccountComponent implements OnInit {

    deleteAccepted = signal<boolean>(false);
    currentUsername = signal<string>('');

    deleteSubmitted$ = new Subject<void>();

    error = signal<string | null>(null);

    form = new FormGroup({
        username: new FormControl('', [Validators.required]),
    })

    constructor(private userService: UserService, private router: Router, private authService: AuthService, private destroy$: AutoDestroyService) { }

    ngOnInit() {

        this.currentUsername.set(this.authService.getCurrentUsername());
        this.subscribeToSubmit();

    }

    get usernameIncorrect() {

        return this.form.controls.username.touched &&
            this.form.controls.username.dirty &&
            this.form.controls.username.value !== this.currentUsername();
    }

    moveToNextStep() {

        this.deleteAccepted.set(true);
    }

    subscribeToSubmit() {

        this.deleteSubmitted$.pipe(
            takeUntil(this.destroy$),
            exhaustMap(() => {
                return this.userService.deleteMyAccount().pipe(
                    takeUntil(this.destroy$),
                )
            })
        ).subscribe({
            next: () => {

                this.router.navigate(['/auth','login']).then(() => {});

            }, error: (err) => {

                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.warn(err.error.message);
                    this.error.set(err.error.message);
                } else {
                    console.warn(err);
                    this.error.set("Something went wrong when fetching explore posts, please try again later.");
                }

            }
        });

    }

}
