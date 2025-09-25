import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, AuthUser } from './types';
import { STORAGE_KEYS } from '@/app/config/constants';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: AuthUser; token: string }>) => {
      state.status = 'succeeded';
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, action.payload.token);
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
