import {Component, ElementRef, OnInit, signal, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../../core/services/common/auth.service';
import {Router, RouterLink} from '@angular/router';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {exhaustMap, Subject, takeUntil, tap} from 'rxjs';

@Component({
    selector: 'app-login-page',
    imports: [
        FormsModule,
        RouterLink
    ],
    providers: [AutoDestroyService],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.css',
    host: {
        class: 'bg-gradient-to-r from-blue-300 to-blue-400'
    }
})
export class LoginPageComponent implements OnInit {

    username = signal<string>('');
    password = signal<string>('');
    @ViewChild('loginForm') loginForm!: ElementRef<HTMLFormElement>;

    submitted$ = new Subject<void>();

    error = signal<string>('');

    constructor(private authService: AuthService, private router : Router, private destroy$: AutoDestroyService) { }

    ngOnInit() {

        // Subscribe to the auth state
        this.authService.authentication$.subscribe()
        this.subscribeToClickSubmitAndHandleLogin();

    }

    subscribeToClickSubmitAndHandleLogin() {

        this.submitted$.pipe(
            takeUntil(this.destroy$),
            tap(() => this.error.set('')),
            exhaustMap(() => {
                return this.authService.login(this.username(), this.password()).pipe(takeUntil(this.destroy$));
            })
        ).subscribe({
            error: err => {

                this.loginForm.nativeElement.reset();

                // Check to make sure the body of the custom error dto was actually sent
                if (err.error && typeof err.error === 'object') {
                    this.error.set(err.error.message);
                } else {
                    this.error.set("An unknown error has occurred.");
                }

            }, next : auth => {
                this.loginForm.nativeElement.reset();
                this.router.navigate(['feed', 'following']);
            }
        });

    }

}
