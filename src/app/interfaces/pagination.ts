export interface Pagination {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export class PaginationResult<T> {
  items: T;
  pagination: Pagination;
}
