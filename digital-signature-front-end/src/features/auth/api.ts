import { baseApi } from '@/app/api/baseApi';
import { ApiError } from '@/app/api/baseTypes';
import { LoginFormValues, Tokens, AuthUser } from './types';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface BackendResponse<T> {
  status: number;
  message: string;
  data: T;
}

interface UserResponse {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  avatar?: string;
  isActive?: boolean;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

// Auth API endpoints
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ user: AuthUser; token: string; refreshToken: string }, LoginFormValues>({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: BackendResponse<AuthResponse>) => {
        return {
          token: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          user: {} as AuthUser,
        };
      },
      transformErrorResponse: (response: ApiError) => response,
    }),

    sendOtp: builder.mutation<{ otp: string; message: string }, { email: string }>({
      query: (data) => ({
        url: '/api/auth/send-otp',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: BackendResponse<{ otp: string; message: string }>) => response.data,
      transformErrorResponse: (response: ApiError) => response,
    }),

    verifyOtp: builder.mutation<{ user: AuthUser; token: string; refreshToken: string }, { username: string; email: string; password: string; fullName: string; phone?: string; address?: string; dateOfBirth?: string; gender?: string; otp: string; avatar?: File }>({
      query: (data) => {
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('fullName', data.fullName);
        if (data.phone) formData.append('phone', data.phone);
        if (data.address) formData.append('address', data.address);
        if (data.dateOfBirth) formData.append('dateOfBirth', data.dateOfBirth);
        if (data.gender) formData.append('gender', data.gender);
        formData.append('otp', data.otp);
        if (data.avatar) formData.append('avatar', data.avatar);

        return {
          url: '/api/auth/verify-otp',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: BackendResponse<AuthResponse>) => {
        return {
          token: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          user: {} as AuthUser,
        };
      },
      transformErrorResponse: (response: ApiError) => response,
    }),

    register: builder.mutation<{ user: AuthUser; token: string; refreshToken: string }, { email: string; password: string; fullName: string; username: string }>({
      query: (userData) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: BackendResponse<AuthResponse>) => {
        return {
          token: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          user: {} as AuthUser,
        };
      },
      transformErrorResponse: (response: ApiError) => response,
    }),

    logout: builder.mutation<void, string>({
      query: (refreshToken) => ({
        url: `/api/auth/logout?token=${refreshToken}`,
        method: 'POST',
      }),
    }),

    refreshToken: builder.mutation<Tokens, string>({
      query: (refreshToken) => ({
        url: `/api/auth/refresh?token=${refreshToken}`,
        method: 'POST',
      }),
      transformResponse: (response: BackendResponse<AuthResponse>) => {
        return {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        };
      },
    }),

    getProfile: builder.query<AuthUser, void>({
      query: () => '/api/auth/me',
      providesTags: ['Auth'],
      transformResponse: (response: BackendResponse<UserResponse>) => {
        return {
          id: response.data.id,
          email: response.data.email,
          name: response.data.fullName,
          role: response.data.role as 'user' | 'admin',
          username: response.data.username,
          fullName: response.data.fullName,
          phone: response.data.phone,
          address: response.data.address,
          avatar: response.data.avatar,
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetProfileQuery,
} = authApi;
