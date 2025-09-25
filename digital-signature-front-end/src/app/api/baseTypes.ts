export type EntityId = string | number;

export type ApiError = {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string[]>;
  };
};

export type Timestamp = {
  createdAt: string;
  updatedAt: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
};

export type PaginationParams = {
  page?: number;
  perPage?: number;
  sort?: string;
  order?: 'asc' | 'desc';
};
