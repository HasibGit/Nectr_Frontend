import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginationResult } from '../interfaces/pagination';
import { IMessage } from '../interfaces/message';
import { PaginationHelperService } from './pagination-helper.service';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = environment.baseUrl;
  private http = inject(HttpClient);
  private paginationHelperService = inject(PaginationHelperService);
  paginatedResult = signal<PaginationResult<IMessage[]> | null>(null);

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = this.paginationHelperService.setPaginationHeaders(
      pageNumber,
      pageSize
    );

    params = params.append('Container', container);

    return this.http
      .get<IMessage[]>(this.baseUrl + '/api/messages', {
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
}
