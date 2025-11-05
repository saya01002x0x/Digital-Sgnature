/**
 * Common TypeScript types used across the application
 */

import type { Role } from '@/app/config/constants';

/**
 * User Base Type
 */
export type UserBase = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export type OrgId = string;

/**
 * Theme types
 */
export type Theme = 'light' | 'dark';

/**
 * Language types
 */
export type Language = 'vi' | 'en';

/**
 * Common status types
 */
export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

/**
 * Pagination types
 */
export type PaginationParams = {
  page: number;
  limit: number;
}

export type PaginationMeta = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Sort types
 */
export type SortOrder = 'asc' | 'desc';

export type SortParams = {
  sortBy: string;
  sortOrder: SortOrder;
}

/**
 * Filter types
 */
export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';

export type FilterParam = {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

/**
 * API Response types
 */
export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export type ApiError = {
  status?: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Form state types
 */
export type FormError = {
  field: string;
  message: string;
}

/**
 * File upload types
 */
export type UploadFile = {
  uid: string;
  name: string;
  status: 'uploading' | 'done' | 'error' | 'removed';
  url?: string;
  response?: unknown;
  error?: Error;
  percent?: number;
}

/**
 * Select option type
 */
export type SelectOption<T = string> = {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: React.ReactNode;
}

/**
 * Timestamp types
 */
export type Timestamps = {
  createdAt: string;
  updatedAt: string;
}

/**
 * Soft delete type
 */
export type SoftDelete = {
  deletedAt?: string | null;
}

/**
 * Generic ID type
 */
export type ID = string | number;

/**
 * Nullable type helper
 */
export type Nullable<T> = T | null;

/**
 * Optional type helper
 */
export type Optional<T> = T | undefined;

/**
 * Deep partial type helper
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Array element type helper
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

/**
 * Omit multiple keys helper
 */
export type OmitMultiple<T, K extends keyof T> = Omit<T, K>;

/**
 * Pick multiple keys helper
 */
export type PickMultiple<T, K extends keyof T> = Pick<T, K>;

/**
 * Make specific keys required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific keys optional
 */
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Coordinate types for positioning
 */
export type Coordinates = {
  x: number;
  y: number;
}

export type Rectangle = {
  width: number;
  height: number;
} & Coordinates

/**
 * Percentage-based positioning (0-100)
 */
export type PercentagePosition = {
  x: number; // 0-100
  y: number; // 0-100
  width: number; // 0-100
  height: number; // 0-100
}
