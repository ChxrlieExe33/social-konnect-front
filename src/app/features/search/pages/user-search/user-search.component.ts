import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {catchError, debounceTime, distinctUntilChanged, filter, of, switchMap, takeUntil} from 'rxjs';
import {UserService} from '../../../profile/services/user.service';
import {UserProfile} from '../../../../core/models/user-profile.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-user-search',
    imports: [
        ReactiveFormsModule,
        RouterLink
    ],
    providers: [AutoDestroyService],
  templateUrl: './user-search.component.html',
  styleUrl: './user-search.component.css'
})
export class UserSearchComponent implements OnInit {

    protected form = new FormGroup({
        username: new FormControl(''),
    })

    protected users = signal<UserProfile[]>([]);
    protected error = signal<string | undefined>(undefined);

    constructor(private destroy$: AutoDestroyService, private userService: UserService) {}

    ngOnInit() {

        this.subscribeToUsernameChange();

    }

    subscribeToUsernameChange() {

        this.form.get('username')!.valueChanges.pipe(
            takeUntil(this.destroy$),
            debounceTime(500),
            distinctUntilChanged(),
            filter(value => !!value && value.trim().length > 0), // Ignores empty strings
            switchMap((value) => {

                return this.userService.searchUsersByUsername(value!).pipe(
                    catchError(err => {

                        if (err.error && typeof err.error === 'object' && err.error.message) {
                            console.log(err.error.message);
                            this.error.set(err.error.message);
                        } else {
                            console.log(err);
                            this.error.set("Something went wrong when fetching users, please try again later.");
                        }

                        return of([]);
                    }),
                );

            })
        ).subscribe({
            next: (value) => {

                if(value.length > 0){
                    this.error.set(undefined);
                }

                this.users.set(value);

            }
        })

    }

}
