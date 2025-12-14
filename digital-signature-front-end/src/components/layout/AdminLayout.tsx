import React, { ReactNode, useState } from 'react';
import { Layout, Typography, Space, Avatar, Button, Menu, Tabs } from 'antd';
import {
  MenuFoldOutlined,
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  FileTextOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/app/config/constants';
import { UserBase } from '@/shared/types';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

interface AdminLayoutProps {
  user?: UserBase | null;
  children: ReactNode;
  onLogout: () => Promise<void> | void;
  logoutLoading?: boolean;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
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

  // Menu items dành riêng cho admin - chỉ quản lý hệ thống
  const menuItems = [
    {
      key: APP_ROUTES.HOME,
      icon: <HomeOutlined />,
      label: 'Trang chủ',
    },
    {
      key: APP_ROUTES.ADMIN,
      icon: <BarChartOutlined />,
      label: 'Quản lý hệ thống',
    },
  ];

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
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <MenuFoldOutlined />
          {expanded && (
            <Typography.Text strong style={{ fontSize: '16px' }}>
              Quản trị hệ thống
            </Typography.Text>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleNavigate}
          style={{ borderRight: 0, marginTop: '8px' }}
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
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            Bảng điều khiển quản trị
          </Title>
          <Space size="large">
            {user && (
              <Space>
                <Avatar src={user.avatar} icon={<UserOutlined />} />
                <div>
                  <Text strong style={{ display: 'block', fontSize: '14px' }}>
                    {user.fullName || user.username}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Quản trị viên
                  </Text>
                </div>
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
        <Content style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
