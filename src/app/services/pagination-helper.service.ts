import { HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { PaginationResult } from '../interfaces/pagination';

@Injectable({
  providedIn: 'root',
})
export class PaginationHelperService {
  setPaginationResponse<T>(
    response: HttpResponse<T>,
    paginatedResultSignal: ReturnType<typeof signal<PaginationResult<T> | null>>
  ): void {
    paginatedResultSignal.set({
      items: <T>response.body,
      pagination: JSON.parse(response.headers.get('Pagination')!),
    });
  }

  setPaginationHeaders(pageNumber: number, pageSize: number): HttpParams {
    let params = new HttpParams();

    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }

    return params;
  }
}
