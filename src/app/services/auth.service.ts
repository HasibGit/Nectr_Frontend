import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ILogin, ILoginResponse } from '../interfaces/login.interface';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { IRegister, IRegisterResponse } from '../interfaces/register.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedInUser = signal<ILoginResponse | null>(null);
  private http = inject(HttpClient);

  login(loginData: ILogin): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>(
        `${environment.baseUrl}/api/account/login`,
        loginData
      )
      .pipe(
        tap((user) => {
          if (user) {
            localStorage.setItem(
              environment.userLocalStorageKey,
              JSON.stringify(user)
            );
            this.loggedInUser.set(user);
          }
        })
      );
  }

  register(registerData: IRegister): Observable<IRegisterResponse> {
    return this.http
      .post<IRegisterResponse>(
        `${environment.baseUrl}/api/account/register`,
        registerData
      )
      .pipe(
        tap((user) => {
          if (user) {
            localStorage.setItem(
              environment.userLocalStorageKey,
              JSON.stringify(user)
            );
            this.loggedInUser.set(user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem(environment.userLocalStorageKey);
    this.loggedInUser.set(null);
  }
}
