import { baseApi } from '@/app/api/baseApi';
import { ApiError } from '@/app/api/baseTypes';
import { LoginFormValues, Tokens, AuthUser } from './types';

// Auth API endpoints
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ user: AuthUser; token: string }, LoginFormValues>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformErrorResponse: (response: ApiError) => response,
    }),
    
    register: builder.mutation<{ user: AuthUser; token: string }, LoginFormValues>({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
      }),
      transformErrorResponse: (response: ApiError) => response,
    }),
    
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),
    
    refreshToken: builder.mutation<Tokens, string>({
      query: (refreshToken) => ({
        url: 'auth/refresh',
        method: 'POST',
        body: { refreshToken },
      }),
    }),
    
    getProfile: builder.query<AuthUser, void>({
      query: () => 'auth/profile',
      providesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
} = authApi;
