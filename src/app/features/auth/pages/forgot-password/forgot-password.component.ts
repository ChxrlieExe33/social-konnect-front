import {Component, OnInit, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ForgotPasswordStep1Component} from '../../components/forgot-password-step-1/forgot-password-step-1.component';
import {ForgotPasswordStep2Component} from '../../components/forgot-password-step-2/forgot-password-step-2.component';
import {ForgotPasswordStep3Component} from '../../components/forgot-password-step-3/forgot-password-step-3.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-forgot-password',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        ForgotPasswordStep1Component,
        ForgotPasswordStep2Component,
        ForgotPasswordStep3Component
    ],
    host: {
        class: 'bg-gradient-to-r from-blue-300 to-blue-400'
    },
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {

    currentStep = signal<1 | 2 | 3>(1);

    resetId = signal<string>('');
    username = signal<string>('');


    constructor(private readonly activatedRoute : ActivatedRoute) {}

    ngOnInit() {
        this.subscribeToQueryParams();
    }

    subscribeToQueryParams() {

        this.activatedRoute.queryParams.subscribe(params => {

            if (params && params.hasOwnProperty("reset-id")) {

                this.moveToStep2(params["reset-id"]);

            }

        })

    }

    moveToStep2(resetId : string) {

        this.currentStep.set(2);
        this.resetId.set(resetId);

    }

    moveToStep3(resetId: string) {

        this.currentStep.set(3);
        this.resetId.set(resetId);
    }

    recieveUsername(username : string) {

        this.username.set(username);
    }

}
