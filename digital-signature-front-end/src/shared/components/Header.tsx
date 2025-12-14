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
  const [scrolled, setScrolled] = useState(false);
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

  // Detect scroll for glass effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClassName = classNames({
    scrolled: scrolled || !isLandingPage,
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
      key: 'login',
      label: t('auth.login', 'Đăng nhập'),
      onClick: () => navigate(APP_ROUTES.LOGIN),
    },
    {
      key: 'register',
      label: t('auth.register', 'Đăng ký'),
      onClick: () => navigate(APP_ROUTES.REGISTER),
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
    ...(user?.role?.toUpperCase() === 'ADMIN' ? [{
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
      style={{ background: 'transparent', border: 'none' }}
    />,
  ];



  return (
    <header id="header" className={headerClassName}>
      <div style={{ maxWidth: 1200, margin: '0 auto', height: '100%', display: 'flex', alignItems: 'center' }}>
        <Row style={{ height: '100%', width: '100%', alignItems: 'center' }}>
          <Col flex="200px" style={{ display: 'flex', alignItems: 'center' }}>
            <a id="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <img
                alt="logo"
                src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
              />
              <span>E-Signature</span>
            </a>
          </Col>
          <Col flex="auto" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {menuMode === 'horizontal' ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Menu
                  mode="horizontal"
                  selectedKeys={[location.pathname]}
                  id="nav"
                  items={menuItems}
                  disabledOverflow
                />

              </div>
            ) : (
              <Popover
                overlayClassName="popover-menu"
                placement="bottomRight"
                content={mobileMenuContent}
                trigger="click"
                open={menuVisible}
                onOpenChange={handleMenuVisibleChange}
                arrow={false}
              >
                <MenuOutlined
                  className="nav-phone-icon"
                  style={{
                    fontSize: 24,
                    color: '#333',
                    cursor: 'pointer'
                  }}
                />
              </Popover>
            )}
          </Col>
        </Row>
      </div>
    </header>
  );
};
