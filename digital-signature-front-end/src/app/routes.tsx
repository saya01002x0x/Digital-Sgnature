import React, { Suspense, lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { APP_ROUTES } from './config/constants';
import { UserBase } from '@/shared/types';

// Lazy-loaded components
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage').then(module => ({ default: module.RegisterPage })));
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage').then(module => ({ default: module.UsersPage })));

// Loading fallback
const Loader = () => <div>Loading...</div>;

// Auth guard component
interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  redirectPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated,
  redirectPath = APP_ROUTES.LOGIN,
}) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return <>{children}</>;
};

// Role guard component
interface RoleGuardProps {
  children: React.ReactNode;
  userRoles: string[];
  allowedRoles: string[];
  fallbackPath?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  userRoles,
  allowedRoles,
  fallbackPath = APP_ROUTES.HOME,
}) => {
  const hasPermission = userRoles.some(role => allowedRoles.includes(role));
  
  if (!hasPermission) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  return <>{children}</>;
};

// Route configuration
export const routes = (isAuthenticated: boolean, user?: UserBase): RouteObject[] => [
  {
    path: APP_ROUTES.LOGIN,
    element: (
      <Suspense fallback={<Loader />}>
        {isAuthenticated ? <Navigate to={APP_ROUTES.HOME} replace /> : <LoginPage />}
      </Suspense>
    ),
  },
  {
    path: APP_ROUTES.REGISTER,
    element: (
      <Suspense fallback={<Loader />}>
        {isAuthenticated ? <Navigate to={APP_ROUTES.HOME} replace /> : <RegisterPage />}
      </Suspense>
    ),
  },
  {
    path: APP_ROUTES.USERS,
    element: (
      <Suspense fallback={<Loader />}>
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          {user && (
            <RoleGuard
              userRoles={[user.role]}
              allowedRoles={['admin']}
              fallbackPath={APP_ROUTES.HOME}
            >
              <UsersPage />
            </RoleGuard>
          )}
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: APP_ROUTES.HOME,
    element: (
      <Suspense fallback={<Loader />}>
        {isAuthenticated ? <div>Home Page</div> : <Navigate to={APP_ROUTES.LOGIN} replace />}
      </Suspense>
    ),
  },
  {
    path: APP_ROUTES.NOT_FOUND,
    element: <div>404 - Không tìm thấy trang</div>,
  },
];
