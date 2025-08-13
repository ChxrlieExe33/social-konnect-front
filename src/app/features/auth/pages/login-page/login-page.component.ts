import {Component, ElementRef, OnInit, signal, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../../core/services/common/auth.service';
import {Router, RouterLink} from '@angular/router';

@Component({
    selector: 'app-login-page',
    imports: [
        FormsModule,
        RouterLink
    ],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {

    username = signal<string>('');
    password = signal<string>('');
    @ViewChild('loginForm') loginForm!: ElementRef<HTMLFormElement>;

    error = signal<string>('');

    constructor(private authService: AuthService, private router : Router) { }

    ngOnInit() {

        // Subscribe to the auth state
        this.authService.authentication$.subscribe({
            next: data => {
                console.log(data?.jwt);
            }
        })

    }

    submitLogin() {

        this.error.set('');

        const auth = this.authService.login(this.username(), this.password())
            .subscribe({
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
