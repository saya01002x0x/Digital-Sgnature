import React, { ReactNode } from 'react';
import { Provider, useSelector } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';
import { store } from '../store';
import { ThemeProvider } from './ThemeProvider';
import { routes } from '../routes';
import { ErrorBoundary } from 'react-error-boundary';
import { selectIsAuthenticated, selectUser } from '@/features/auth/authSlice';

interface AppProvidersProps {
  children?: ReactNode;
}

const ErrorFallback = () => {
  return (
    <div role="alert">
      <h2>Đã xảy ra lỗi</h2>
      <p>Vui lòng thử tải lại trang</p>
      <button onClick={() => window.location.reload()}>Tải lại</button>
    </div>
  );
};

const AppRouter: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  
  const router = createBrowserRouter(routes(isAuthenticated, user || undefined));
  
  return <RouterProvider router={router} />;
};

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <StyleProvider layer>
          <ConfigProvider>
            <ThemeProvider>
              <AppRouter />
              {children}
            </ThemeProvider>
          </ConfigProvider>
        </StyleProvider>
      </Provider>
    </ErrorBoundary>
  );
};
