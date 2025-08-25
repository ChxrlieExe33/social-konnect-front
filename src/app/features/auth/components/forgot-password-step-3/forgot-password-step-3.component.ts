import {Component, input, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {catchError, exhaustMap, filter, of, Subject, takeUntil, tap} from 'rxjs';
import {map} from 'rxjs/operators';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {AuthService} from '../../../../core/services/common/auth.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-forgot-password-step-3',
    imports: [
        ReactiveFormsModule,
        RouterLink
    ],
    providers: [AutoDestroyService],
  templateUrl: './forgot-password-step-3.component.html',
  styleUrl: './forgot-password-step-3.component.css'
})
export class ForgotPasswordStep3Component implements OnInit {

    error = signal<string | undefined>(undefined);

    resetId = input.required<string>();

    submitted$ = new Subject<void>();

    success = signal<boolean>(false);

    form = new FormGroup({
        newPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(100)])
    })

    constructor(private readonly authService: AuthService, private readonly destroy$ : AutoDestroyService) {
    }

    ngOnInit() {

        this.subscribeToSubmitted();
    }

    get newPasswordInvalid() : boolean {

        return this.form.controls.newPassword.touched &&
            this.form.controls.newPassword.dirty &&
            this.form.controls.newPassword.invalid &&
            this.form.controls.confirmPassword.invalid &&
            this.form.controls.confirmPassword.touched &&
            this.form.controls.confirmPassword.dirty;
    }

    get passwordsDontMatch() : boolean {

        return this.form.controls.newPassword.value !== this.form.controls.confirmPassword.value &&
            this.form.controls.newPassword.touched &&
            this.form.controls.confirmPassword.touched;
    }

    subscribeToSubmitted() {

        this.submitted$.pipe(
            takeUntil(this.destroy$),
            tap(() => this.error.set(undefined)),
            filter(() => !this.form.invalid),
            exhaustMap(() => {

                return this.authService.submitForgotPasswordNewPassword(this.resetId(), this.form.controls.newPassword.value!).pipe(
                    takeUntil(this.destroy$),
                    map(result => ({success: true as const, result: result})),
                    catchError(err => {
                        return of({success: false as const, error: err}); // Cast it as an object to avoid the inner observable stopping the chain on error.
                    })
                )
            })
        ).subscribe({
            next: (data) => {

                if (data.success) {

                    this.success.set(true);

                } else {

                    const err = data.error;

                    if (err.error && typeof err.error === 'object' && err.error.message) {
                        console.warn(err.error.message);
                        this.error.set(err.error.message);
                    } else {
                        console.warn(err);
                        this.error.set("Something went wrong when setting your new password, please try again.");
                    }

                }

            }
        })

    }
}
