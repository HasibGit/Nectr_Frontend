import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IMember } from '../interfaces/member.interface';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  baseUrl = environment.baseUrl;
  http = inject(HttpClient);
  authService = inject(AuthService);

  getMembers(): Observable<IMember[]> {
    return this.http.get<IMember[]>(
      this.baseUrl + '/api/users',
      this.getHttpOptions()
    );
  }

  getMember(username: string): Observable<IMember> {
    return this.http.get<IMember>(
      this.baseUrl + '/api/user/' + username,
      this.getHttpOptions()
    );
  }

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.loggedInUser()?.token}`,
      }),
    };
  }
}
