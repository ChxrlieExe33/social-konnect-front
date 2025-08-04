import { Component } from '@angular/core';
import {VerticalNavbarComponent} from '../../../shared/components/vertical-navbar/vertical-navbar.component';
import {RouterOutlet} from '@angular/router';
import {BottomNavbarComponent} from '../../../shared/components/bottom-navbar/bottom-navbar.component';

@Component({
  selector: 'app-main-layout',
    imports: [
        VerticalNavbarComponent,
        RouterOutlet,
        BottomNavbarComponent
    ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
