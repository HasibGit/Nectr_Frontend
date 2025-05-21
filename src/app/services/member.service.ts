import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IMember } from '../interfaces/member.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  baseUrl = environment.baseUrl;
  http = inject(HttpClient);

  getMembers(): Observable<IMember[]> {
    return this.http.get<IMember[]>(this.baseUrl + '/api/users');
  }

  getMember(username: string): Observable<IMember> {
    return this.http.get<IMember>(this.baseUrl + '/api/users/' + username);
  }
}
