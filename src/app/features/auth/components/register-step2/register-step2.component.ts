import {Component, input, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {catchError, exhaustMap, of, Subject, takeUntil} from 'rxjs';
import {AuthService} from '../../../../core/services/common/auth.service';
import {Router} from '@angular/router';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-register-step2',
    imports: [
        ReactiveFormsModule
    ],
    providers: [AutoDestroyService],
  templateUrl: './register-step2.component.html',
  styleUrl: './register-step2.component.css'
})
export class RegisterStep2Component implements OnInit {

    error = signal<string>('');

    username = input.required<string>();

    submit$ = new Subject<void>();

    clickSendNewCode$ = new Subject<void>();

    constructor(private authService: AuthService, private router: Router, private destroy$: AutoDestroyService) { }

    form = new FormGroup({
        code: new FormControl('', {
            validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^\d+$/) ], // The pattern means only whole numbers allowed.
        })
    })

    get codeInvalidFormat() {
        return this.form.controls.code.touched && this.form.controls.code.dirty && this.form.controls.code.invalid;
    }

    ngOnInit() {

        this.subscribeToSubmit()
        this.subscribeToClickSendNewCode()

    }

    subscribeToSubmit() {

        this.submit$.pipe(
            takeUntil(this.destroy$),
            exhaustMap(val => {

                return this.authService.submitRegisterVerifyCode({
                    username: this.username(),
                    verification_code: +this.form.controls.code.value! // The + casts the string to a number
                }).pipe(takeUntil(this.destroy$))

            })
        ).subscribe({
            next: value => {

                this.authService.setAuthenticationAfterRegister(value.body!.username, value.headers.get('Authorization')!)

                this.router.navigate(['/feed','explore']);

            }, error: err => {

                if (err.error && typeof err.error === 'object' && err.error.message) {
                    console.log(err.error.message);
                    this.error.set(err.error.message);
                } else {
                    console.log(err);
                    this.error.set("Something went wrong when registering");
                }

            }
        })

    }

    subscribeToClickSendNewCode() {

        this.clickSendNewCode$.pipe(
            takeUntil(this.destroy$),
            exhaustMap(() => {

                return this.authService.requestNewRegisterVerificationCode(this.username()).pipe(
                    takeUntil(this.destroy$),
                    map(() => ({success: true as const})),
                    catchError(error => {
                        return of({success: false as const, error: error});
                    })
                )
            })
        ).subscribe({
            next: value => {

                if(!value.success) {

                    const err = value.error;

                    // Check to make sure the body of the custom error dto was actually sent
                    if (err.error && typeof err.error === 'object' && err.error.message) {
                        console.log(err.error.message);
                        this.error.set(err.error.message);
                    } else {
                        console.log(err);
                        this.error.set("Something went wrong when sending the code");
                    }

                }

            }
        })

    }

}
