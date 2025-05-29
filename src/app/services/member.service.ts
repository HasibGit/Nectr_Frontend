import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IMember } from '../interfaces/member.interface';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  baseUrl = environment.baseUrl;
  http = inject(HttpClient);

  members = signal<IMember[]>([]);

  getMembers(): void {
    this.http
      .get<IMember[]>(this.baseUrl + '/api/users')
      .pipe(take(1))
      .subscribe({
        next: (members: IMember[]) => this.members.set(members),
      });
  }

  getMember(username: string): Observable<IMember> {
    return this.http.get<IMember>(this.baseUrl + '/api/users/' + username);
  }

  updateMember(member: IMember): Observable<Object> {
    return this.http.put(this.baseUrl + '/api/users/', member);
  }
}
