import type React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout, App as AntApp } from 'antd';
import { Header } from '@/shared/components';
import './App.css';

const { Content } = Layout;

// Routes that don't need header
const NO_HEADER_ROUTES = ['/login', '/register', '/forgot-password'];

export const App: React.FC = () => {
  const location = useLocation();
  const showHeader = !NO_HEADER_ROUTES.includes(location.pathname);

  return (
    <AntApp>
      <Layout style={{ minHeight: '100vh' }}>
        {showHeader && <Header />}
        <Content style={{ display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </Content>
      </Layout>
    </AntApp>
  );
};