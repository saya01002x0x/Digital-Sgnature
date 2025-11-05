/**
 * useAuth Hook
 * Custom hook for accessing authentication state and actions
 */

import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { useNavigate } from 'react-router-dom';
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthToken,
  selectAuthError,
  selectAuthStatus,
  logout as logoutAction,
  setCredentials,
} from '../authSlice';
import { useLoginMutation, useLogoutMutation } from '../services/auth.api';
import type { LoginRequest } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const token = useAppSelector(selectAuthToken);
  const error = useAppSelector(selectAuthError);
  const status = useAppSelector(selectAuthStatus);

  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const login = async (credentials: LoginRequest) => {
    try {
      const result = await loginMutation(credentials).unwrap();
      dispatch(setCredentials(result));
      navigate('/documents');
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch(logoutAction());
      navigate('/login');
    }
  };

  return {
    user,
    isAuthenticated,
    token,
    error,
    status,
    isLoading: isLoggingIn || isLoggingOut,
    login,
    logout,
  };
};

