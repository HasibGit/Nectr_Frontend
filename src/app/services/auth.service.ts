import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import { ILogin, ILoginResponse } from '../interfaces/login.interface';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { IRegister, IRegisterResponse } from '../interfaces/register.interface';
import { LikesService } from './likes.service';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedInUser = signal<ILoginResponse | null>(null);
  private http = inject(HttpClient);
  likesService = inject(LikesService);
  private presenceService = inject(PresenceService);

  roles = computed(() => {
    const user = this.loggedInUser();

    if (user && user.token) {
      const role = JSON.parse(atob(user.token.split('.')[1])).role;

      return Array.isArray(role) ? role : [role];
    }

    return [];
  });

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
    this.likesService.getLikedUserIds();
    this.presenceService.createHubConnection(user);
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
    this.presenceService.stopHubConnection();
  }
}
