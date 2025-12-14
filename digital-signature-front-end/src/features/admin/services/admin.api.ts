import { baseApi } from '@/app/api/baseApi';
import type {
  UserAdmin,
  AdminMetrics,
  AuditLog,
  UserFilters,
  AuditLogFilters,
  PaginatedResponse,
  UpdateUserStatusRequest,
  UpdateUserRequest,
} from '../types';

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Metrics
    getMetrics: builder.query<AdminMetrics, void>({
      query: () => '/api/admin/metrics',
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AdminMetrics', 'Users'],
    }),

    // Users Management
    listUsersAdmin: builder.query<
      PaginatedResponse<UserAdmin>,
      { page?: number; size?: number; filters?: UserFilters }
    >({
      query: ({ page = 1, size = 10, filters = {} } = {}) => {
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('size', String(size));
        if (filters.search) params.append('search', filters.search);
        if (filters.role && filters.role !== 'ALL') params.append('role', filters.role);
        if (filters.isActive !== undefined && filters.isActive !== 'ALL') {
          params.append('isActive', String(filters.isActive));
        }
        return `/api/admin/users?${params.toString()}`;
      },
      transformResponse: (response: any) => response.data || response,
      providesTags: ['Users'],
    }),

    getUserAdmin: builder.query<UserAdmin, string>({
      query: (userId) => `/api/admin/users/${userId}`,
      transformResponse: (response: any) => response.data || response,
      providesTags: (result, error, userId) => [{ type: 'Users', id: userId }],
    }),

    updateUserStatus: builder.mutation<void, UpdateUserStatusRequest>({
      query: ({ userId, isActive }) => ({
        url: `/api/admin/users/${userId}/status`,
        method: 'PATCH',
        body: { isActive },
      }),
      invalidatesTags: ['Users', 'AdminMetrics'],
    }),

    updateUser: builder.mutation<UserAdmin, UpdateUserRequest>({
      query: ({ userId, ...data }) => ({
        url: `/api/admin/users/${userId}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'Users', id: userId },
        'Users',
      ],
    }),

    // Audit Logs
    listAuditLogs: builder.query<
      PaginatedResponse<AuditLog>,
      { page?: number; size?: number; filters?: AuditLogFilters }
    >({
      query: ({ page = 1, size = 20, filters = {} } = {}) => {
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('size', String(size));
        if (filters.search) params.append('search', filters.search);
        if (filters.action) params.append('action', filters.action);
        if (filters.targetType) params.append('targetType', filters.targetType);
        if (filters.performedBy) params.append('performedBy', filters.performedBy);
        if (filters.success !== undefined && filters.success !== 'ALL') {
          params.append('success', String(filters.success));
        }
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        return `/api/admin/logs?${params.toString()}`;
      },
      transformResponse: (response: any) => response.data || response,
      providesTags: ['AuditLogs'],
    }),
  }),
});

export const {
  useGetMetricsQuery,
  useListUsersAdminQuery,
  useGetUserAdminQuery,
  useUpdateUserStatusMutation,
  useUpdateUserMutation,
  useListAuditLogsQuery,
} = adminApi;
