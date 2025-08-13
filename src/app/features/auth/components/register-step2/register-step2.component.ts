import {Component, input, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {exhaustMap, Subject} from 'rxjs';
import {AuthService} from '../../../../core/services/common/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register-step2',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './register-step2.component.html',
  styleUrl: './register-step2.component.css'
})
export class RegisterStep2Component implements OnInit {

    error = signal<string>('');

    username = input.required<string>();

    submit$ = new Subject<void>();

    constructor(private authService: AuthService, private router: Router) { }

    form = new FormGroup({
        code: new FormControl('', {
            validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^\d+$/) ],
        })
    })

    get codeInvalidFormat() {
        return this.form.controls.code.touched && this.form.controls.code.dirty && this.form.controls.code.invalid;
    }

    ngOnInit() {

        this.subscribeToSubmit()

    }

    subscribeToSubmit() {

        this.submit$.pipe(
            exhaustMap(val => {

                return this.authService.submitRegisterVerifyCode({
                    username: this.username(),
                    verification_code: +this.form.controls.code.value!
                })

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

}
