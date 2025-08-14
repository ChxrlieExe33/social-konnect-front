import {Component, OnInit, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RegisterStep1Component} from '../../components/register-step1/register-step1.component';
import {RegisterStep2Component} from '../../components/register-step2/register-step2.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-register-page',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RegisterStep1Component,
        RegisterStep2Component
    ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit {

    currentStep = signal<1 | 2>(1);
    username = signal<string>('');

    constructor(private readonly activatedRoute : ActivatedRoute) {}

    moveToStep2(username: string) {

        this.currentStep.set(2);
        this.username.set(username);

    }

    ngOnInit() {

        this.subscribeToQueryParams()

    }

    /**
     * Get the 'username' query parameter, if this was provided,
     * move form to step 2 with said username.
     *
     * If the user is already verified, and someone tries to submit a code
     * they will get an error message saying user is already verified.
     *
     * That way, if a user has already sent step 1, and accidentally loose the tab
     * this url will be provided in the code email for them to open again.
     */
    subscribeToQueryParams() {

        this.activatedRoute.queryParams.subscribe(params => {

            if (params && params.hasOwnProperty("username")) {

                console.log()
                this.moveToStep2(params["username"]);

            }

        })

    }
}
