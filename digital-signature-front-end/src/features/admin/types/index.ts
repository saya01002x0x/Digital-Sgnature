/**
 * Admin Module Types
 */

export type UserAdmin = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  role: 'ADMIN' | 'USER';
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminMetrics = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalDocuments: number;
  pendingDocuments: number;
  completedDocuments: number;
  totalSignatures: number;
  recentActivityCount?: number;
};

export type AuditLog = {
  id: string;
  timestamp: string;
  action: string;
  target: string;
  targetType: string;
  performedBy: string;
  performedByName?: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
};

export type UserFilters = {
  search?: string;
  role?: 'ADMIN' | 'USER' | 'ALL';
  isActive?: boolean | 'ALL';
};

export type AuditLogFilters = {
  search?: string;
  action?: string;
  targetType?: string;
  performedBy?: string;
  success?: boolean | 'ALL';
  startDate?: string;
  endDate?: string;
};

export type UpdateUserStatusRequest = {
  userId: string;
  isActive: boolean;
};

export type UpdateUserRequest = {
  userId: string;
  fullName?: string;
  phone?: string;
  address?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
