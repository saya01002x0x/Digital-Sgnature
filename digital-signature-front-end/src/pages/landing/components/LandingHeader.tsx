/**
 * LandingHeader Component
 * Fixed header với hiệu ứng scroll: transparent -> white
 * Dựa trên template Ant Design 2.x landing page
 */

import type React from 'react';
import { Menu, Row, Col, Button, Popover } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import classNames from 'classnames';

type LandingHeaderProps = {
  isFirstScreen: boolean;
  isMobile: boolean;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ isFirstScreen, isMobile }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigate = useNavigate();

  const handleMenuVisibleChange = (visible: boolean) => {
    setMenuVisible(visible);
  };

  const handleShowMenu = () => {
    setMenuVisible(true);
  };

  const handleHideMenu = () => {
    setMenuVisible(false);
  };

  const headerClassName = classNames({
    clearfix: true,
    'home-nav-white': !isFirstScreen,
  });

  const menuMode = isMobile ? 'inline' : 'horizontal';

  const menuItems = [
    {
      key: 'home',
      label: 'Trang chủ',
      onClick: () => navigate('/'),
    },
    {
      key: 'features',
      label: 'Tính năng',
    },
    {
      key: 'pricing',
      label: 'Bảng giá',
    },
    {
      key: 'docs',
      label: 'Tài liệu',
    },
    {
      key: 'about',
      label: 'Về chúng tôi',
    },
  ];

  const menu = [
    <LanguageSwitcher key="lang" />,
    <Menu 
      mode={menuMode} 
      defaultSelectedKeys={['home']} 
      id="nav" 
      key="nav"
      items={menuItems}
    />,
  ];

  return (
    <header id="header" className={headerClassName}>
      {menuMode === 'inline' ? (
        <Popover
          overlayClassName="popover-menu"
          placement="bottomRight"
          content={menu}
          trigger="click"
          open={menuVisible}
          onOpenChange={handleMenuVisibleChange}
        >
          <MenuOutlined
            className="nav-phone-icon"
            style={{ fontSize: 24, color: isFirstScreen ? '#fff' : '#666', cursor: 'pointer' }}
            onClick={handleShowMenu}
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
          {menuMode === 'horizontal' ? menu : null}
        </Col>
      </Row>
    </header>
  );
};

