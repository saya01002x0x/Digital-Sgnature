import type React from 'react';
import { useState, useEffect } from 'react';
import { Menu, Row, Col, Popover, Avatar, Space, Button } from 'antd';
import { MenuOutlined, UserOutlined, LogoutOutlined, GlobalOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { APP_ROUTES, LOCALES, STORAGE_KEYS } from '@/app/config/constants';
import classNames from 'classnames';
import type { MenuProps } from 'antd';
import '../styles/header.css';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [isFirstScreen, setIsFirstScreen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const isLandingPage = location.pathname === '/';

  // Language toggle function
  const toggleLanguage = () => {
    const newLang = i18n.language === LOCALES.VI ? LOCALES.EN : LOCALES.VI;
    i18n.changeLanguage(newLang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLang);
  };

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
  const guestMenuItems: MenuProps['items'] = [
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
    {
      key: 'language',
      label: i18n.language === LOCALES.VI ? 'Tiếng Việt' : 'English',
      icon: <GlobalOutlined />,
      onClick: toggleLanguage,
    },
  ];

  // Menu items khi ĐÃ đăng nhập
  const authMenuItems: MenuProps['items'] = [
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
    {
      key: 'profile',
      label: (
        <Space>
          {user?.avatar && (
            <Avatar
              src={user.avatar}
              size="small"
              style={{ marginRight: -4 }}
            />
          )}
          {!isMobile && <span>{user?.name || t('nav.profile', 'Profile')}</span>}
          {isMobile && !user?.avatar && <UserOutlined />}
        </Space>
      ),
      icon: !user?.avatar && !isMobile ? <UserOutlined /> : undefined,
      children: [
        {
          key: 'profile-detail',
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
      ],
    },
    {
      key: 'language',
      label: i18n.language === LOCALES.VI ? 'Tiếng Việt' : 'English',
      icon: <GlobalOutlined />,
      onClick: toggleLanguage,
    },
  ];

  const menuItems = isAuthenticated ? authMenuItems : guestMenuItems;

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
    !isAuthenticated && (
      <div key="mobile-actions" style={{ padding: '8px 16px', borderTop: '1px solid #f0f0f0' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
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
        </Space>
      </div>
    ),
  ].filter(Boolean);

  // Auth buttons for guest users (desktop only)
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
              </div>
            ) : null}
        </Col>
      </Row>
    </header>
  );
};
