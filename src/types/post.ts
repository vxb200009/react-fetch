export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface PaginationParams {
  _page: number;
  _limit: number;
}

export interface PaginationState extends PaginationParams {
  total: number;
  totalPages: number;
}
