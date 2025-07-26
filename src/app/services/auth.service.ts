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
            this.setCurrentUser(user);
          }
        })
      );
  }

  register(registerData: IRegister): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>(
        `${environment.baseUrl}/api/account/register`,
        registerData
      )
      .pipe(
        tap((user) => {
          if (user) {
            this.setCurrentUser(user);
          }
        })
      );
  }

  setCurrentUser(user: ILoginResponse) {
    localStorage.setItem(environment.userLocalStorageKey, JSON.stringify(user));
    this.loggedInUser.set(user);
  }

  isTokenExpired(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      const now = Math.floor(Date.now() / 1000);

      const secondsLeft = expiry - now;
      const minutesLeft = Math.floor(secondsLeft / 60);

      console.log(`Token expires in approximately ${minutesLeft} minute(s).`);

      return expiry < now;
    } catch {
      return true;
    }
  }

  logout(): void {
    localStorage.removeItem(environment.userLocalStorageKey);
    this.loggedInUser.set(null);
  }
}
