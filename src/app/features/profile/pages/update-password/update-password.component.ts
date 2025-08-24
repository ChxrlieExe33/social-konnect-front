import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {catchError, exhaustMap, of, Subject, takeUntil, tap} from 'rxjs';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {UserService} from '../../services/user.service';
import {RouterLink} from '@angular/router';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-update-password',
    imports: [
        ReactiveFormsModule,
        RouterLink
    ],
    providers: [AutoDestroyService],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css'
})
export class UpdatePasswordComponent implements OnInit {

    protected submit$ = new Subject<void>();
    protected responseError = signal<string | undefined>(undefined);
    protected success = signal<boolean>(false);

    form = new FormGroup({
        oldPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]),
        newPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(100)])
    })

    constructor(
        private readonly destroy$ : AutoDestroyService,
        private readonly userService: UserService
    ) {}

    ngOnInit() {

        this.subscribeToSubmit()

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

    subscribeToSubmit() {

        this.submit$.pipe(
            takeUntil(this.destroy$),
            tap(() => this.responseError.set(undefined)),
            exhaustMap(() => {
                return this.userService.updatePassword(this.form.controls.oldPassword.value!, this.form.controls.newPassword.value!).pipe(
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
                    this.form.reset();

                } else {

                    const err = data.error;

                    if (err.error && typeof err.error === 'object' && err.error.message) {
                        console.warn(err.error.message);
                        this.responseError.set(err.error.message);
                    } else {
                        console.warn(err);
                        this.responseError.set("Something went wrong when changing the password, please try again later.");
                    }

                }

            }
        });
    }


}
