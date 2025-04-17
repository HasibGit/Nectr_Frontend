import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILogin, ILoginResponse } from '../interfaces/login.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  login(loginData: ILogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(
      `${environment.baseUrl}/api/account/login`,
      loginData
    );
  }
}
