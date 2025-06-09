import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IMember } from '../interfaces/member.interface';
import { Observable, of, take, tap } from 'rxjs';
import { IPhoto } from '../interfaces/photo.interface';

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
    const idx = this.members().findIndex(
      (member) => member.userName === username
    );

    if (idx >= 0) {
      return of(this.members()[idx]);
    }

    return this.http.get<IMember>(this.baseUrl + '/api/users/' + username);
  }

  updateMember(member: IMember): Observable<Object> {
    return this.http.put(this.baseUrl + '/api/users/', member);
  }

  setAsMainProfilePic(photo: IPhoto) {
    return this.http
      .put(`${this.baseUrl}/api/users/set-main-photo/${photo.id}`, {})
      .pipe(
        tap(() => {
          this.members.update((members) =>
            members.map((member) => {
              if (member.photos.includes(photo)) {
                member.photoUrl = photo.url;
              }

              return member;
            })
          );
        })
      );
  }

  deletePhoto(photo: IPhoto) {
    return this.http
      .delete(`${this.baseUrl}/api/users/delete-photo/${photo.id}`, {})
      .pipe(
        tap(() => {
          this.members.update((members) =>
            members.map((member) => {
              const filteredPhotos = member.photos.filter((p) => p !== photo);
              const isPhotoUrlRemoved = member.photoUrl === photo.url;

              return {
                ...member,
                photos: filteredPhotos,
                photoUrl: isPhotoUrlRemoved ? '' : member.photoUrl,
              };
            })
          );
        })
      );
  }
}
