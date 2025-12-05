import React, { ReactNode, useState } from 'react';
import { Layout, Typography, Space, Avatar, Button, Menu } from 'antd';
import {
  MenuFoldOutlined,
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/app/config/constants';
import { UserBase } from '@/shared/types';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

interface DashboardLayoutProps {
  user?: UserBase | null;
  children: ReactNode;
  onLogout: () => Promise<void> | void;
  logoutLoading?: boolean;
}

const menuItems = [
  {
    key: APP_ROUTES.HOME,
    icon: <HomeOutlined />,
    label: 'Trang chủ',
  },
  {
    key: APP_ROUTES.DEMO,
    icon: <AppstoreOutlined />,
    label: 'Demo trắng',
  },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  children,
  onLogout,
  logoutLoading,
}) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={expanded ? 220 : 72}
        collapsedWidth={72}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          transition: 'width 0.2s ease',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 20px',
          }}
        >
          <MenuFoldOutlined />
          {expanded && (
            <Typography.Text strong>Digital Signature</Typography.Text>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleNavigate}
        />
      </Sider>
      <Layout style={{ marginLeft: expanded ? 220 : 72, transition: 'margin 0.2s ease' }}>
        <Header
          style={{
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            Chữ ký số
          </Title>
          <Space>
            {user && (
              <Space>
                <Avatar src={user.avatar} icon={<UserOutlined />} />
                <Text strong>{user.fullName || user.username}</Text>
              </Space>
            )}
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={onLogout}
              loading={logoutLoading}
            >
              Đăng xuất
            </Button>
          </Space>
        </Header>
        <Content style={{ padding: 24, background: '#f4f6f8', minHeight: '100vh' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

