/**
 * useAuthGuard Hook
 * Custom hook for protecting routes and checking authentication
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { selectIsAuthenticated, selectUser } from '../authSlice';
import type { UserRole } from '../types/index';

type UseAuthGuardOptions = {
  requireAuth?: boolean;
  requireRole?: UserRole;
  redirectTo?: string;
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const {
    requireAuth = true,
    requireRole,
    redirectTo = '/login',
  } = options;

  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  useEffect(() => {
    // Check authentication
    if (requireAuth && !isAuthenticated) {
      navigate(redirectTo, {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }

    // Check role if specified
    if (requireRole && user && user.role !== requireRole) {
      navigate('/unauthorized', { replace: true });
      return;
    }
  }, [isAuthenticated, user, requireAuth, requireRole, redirectTo, navigate, location]);

  return {
    isAuthenticated,
    user,
    isAuthorized: !requireRole || (user && user.role === requireRole),
  };
};

