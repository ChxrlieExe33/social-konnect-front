import {Component, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RegisterStep1Component} from '../../components/register-step1/register-step1.component';
import {RegisterStep2Component} from '../../components/register-step2/register-step2.component';

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
export class RegisterPageComponent {

    currentStep = signal<1 | 2>(1);

    username = signal<string>('');

    moveToStep2(username: string) {

        this.currentStep.set(2);
        this.username.set(username);

    }
}
