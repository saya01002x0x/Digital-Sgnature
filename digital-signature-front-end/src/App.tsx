import type React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout, App as AntApp } from 'antd';
import { Header as CustomHeader } from '@/shared/components';
import './App.css';

const { Content, Header, Footer } = Layout;

export const App: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  // Landing page có header và footer riêng, không dùng layout mặc định
  if (isLandingPage) {
    return (
      <AntApp>
        <Outlet />
      </AntApp>
    );
  }

  // Các trang khác dùng layout với Header/Footer mặc định
  return (
    <AntApp>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#ffffff', padding: 0 }}>
          <CustomHeader />
        </Header>
        <Content>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
      </Layout>
    </AntApp>
  );
};