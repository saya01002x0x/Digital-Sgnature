import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { env } from '@/app/config/env';
import { STORAGE_KEYS } from '@/app/config/constants';
import { RootState } from '../store';
import { loginSuccess } from '@/features/auth/authSlice';

const API_BASE_URL = env.VITE_API_URL?.trim() || 'http://localhost:5555';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth?.token || localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/api/auth/refresh',
          method: 'POST',
          params: { token: refreshToken },
        },
        api,
        extraOptions
      );
      
      if (refreshResult.data) {
        const data = refreshResult.data as any;
        if (data.data?.accessToken) {
          const newToken = data.data.accessToken;
          const newRefreshToken = data.data.refreshToken || refreshToken;
          
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
          if (newRefreshToken) {
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
          }
          
          const currentUser = (api.getState() as RootState).auth?.user;
          if (currentUser) {
            api.dispatch(loginSuccess({
              token: newToken,
              refreshToken: newRefreshToken,
              user: currentUser,
            }));
          }
          
          result = await baseQuery(args, api, extraOptions);
        }
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      }
    }
  }
  
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Users'],
  endpoints: () => ({}),
});

// Export hooks for usage in functional components
export const {
  util: { getRunningQueriesThunk },
} = baseApi;
