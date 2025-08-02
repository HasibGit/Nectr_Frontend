import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { IMember } from '../interfaces/member.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private http = inject(HttpClient);
  likedUserIds = signal<number[]>([]);

  toggleLike(targetUserId: number) {
    return this.http.post(
      `${environment.baseUrl}/api/likes/${targetUserId}`,
      {}
    );
  }

  getLikes(predicate: string): Observable<IMember[]> {
    return this.http.get<IMember[]>(
      `${environment.baseUrl}/api/likes?predicate=${predicate}`
    );
  }

  getLikedUserIds() {
    this.http.get<number[]>(`${environment.baseUrl}/api/likes/list`).subscribe({
      next: (userIds) => {
        this.likedUserIds.set(userIds);
      },
      error: (error) => {
        console.error('Error fetching liked user IDs:', error);
      },
    });
  }
}
