/**
 * ProfilePage Component
 * Page for viewing and editing user profile
 * Note: Update profile functionality temporarily disabled until backend endpoint is available
 */

import type React from 'react';
import { Card, Typography, Space, Row, Col, Tag, Divider, message } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ProfileForm } from '../components/ProfileForm';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '@/shared/components';
import type { ProfileFormValues, User } from '../types/index';
import { UserRole } from '../types/index';

const { Title, Text } = Typography;

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user: authUser } = useAuth();

  // TODO: Add useUpdateProfileMutation when backend supports it
  const isLoading = false;

  const handleUpdateProfile = async (values: ProfileFormValues) => {
    try {
      // TODO: Implement when backend endpoint is available
      message.info(t('profile.updateNotAvailable', 'Profile update coming soon'));
    } catch (error) {
      throw error;
    }
  };

  if (!authUser) {
    return <LoadingSpinner fullscreen />;
  }

  // Convert AuthUser to User type for ProfileForm
  const user: User = {
    id: authUser.id || '',
    email: authUser.email,
    name: authUser.name || authUser.fullName || '',
    avatar: authUser.avatar,
    role: authUser.role?.toUpperCase() === 'ADMIN' ? UserRole.Admin : UserRole.User,
    emailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>{t('profile.title', 'My Profile')}</Title>
          <Text type="secondary">
            {t('profile.subtitle', 'Manage your account information')}
          </Text>
        </div>

        <Row gutter={[24, 24]}>
          {/* Profile Information Card */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <UserOutlined />
                  {t('profile.information', 'Profile Information')}
                </Space>
              }
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text type="secondary">{t('profile.email', 'Email')}</Text>
                  <div style={{ marginTop: 4 }}>
                    <Space>
                      <MailOutlined />
                      <Text strong>{user.email}</Text>
                    </Space>
                  </div>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div>
                  <Text type="secondary">{t('profile.role', 'Role')}</Text>
                  <div style={{ marginTop: 4 }}>
                    <Tag color={user.role === UserRole.Admin ? 'red' : 'blue'}>
                      {user.role}
                    </Tag>
                  </div>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div>
                  <Text type="secondary">{t('profile.name', 'Name')}</Text>
                  <div style={{ marginTop: 4 }}>
                    <Text>{user.name || '-'}</Text>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Edit Profile Card */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <UserOutlined />
                  {t('profile.editProfile', 'Edit Profile')}
                </Space>
              }
            >
              <ProfileForm
                user={user}
                onSubmit={handleUpdateProfile}
                isLoading={isLoading}
              />
            </Card>
          </Col>
        </Row>
      </Space>
    </div>
  );
};
