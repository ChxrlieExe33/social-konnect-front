import {Component, EventEmitter, input, OnInit, Output, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {catchError, exhaustMap, filter, of, Subject, takeUntil, tap} from 'rxjs';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {AuthService} from '../../../../core/services/common/auth.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-forgot-password-step-2',
    imports: [
        ReactiveFormsModule
    ],
    providers: [AutoDestroyService],
  templateUrl: './forgot-password-step-2.component.html',
  styleUrl: './forgot-password-step-2.component.css'
})
export class ForgotPasswordStep2Component implements OnInit {

    error = signal<string | undefined>(undefined);

    resetId = input.required<string>();

    submitted$ = new Subject<void>();

    @Output() moveToStep3 = new EventEmitter<void>();

    form = new FormGroup({
        code: new FormControl('', {
            validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^\d+$/) ], // The pattern means only whole numbers allowed.
        })
    })

    constructor(
       private readonly authService: AuthService,
       private readonly destroy$: AutoDestroyService
    ) {}

    ngOnInit() {
        this.subscribeToSubmitted()
    }

    get codeInvalidFormat() {
        return this.form.controls.code.touched && this.form.controls.code.dirty && this.form.controls.code.invalid;
    }

    subscribeToSubmitted() {

        this.submitted$.pipe(
            takeUntil(this.destroy$),
            tap(() => this.error.set(undefined)),
            filter(() => !this.form.invalid),
            exhaustMap(() => {

                return this.authService.submitForgotPasswordCode(this.form.controls.code.value!, this.resetId()).pipe(
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

                    this.moveToStep3.emit();

                } else {

                    const err = data.error;

                    if (err.error && typeof err.error === 'object' && err.error.message) {
                        console.warn(err.error.message);
                        this.error.set(err.error.message);
                    } else {
                        console.warn(err);
                        this.error.set("Something went wrong when verifying your code, please try again.");
                    }

                }

            }
        })

    }

}
