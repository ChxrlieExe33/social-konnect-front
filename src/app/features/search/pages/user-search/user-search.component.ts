import {Component, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AutoDestroyService} from '../../../../core/services/utils/auto-destroy.service';
import {
    catchError,
    debounceTime,
    distinctUntilChanged,
    exhaustMap,
    filter,
    of,
    Subject,
    switchMap,
    takeUntil
} from 'rxjs';
import {UserSearchResult, UserService} from '../../../profile/services/user.service';
import {UserProfile} from '../../../../core/models/user/user-profile.model';
import {RouterLink} from '@angular/router';
import {map} from 'rxjs/operators';
import {AuthService} from '../../../../core/services/common/auth.service';

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
        username: new FormControl('', {validators: [Validators.maxLength(254)]}),
    })

    protected users = signal<UserSearchResult[]>([]);
    protected error = signal<string | undefined>(undefined);

    protected followClicked$ = new Subject<string>();

    protected currentUsername = signal<string>('');

    constructor(private destroy$: AutoDestroyService, private userService: UserService, private authService: AuthService) {}

    ngOnInit() {

        this.subscribeToUsernameChange();
        this.subscribeToFollowClicked();
        this.currentUsername.set(this.authService.getCurrentUsername());

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

    subscribeToFollowClicked() {

        this.followClicked$.pipe(
            takeUntil(this.destroy$),
            exhaustMap((name) => {
                return this.userService.followUser(name).pipe(
                    takeUntil(this.destroy$),
                    map(() => ({success: true as const, username: name})),
                    catchError(() => {
                        return of({success: false as const});
                    })
                )
            })
        ).subscribe({
            next: (value) => {

                if(value.success){
                    this.removeFollowButton(value.username);
                } else {

                    this.error.set("Unable to follow user");
                }

            }
        });

    }

    removeFollowButton(username: string) {

        this.users.update(currentUsers =>
            currentUsers.map(user =>
                user.username === username ? {...user, following: true}: user));

    }

}
