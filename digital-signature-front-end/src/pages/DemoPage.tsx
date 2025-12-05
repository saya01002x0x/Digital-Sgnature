import React from 'react';
import { Card, Space, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectUser, logout } from '@/features/auth/authSlice';
import { useLogoutMutation } from '@/features/auth/api';
import { useNavigate } from 'react-router-dom';
import { STORAGE_KEYS, APP_ROUTES } from '@/app/config/constants';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { message } from 'antd';

const { Title, Text } = Typography;

export const DemoPage: React.FC = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
    } catch (error) {
      dispatch(logout());
      message.warning('Đã đăng xuất');
      navigate(APP_ROUTES.LOGIN);
    }
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout} logoutLoading={isLoading}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card>
          <Title level={3}>Trang Demo trắng</Title>
          <Text>Đây là trang trống để demo điều hướng từ menu bên trái.</Text>
        </Card>
      </Space>
    </DashboardLayout>
  );
};

