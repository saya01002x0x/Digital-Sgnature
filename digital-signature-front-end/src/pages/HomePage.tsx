import React from 'react';
import { Layout, Button, Typography, Card, Space, Avatar, message } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useLogoutMutation } from '@/features/auth/api';
import { logout, selectUser } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/app/config/constants';
import { STORAGE_KEYS } from '@/app/config/constants';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [logoutApi, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
      
      dispatch(logout());
      message.success('Đăng xuất thành công!');
      navigate(APP_ROUTES.LOGIN);
    } catch (error: any) {
      console.error('Logout error:', error);
      dispatch(logout());
      message.warning('Đã đăng xuất');
      navigate(APP_ROUTES.LOGIN);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '0 24px'
      }}>
        <Title level={3} style={{ color: '#fff', margin: 0 }}>
          Chữ ký số
        </Title>
        <Space>
          {user && (
            <Space>
              <Avatar 
                src={user.avatar} 
                icon={<UserOutlined />} 
                size="large"
              />
              <Text strong style={{ color: '#fff' }}>
                {user.fullName || user.username || user.name}
              </Text>
            </Space>
          )}
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            loading={isLoading}
          >
            Đăng xuất
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <Card>
          <Title level={2}>Chào mừng đến với hệ thống Chữ ký số</Title>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card>
              <Title level={4}>Thông tin tài khoản</Title>
              <Space direction="vertical">
                <Text><strong>Tên đăng nhập:</strong> {user?.username}</Text>
                <Text><strong>Email:</strong> {user?.email}</Text>
                <Text><strong>Họ và tên:</strong> {user?.fullName}</Text>
                {user?.phone && <Text><strong>Số điện thoại:</strong> {user?.phone}</Text>}
                {user?.address && <Text><strong>Địa chỉ:</strong> {user?.address}</Text>}
                <Text><strong>Vai trò:</strong> {user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</Text>
              </Space>
            </Card>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

