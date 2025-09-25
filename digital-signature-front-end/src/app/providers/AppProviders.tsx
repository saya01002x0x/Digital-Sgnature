import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';
import { store } from '../store';
import { ThemeProvider } from './ThemeProvider';
import { routes } from '../routes';
import { ErrorBoundary } from 'react-error-boundary';

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

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  // In a real app, you would get this from your auth state
  const isAuthenticated = false;
  const user = undefined;
  
  // Create router with routes
  const router = createBrowserRouter(routes(isAuthenticated, user));

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <StyleProvider layer>
          <ConfigProvider>
            <ThemeProvider>
              <RouterProvider router={router} />
              {children}
            </ThemeProvider>
          </ConfigProvider>
        </StyleProvider>
      </Provider>
    </ErrorBoundary>
  );
};
