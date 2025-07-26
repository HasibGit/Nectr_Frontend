import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IMember } from '../interfaces/member.interface';
import { Observable, of, take, tap } from 'rxjs';
import { IPhoto } from '../interfaces/photo.interface';
import { PaginationResult } from '../interfaces/pagination';
import { UserParams } from '../interfaces/userParams';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  baseUrl = environment.baseUrl;
  http = inject(HttpClient);

  members = signal<PaginationResult<IMember[]> | null>(null);

  getMembers(userParams: UserParams): void {
    let params = this.setPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    this.http
      .get<IMember[]>(this.baseUrl + '/api/users', {
        observe: 'response',
        params,
      })
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.members.set({
            items: <IMember[]>response.body,
            pagination: JSON.parse(response.headers.get('Pagination')!),
          });
        },
      });
  }

  getMember(username: string): Observable<IMember> {
    // const idx = this.members().findIndex(
    //   (member) => member.userName === username
    // );

    // if (idx >= 0) {
    //   return of(this.members()[idx]);
    // }

    return this.http.get<IMember>(this.baseUrl + '/api/users/' + username);
  }

  updateMember(member: IMember): Observable<Object> {
    return this.http.put(this.baseUrl + '/api/users/', member);
  }

  setAsMainProfilePic(photo: IPhoto) {
    return this.http
      .put(`${this.baseUrl}/api/users/set-main-photo/${photo.id}`, {})
      .pipe
      // tap(() => {
      //   this.members.update((members) =>
      //     members.map((member) => {
      //       if (member.photos.includes(photo)) {
      //         member.photoUrl = photo.url;
      //       }

      //       return member;
      //     })
      //   );
      // })
      ();
  }

  deletePhoto(photo: IPhoto) {
    return this.http
      .delete(`${this.baseUrl}/api/users/delete-photo/${photo.id}`, {})
      .pipe
      // tap(() => {
      //   this.members.update((members) =>
      //     members.map((member) => {
      //       const filteredPhotos = member.photos.filter((p) => p !== photo);
      //       const isPhotoUrlRemoved = member.photoUrl === photo.url;

      //       return {
      //         ...member,
      //         photos: filteredPhotos,
      //         photoUrl: isPhotoUrlRemoved ? '' : member.photoUrl,
      //       };
      //     })
      //   );
      // })
      ();
  }

  private setPaginationHeaders(
    pageNumber: number,
    pageSize: number
  ): HttpParams {
    let params = new HttpParams();

    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }

    return params;
  }
}
