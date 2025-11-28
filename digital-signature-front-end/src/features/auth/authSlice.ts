import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthUser } from './types';
import { STORAGE_KEYS } from '@/app/config/constants';

const getInitialState = (): AuthState => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return {
    user: null,
    token: token,
    status: 'idle',
    error: null,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: AuthUser; token: string; refreshToken?: string }>) => {
      state.status = 'succeeded';
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, action.payload.token);
      if (action.payload.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, action.payload.refreshToken);
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    },
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } = authSlice.actions;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => !!state.auth.token;

export { authSlice };
