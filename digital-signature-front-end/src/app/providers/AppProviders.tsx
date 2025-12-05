import type { ReactNode } from 'react';
import type React from 'react';
import { Provider, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { StyleProvider } from '@ant-design/cssinjs';
import type { RootState } from '../store';
import { store } from '../store';
import { ThemeProvider } from './ThemeProvider';
import { routes } from '../routes';
import { ErrorBoundary } from 'react-error-boundary';
import { selectIsAuthenticated, selectUser } from '@/features/auth/authSlice';

type AppProvidersProps = {
  children?: ReactNode;
}

const ErrorFallback = () => {
  return (
    <div role="alert">
      <h2>Đã xảy ra lỗi</h2>
      <p>Vui lòng thử tải lại trang</p>
      <button onClick={() => { window.location.reload(); }}>Tải lại</button>
    </div>
  );
};

const RouterWrapper: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  
  // Convert User to UserBase for routes
  const userBase = user ? {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as any, // Type conversion for compatibility
  } : undefined;
  
  const router = createBrowserRouter(routes(isAuthenticated, userBase));

  return <RouterProvider router={router} />;
};

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <StyleProvider layer>
          <ThemeProvider>
            <RouterWrapper />
            {children}
          </ThemeProvider>
        </StyleProvider>
      </Provider>
    </ErrorBoundary>
  );
};
