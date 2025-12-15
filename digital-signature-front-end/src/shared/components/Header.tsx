import type React from 'react';
import { useState, useEffect } from 'react';
import { Menu, Row, Col, Drawer, Avatar, Space, Button, Grid } from 'antd';
import { MenuOutlined, UserOutlined, LogoutOutlined, GlobalOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { APP_ROUTES, LOCALES, STORAGE_KEYS } from '@/app/config/constants';
import classNames from 'classnames';
import type { MenuProps } from 'antd';
import '../styles/header.css';

const { useBreakpoint } = Grid;

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const screens = useBreakpoint();

  const [menuVisible, setMenuVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // md = 768px. If screen is smaller than md, it is mobile (tablet vertical or phone)
  // useBreakpoint returns empty object initially during SSR or first mount, so handle that.
  const isMobile = !screens.md;

  const isLandingPage = location.pathname === '/';

  // Language toggle function
  const toggleLanguage = () => {
    const newLang = i18n.language === LOCALES.VI ? LOCALES.EN : LOCALES.VI;
    i18n.changeLanguage(newLang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLang);
  };

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
      label: t('nav.home'),
      onClick: () => {
        navigate('/');
        setMenuVisible(false);
      },
    },
    {
      key: 'docs',
      label: t('nav.docs'),
      onClick: () => {
        navigate('/#docs');
        setMenuVisible(false);
      },
    },
    {
      key: 'about',
      label: t('nav.about'),
      onClick: () => {
        navigate('/#about');
        setMenuVisible(false);
      },
    },
    {
      key: 'login',
      label: t('auth.login'),
      onClick: () => {
        navigate(APP_ROUTES.LOGIN);
        setMenuVisible(false);
      },
    },
    {
      key: 'register',
      label: t('auth.register'),
      onClick: () => {
        navigate(APP_ROUTES.REGISTER);
        setMenuVisible(false);
      },
    },
    {
      key: 'language',
      label: t(`language.${i18n.language}`),
      icon: <GlobalOutlined />,
      onClick: () => {
        toggleLanguage();
        setMenuVisible(false); // Close drawer if open
      },
    },
  ];

  // Menu items khi ĐÃ đăng nhập
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
  const authMenuItems: MenuProps['items'] = [
    {
      key: '/',
      label: t('nav.home'),
      onClick: () => {
        navigate('/');
        setMenuVisible(false);
      },
    },
    // Chỉ hiển thị Documents và Signatures cho user thường, không cho admin
    ...(!isAdmin ? [
      {
        key: '/documents',
        label: t('nav.documents'),
        onClick: () => {
          navigate('/documents');
          setMenuVisible(false);
        },
      },
      {
        key: '/signatures',
        label: t('nav.signatures'),
        onClick: () => {
          navigate('/signatures');
          setMenuVisible(false);
        },
      },
    ] : []),
    // Admin chỉ thấy menu Admin
    ...(isAdmin ? [{
      key: '/admin',
      label: t('nav.admin'),
      onClick: () => {
        navigate('/admin');
        setMenuVisible(false);
      },
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
          <span>{user?.name || t('nav.profile')}</span>
        </Space>
      ),
      icon: !user?.avatar ? <UserOutlined /> : undefined,
      children: [
        {
          key: 'profile-detail',
          icon: <UserOutlined />,
          label: t('nav.profile'),
          onClick: () => {
            navigate('/profile');
            setMenuVisible(false);
          },
        },
        {
          type: 'divider',
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: t('nav.logout'),
          danger: true,
          onClick: () => {
            logout();
            setMenuVisible(false);
          },
        },
      ],
    },
    {
      key: 'language',
      label: t(`language.${i18n.language}`),
      icon: <GlobalOutlined />,
      onClick: () => {
        toggleLanguage();
      },
    },
  ];

  const menuItems = isAuthenticated ? authMenuItems : guestMenuItems;

  return (
    <header id="header" className={headerClassName}>
      <div style={{ maxWidth: 1200, margin: '0 auto', height: '100%', padding: '0 16px' }}>
        <Row style={{ height: '100%', width: '100%', alignItems: 'center', flexWrap: 'nowrap' }}>
          <Col flex="200px" style={{ display: 'flex', alignItems: 'center' }}>
            <a id="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                alt="logo"
                src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                style={{ height: 32 }}
              />
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff', display: isMobile ? 'none' : 'block' }}>
                E-Signature
              </span>
            </a>
          </Col>
          <Col flex="auto" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {!isMobile ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Menu
                  mode="horizontal"
                  selectedKeys={[location.pathname]}
                  id="nav"
                  items={menuItems}
                  disabledOverflow
                  style={{ background: 'transparent', borderBottom: 'none', lineHeight: 'var(--header-height)' }}
                />
              </div>
            ) : (
              <Button
                type="text"
                icon={<MenuOutlined style={{ fontSize: 20 }} />}
                onClick={() => setMenuVisible(true)}
              />
            )}
          </Col>
        </Row>
      </div>

      <Drawer
        title="E-Signature"
        placement="right"
        onClose={() => setMenuVisible(false)}
        open={menuVisible}
        width={280}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ border: 'none' }}
        />
      </Drawer>
    </header>
  );
};
