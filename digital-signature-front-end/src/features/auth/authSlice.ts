/**
 * Auth Slice
 * Redux slice for authentication state management
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { AuthState, User } from './types/index';
import { STORAGE_KEYS } from '@/app/config/constants';

// Helper function to get user from localStorage
const getUserFromStorage = (): User | null => {
  try {
    const userJson = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return null;
  }
};

const initialState: AuthState = {
  user: getUserFromStorage(),
  token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.status = 'succeeded';
      state.error = null;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, action.payload.token);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(action.payload.user));
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.status = 'failed';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setCredentials, setUser, logout, setError, clearError } = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status;

// Export both for compatibility
export { authSlice };
export default authSlice.reducer;
