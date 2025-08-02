import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { IMember } from '../interfaces/member.interface';
import { Observable } from 'rxjs';
import { PaginationResult } from '../interfaces/pagination';
import { PaginationHelperService } from './pagination-helper.service';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private http = inject(HttpClient);
  private paginationHelperService = inject(PaginationHelperService);
  likedUserIds = signal<number[]>([]);
  paginatedResult = signal<PaginationResult<IMember[]> | null>(null);

  toggleLike(targetUserId: number) {
    return this.http.post(
      `${environment.baseUrl}/api/likes/${targetUserId}`,
      {}
    );
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number): void {
    let params = this.paginationHelperService.setPaginationHeaders(
      pageNumber,
      pageSize
    );
    params = params.append('predicate', predicate);

    this.http
      .get<IMember[]>(`${environment.baseUrl}/api/likes`, {
        observe: 'response',
        params,
      })
      .subscribe({
        next: (response) =>
          this.paginationHelperService.setPaginationResponse(
            response,
            this.paginatedResult
          ),
      });
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
