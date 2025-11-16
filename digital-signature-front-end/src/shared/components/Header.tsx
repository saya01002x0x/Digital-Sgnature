/**
 * Header Component
 * Main application header with navigation and user menu
 */

import type React from 'react';
import { Layout, Menu, Dropdown, Avatar, Space, Button, Typography } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  FileTextOutlined,
  EditOutlined,
  DashboardOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

type HeaderProps = {
  collapsed?: boolean;
  onCollapse?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCollapse }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Navigation menu items
  const navMenuItems: MenuProps['items'] = isAuthenticated ? [
    {
      key: '/documents',
      icon: <FileTextOutlined />,
      label: t('nav.documents', 'Documents'),
      onClick: () => navigate('/documents'),
    },
    {
      key: '/signatures',
      icon: <EditOutlined />,
      label: t('nav.signatures', 'Signatures'),
      onClick: () => navigate('/signatures'),
    },
    ...(user?.role === 'ADMIN' ? [{
      key: '/admin',
      icon: <DashboardOutlined />,
      label: t('nav.admin', 'Admin'),
      onClick: () => navigate('/admin'),
    }] : []),
  ] : [];

  // User dropdown menu
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: t('nav.profile', 'Profile'),
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: t('nav.logout', 'Logout'),
      danger: true,
      onClick: logout,
    },
  ];

  return (
    <AntHeader
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      {/* Left Section - Logo & Mobile Menu Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {isAuthenticated && onCollapse && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={onCollapse}
            style={{ display: 'none' }}
            className="mobile-menu-trigger"
          />
        )}
        
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <EditOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
            {t('app.name', 'E-Signature')}
          </Text>
        </div>
      </div>

      {/* Center Section - Navigation Menu (Desktop) */}
      {isAuthenticated && (
        <div style={{ flex: 1, marginLeft: 48, display: 'flex', justifyContent: 'center' }}>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={navMenuItems}
            style={{ border: 'none', flex: 1, maxWidth: 600, justifyContent: 'center' }}
          />
        </div>
      )}

      {/* Right Section - Theme, Language, User Menu */}
      <Space size="middle">
        {/* <ThemeSwitcher /> */}
        <LanguageSwitcher />

        {isAuthenticated && user ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
            <Space style={{ cursor: 'pointer' }}>
              <Avatar
                src={user.avatar}
                icon={!user.avatar && <UserOutlined />}
                style={{ backgroundColor: '#1890ff' }}
              />
              <Text style={{ display: 'none' }} className="username-display">
                {user.name}
              </Text>
            </Space>
          </Dropdown>
        ) : (
          <Space>
            <Button onClick={() => navigate('/login')}>
              {t('auth.login', 'Login')}
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              {t('auth.register', 'Register')}
            </Button>
          </Space>
        )}
      </Space>

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 768px) {
          .username-display {
            display: inline !important;
          }
        }

        @media (max-width: 767px) {
          .mobile-menu-trigger {
            display: inline-flex !important;
          }
        }
      `}</style>
    </AntHeader>
  );
};

