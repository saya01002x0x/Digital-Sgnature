import type React from 'react';
import { Suspense, lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { APP_ROUTES } from './config/constants';
import type { UserBase } from '@/shared/types';
import { App } from '@/App';

// Lazy-loaded components
const LandingPage = lazy(() => import('@/pages/landing/LandingPage'));
const TestCardPage = lazy(() => import('@/pages/TestCardPage').then(module => ({ default: module.TestCardPage })));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage').then(module => ({ default: module.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
const ProfilePage = lazy(() => import('@/features/auth/pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const UsersPage = lazy(() => import('@/features/users/pages/UsersPage').then(module => ({ default: module.UsersPage })));
const SignatureListPage = lazy(() => import('@/features/signature/pages/SignatureListPage').then(module => ({ default: module.SignatureListPage })));
const CreateSignaturePage = lazy(() => import('@/features/signature/pages/CreateSignaturePage').then(module => ({ default: module.CreateSignaturePage })));
const DocumentEditorPage = lazy(() => import('@/features/documents/pages/DocumentEditorPage').then(module => ({ default: module.DocumentEditorPage })));
const DocumentListPage = lazy(() => import('@/features/documents/pages/DocumentListPage').then(module => ({ default: module.DocumentListPage })));
const DocumentDetailPage = lazy(() => import('@/features/documents/pages/DocumentDetailPage').then(module => ({ default: module.DocumentDetailPage })));
const SigningRoomPage = lazy(() => import('@/features/invite-signing/pages/SigningRoomPage').then(module => ({ default: module.SigningRoomPage })));
const InviteSignersPage = lazy(() => import('@/features/invite-signing/pages/InviteSignersPage').then(module => ({ default: module.InviteSignersPage })));

// Loading fallback
const Loader = () => <div>Loading...</div>;

// Auth guard component
type ProtectedRouteProps = {
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
type RoleGuardProps = {
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
export const routes = (isAuthenticated: boolean, user?: UserBase): RouteObject[] => [{
  path: '/',
  element: <App />,
  children: [
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
    path: APP_ROUTES.PROFILE,
    element: (
      <Suspense fallback={<Loader />}>
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <ProfilePage />
        </ProtectedRoute>
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
    path: APP_ROUTES.SIGNATURES,
    element: (
      <Suspense fallback={<Loader />}>
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <SignatureListPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: `${APP_ROUTES.SIGNATURES}/create`,
    element: (
      <Suspense fallback={<Loader />}>
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <CreateSignaturePage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: APP_ROUTES.DOCUMENTS,
    element: (
      <Suspense fallback={<Loader />}>
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <DocumentListPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: `${APP_ROUTES.DOCUMENTS}/editor/:id`,
    element: (
      <Suspense fallback={<Loader />}>
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <DocumentEditorPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: `${APP_ROUTES.DOCUMENTS}/:id`,
    element: (
      <Suspense fallback={<Loader />}>
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <DocumentDetailPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: `${APP_ROUTES.DOCUMENTS}/:id/invite`,
    element: (
      <Suspense fallback={<Loader />}>
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <InviteSignersPage />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: '/signing/:token',
    element: (
      <Suspense fallback={<Loader />}>
        <SigningRoomPage />
      </Suspense>
    ),
  },
  {
    path: APP_ROUTES.HOME,
    element: (
      <Suspense fallback={<Loader />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: '/testcard',
    element: (
      <Suspense fallback={<Loader />}>
        <TestCardPage />
      </Suspense>
    ),
  },
  {
    path: APP_ROUTES.NOT_FOUND,
    element: <div>404 - Không tìm thấy trang</div>,
  },
  ],
}];