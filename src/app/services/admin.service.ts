import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/admin.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = environment.baseUrl;
  private http = inject(HttpClient);

  getUserWithRoles() {
    return this.http.get<IUser[]>(this.baseUrl + '/api/admin/users-with-roles');
  }

  updateUserRoles(username: string, roles: string[]) {
    return this.http.post<string[]>(
      this.baseUrl + '/api/admin/edit-roles/' + username + '?roles=' + roles,
      {}
    );
  }
}
