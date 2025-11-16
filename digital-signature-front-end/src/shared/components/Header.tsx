/**
 * Unified Header Component
 * Header thống nhất cho toàn bộ app với design từ Landing template
 * - Transparent → white effect ở landing page
 * - Menu items thay đổi theo authentication status
 * - Avatar user dropdown khi đã đăng nhập
 */

import type React from 'react';
import { useState, useEffect } from 'react';
import { Menu, Row, Col, Popover, Avatar, Dropdown, Space, Button } from 'antd';
import { MenuOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { LanguageSwitcherButton } from './LanguageSwitcherButton';
import { APP_ROUTES } from '@/app/config/constants';
import classNames from 'classnames';
import type { MenuProps } from 'antd';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [isFirstScreen, setIsFirstScreen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const isLandingPage = location.pathname === '/';

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Detect scroll for transparent effect (chỉ ở landing page)
  useEffect(() => {
    if (!isLandingPage) {
      setIsFirstScreen(false);
      return;
    }

    const handleScroll = () => {
      // Banner section height là 100vh, threshold ~90% của banner
      const scrollThreshold = window.innerHeight * 0.9;
      setIsFirstScreen(window.scrollY < scrollThreshold);
    };

    handleScroll(); // Check initial position
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLandingPage]);

  const headerClassName = classNames({
    clearfix: true,
    'home-nav-white': !isFirstScreen || !isLandingPage,
  });

  const menuMode = isMobile ? 'inline' : 'horizontal';

  // Menu items khi CHƯA đăng nhập
  const guestMenuItems = [
    {
      key: 'home',
      label: t('nav.home', 'Trang chủ'),
      onClick: () => navigate('/'),
    },
    {
      key: 'features',
      label: t('nav.features', 'Tính năng'),
      onClick: () => navigate('/#features'),
    },
    {
      key: 'pricing',
      label: t('nav.pricing', 'Bảng giá'),
      onClick: () => navigate('/#pricing'),
    },
    {
      key: 'docs',
      label: t('nav.docs', 'Tài liệu'),
      onClick: () => navigate('/#docs'),
    },
    {
      key: 'about',
      label: t('nav.about', 'Về chúng tôi'),
      onClick: () => navigate('/#about'),
    },
  ];

  // Menu items khi ĐÃ đăng nhập
  const authMenuItems = [
    {
      key: '/',
      label: t('nav.home', 'Trang chủ'),
      onClick: () => navigate('/'),
    },
    {
      key: '/documents',
      label: t('nav.documents', 'Tài liệu'),
      onClick: () => navigate('/documents'),
    },
    {
      key: '/signatures',
      label: t('nav.signatures', 'Chữ ký'),
      onClick: () => navigate('/signatures'),
    },
    ...(user?.role === 'ADMIN' ? [{
      key: '/admin',
      label: t('nav.admin', 'Admin'),
      onClick: () => navigate('/admin'),
    }] : []),
  ];

  const menuItems = isAuthenticated ? authMenuItems : guestMenuItems;

  // User dropdown menu items
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
      label: t('nav.logout', 'Đăng xuất'),
      danger: true,
      onClick: logout,
    },
  ];

  const handleMenuVisibleChange = (visible: boolean) => {
    setMenuVisible(visible);
  };

  // Menu content for mobile popover
  const mobileMenuContent = [
    <Menu 
      mode="inline" 
      selectedKeys={[location.pathname]}
      id="nav" 
      key="nav"
      items={menuItems}
      style={{ background: 'transparent' }}
    />,
    <div key="mobile-actions" style={{ padding: '8px 16px', borderTop: '1px solid #f0f0f0' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <LanguageSwitcherButton />
        {!isAuthenticated && (
          <>
            <Button 
              block
              onClick={() => navigate(APP_ROUTES.LOGIN)}
            >
              {t('auth.login', 'Đăng nhập')}
            </Button>
            <Button 
              type="primary"
              block
              onClick={() => navigate(APP_ROUTES.REGISTER)}
            >
              {t('auth.register', 'Đăng ký')}
            </Button>
          </>
        )}
        {isAuthenticated && user && (
          <Space>
            <Avatar
              src={user.avatar}
              icon={!user.avatar && <UserOutlined />}
              style={{ backgroundColor: '#1890ff' }}
            />
            <span>{user.name}</span>
          </Space>
        )}
      </Space>
    </div>
  ];

  // Auth buttons for guest users
  const authButtons = !isAuthenticated && (
    <Space key="auth-buttons" size="small" style={{ marginLeft: 16 }}>
      <Button 
        size="small"
        onClick={() => navigate(APP_ROUTES.LOGIN)}
        style={{ 
          color: isFirstScreen && isLandingPage ? '#fff' : undefined,
          borderColor: isFirstScreen && isLandingPage ? '#fff' : undefined 
        }}
      >
        {t('auth.login', 'Đăng nhập')}
      </Button>
      <Button 
        type="primary"
        size="small"
        onClick={() => navigate(APP_ROUTES.REGISTER)}
      >
        {t('auth.register', 'Đăng ký')}
      </Button>
    </Space>
  );

  // Avatar dropdown for authenticated users
  const userAvatar = isAuthenticated && user && (
    <Dropdown 
      key="user-dropdown"
      menu={{ items: userMenuItems }} 
      placement="bottomRight"
      arrow
    >
      <Space style={{ cursor: 'pointer', marginLeft: 16 }}>
        <Avatar
          src={user.avatar}
          icon={!user.avatar && <UserOutlined />}
          style={{ backgroundColor: '#1890ff' }}
        />
        {!isMobile && (
          <span style={{ 
            color: isFirstScreen && isLandingPage ? '#fff' : undefined 
          }}>
            {user.name}
          </span>
        )}
      </Space>
    </Dropdown>
  );

  return (
    <header id="header" className={headerClassName}>
      {menuMode === 'inline' ? (
        <Popover
          overlayClassName="popover-menu"
          placement="bottomRight"
          content={mobileMenuContent}
          trigger="click"
          open={menuVisible}
          onOpenChange={handleMenuVisibleChange}
        >
          <MenuOutlined
            className="nav-phone-icon"
            style={{ 
              fontSize: 24, 
              color: isFirstScreen && isLandingPage ? '#fff' : '#666', 
              cursor: 'pointer' 
            }}
          />
        </Popover>
      ) : null}
      
      <Row>
        <Col lg={4} md={5} sm={24} xs={24}>
          <a id="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img 
              alt="logo" 
              src="https://t.alipayobjects.com/images/rmsweb/T1B9hfXcdvXXXXXXXX.svg" 
            />
            <span>E-Signature</span>
          </a>
        </Col>
        <Col lg={20} md={19} sm={0} xs={0}>
            {menuMode === 'horizontal' ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
              <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                id="nav"
                items={menuItems}
                style={{
                  background: 'transparent',
                  flex: 1,
                  justifyContent: 'flex-end',
                  border: 'none'
                }}
              />
                {authButtons}
                {userAvatar}
                <LanguageSwitcherButton />
              </div>
            ) : null}
        </Col>
      </Row>
    </header>
  );
};
