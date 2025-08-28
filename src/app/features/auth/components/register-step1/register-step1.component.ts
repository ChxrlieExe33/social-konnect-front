import {Component, EventEmitter, OnInit, Output, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {debounceTime, distinctUntilChanged, exhaustMap, filter, Subject, switchMap, takeUntil} from 'rxjs';
import {AuthService} from '../../../../core/services/common/auth.service';
import {RouterLink} from "@angular/router";
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {noWhitespaceValidator} from '../../../../core/validators/no-whitespace-validator';

@Component({
  selector: 'app-register-step1',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterLink
    ],
    providers: [AutoDestroyService],
  templateUrl: './register-step1.component.html',
  styleUrl: './register-step1.component.css'
})
export class RegisterStep1Component implements OnInit {

    error = signal<string>('');
    usernameTaken = signal<boolean>(false);

    submit$ = new Subject<void>();

    form = new FormGroup({
        username: new FormControl('',{validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50), noWhitespaceValidator()]}),
        email: new FormControl('', {validators: [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(150)]}),
        password: new FormControl('', {validators: [Validators.required, Validators.minLength(8), Validators.maxLength(100)]}),
    })

    // Sends the username since that is necessary for the next step.
    @Output() moveToNextStepAndPassUsername = new EventEmitter<string>();

    constructor(private authService: AuthService, private destroy$: AutoDestroyService) { }

    ngOnInit() {

        this.subscribeToUsernameChanges()
        this.subscribeToSubmit()

    }

    subscribeToSubmit() {

        this.submit$.pipe(
            takeUntil(this.destroy$),
            exhaustMap(() => {
                return this.authService.submitRegisterStep1({
                    username: this.form.controls.username.value!,
                    email: this.form.controls.email.value!,
                    password: this.form.controls.password.value!
                }).pipe(takeUntil(this.destroy$))
            })
        ).subscribe({
            next: (value) => {

                this.moveToNextStepAndPassUsername.emit(value.username);

            },
            error: (err) => {
                // Check to make sure the body of the custom error dto was actually sent
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


    get usernameInvalid() {
        return this.form.controls.username.touched && this.form.controls.username.dirty && this.form.controls.username.invalid;
    }

    get emailInvalid() {
        return this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid;
    }

    get passwordInvalid() {
        return this.form.controls.password.touched && this.form.controls.password.dirty && this.form.controls.password.invalid;
    }

    /**
     * To check if the username is taken and give the user feedback.
     */
    subscribeToUsernameChanges() {

        this.form.get('username')?.valueChanges.pipe(
            takeUntil(this.destroy$),
            debounceTime(500),
            distinctUntilChanged(),
            filter(value => !!value && value.trim().length > 0),
            switchMap((value) => {

                console.log("Checking username " + value);
                return this.authService.checkIfUsernameTaken(value!);

            })
        ).subscribe({
            next: value => {

                // If taken, value will be set to null by the catchError()
                if (value === null) {
                    this.usernameTaken.set(true)
                } else {
                    this.usernameTaken.set(false)
                }

            }
        });

    }


}
