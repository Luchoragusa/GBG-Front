import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, ReplaySubject, tap, take } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    url = environment.apiUrl + '/users';
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        console.log(value);
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User>
    {
        let userInfo: User | undefined;

        this._user.pipe(take(1)).subscribe((user: User) => {
            userInfo = user;
        });

        return this._httpClient.get<User>(`${this.url}/${userInfo.id}`, ).pipe(
            tap((response: User) => {
                this._user.next(response);
            }
        ));
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any>
    {
        return this._httpClient.patch<User>('api/common/user', {user}).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }
}
