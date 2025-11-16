import type React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { App as AntApp } from 'antd';
import { Header as UnifiedHeader } from '@/shared/components';
import './App.css';

export const App: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  // Unified header cho tất cả pages
  // Landing page có footer riêng trong LandingPage component
  return (
    <AntApp>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <UnifiedHeader />
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
        {!isLandingPage && (
          <footer style={{ 
            textAlign: 'center', 
            padding: '24px 50px',
            background: '#f0f2f5'
          }}>
            E-Signature ©{new Date().getFullYear()} - Nền tảng ký số điện tử
          </footer>
        )}
      </div>
    </AntApp>
  );
};
