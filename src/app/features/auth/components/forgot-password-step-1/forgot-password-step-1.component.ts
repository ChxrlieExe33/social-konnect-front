import {Component, EventEmitter, OnInit, Output, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {catchError, exhaustMap, filter, of, Subject, takeUntil, tap} from 'rxjs';
import {AuthService} from '../../../../core/services/common/auth.service';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password-step-1',
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [AutoDestroyService],
  templateUrl: './forgot-password-step-1.component.html',
  styleUrl: './forgot-password-step-1.component.css'
})
export class ForgotPasswordStep1Component implements OnInit {

    error = signal<string | undefined>(undefined);

    submitted$ = new Subject<void>();

    form = new FormGroup({
        username: new FormControl('', {
            validators: [Validators.required, Validators.maxLength(100)],
        }),
    })

    @Output() moveToStep2AndPassResetId = new EventEmitter<string>();

    constructor(
       private readonly authService: AuthService,
       private readonly destroy$ : AutoDestroyService
    ) {}

    ngOnInit(): void {

        this.subscribeToSubmitted();
    }

    subscribeToSubmitted() {

        this.submitted$.pipe(
            takeUntil(this.destroy$),
            tap(() => this.error.set(undefined)),
            filter(() => !this.form.invalid),
            exhaustMap(() => {

                return this.authService.submitForgotPasswordRequest(this.form.controls.username.value!).pipe(
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

                    this.moveToStep2AndPassResetId.emit(data.result.resetId);

                } else {

                    const err = data.error;

                    if (err.error && typeof err.error === 'object' && err.error.message) {
                        console.warn(err.error.message);
                        this.error.set(err.error.message);
                    } else {
                        console.warn(err);
                        this.error.set("Something went wrong when submitting your username, please try again later.");
                    }

                }

            }
        })

    }

}
