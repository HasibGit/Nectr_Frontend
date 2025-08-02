import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { IMember } from '../interfaces/member.interface';
import { Observable, of, take, tap } from 'rxjs';
import { IPhoto } from '../interfaces/photo.interface';
import { PaginationResult } from '../interfaces/pagination';
import { UserParams } from '../interfaces/userParams';
import { AuthService } from './auth.service';
import { PaginationHelperService } from './pagination-helper.service';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  baseUrl = environment.baseUrl;
  http = inject(HttpClient);
  authService = inject(AuthService);
  paginationHelperService = inject(PaginationHelperService);
  user = this.authService.loggedInUser();
  members = signal<PaginationResult<IMember[]> | null>(null);
  memberCache = new Map<string, HttpResponse<IMember[]>>();
  userParams = signal<UserParams>(new UserParams(this.user!));

  resetUserParams() {
    this.userParams = signal<UserParams>(new UserParams(this.user!));
  }

  getMembers(): void {
    const response = this.memberCache.get(
      Object.values(this.userParams()).join('-')
    );

    if (response) {
      return this.paginationHelperService.setPaginationResponse(
        response,
        this.members
      );
    }

    let params = this.paginationHelperService.setPaginationHeaders(
      this.userParams().pageNumber,
      this.userParams().pageSize
    );

    params = params.append('minAge', this.userParams().minAge);
    params = params.append('maxAge', this.userParams().maxAge);
    params = params.append('gender', this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy);

    this.http
      .get<IMember[]>(this.baseUrl + '/api/users', {
        observe: 'response',
        params,
      })
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.paginationHelperService.setPaginationResponse(
            response,
            this.members
          );
          this.memberCache.set(
            Object.values(this.userParams()).join('-'),
            response
          );
        },
      });
  }

  getMember(username: string): Observable<IMember> {
    const members = [...this.memberCache.values()].flatMap(
      (resp) => resp.body ?? []
    );

    const cachedMember = members.find((member) => member.userName === username);

    return cachedMember
      ? of(cachedMember)
      : this.http.get<IMember>(`${this.baseUrl}/api/users/${username}`);
  }

  updateMember(member: IMember): Observable<Object> {
    return this.http.put(this.baseUrl + '/api/users/', member);
  }

  setAsMainProfilePic(photo: IPhoto) {
    return this.http
      .put(`${this.baseUrl}/api/users/set-main-photo/${photo.id}`, {})
      .pipe(
        tap(() => {
          this.members.update((members) => {
            if (members && members.items.length) {
              members.items.map((member) => {
                if (member.photos.includes(photo)) {
                  member.photoUrl = photo.url;
                }

                return member;
              });

              return members;
            }

            return members;
          });
        })
      );
  }

  deletePhoto(photo: IPhoto) {
    return this.http
      .delete(`${this.baseUrl}/api/users/delete-photo/${photo.id}`, {})
      .pipe(
        tap(() => {
          this.members.update((members) => {
            if (!members || !members.items.length) {
              return members;
            }

            members.items.map((member) => {
              const filteredPhotos = member.photos.filter((p) => p !== photo);
              const isPhotoUrlRemoved = member.photoUrl === photo.url;

              return {
                ...member,
                photos: filteredPhotos,
                photoUrl: isPhotoUrlRemoved ? '' : member.photoUrl,
              };
            });

            return members;
          });
        })
      );
  }
}
