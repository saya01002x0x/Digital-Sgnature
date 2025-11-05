/**
 * ProfilePage Component
 * Page for viewing and editing user profile
 */

import type React from 'react';
import { Card, Typography, Space, Row, Col, Tag, Divider } from 'antd';
import { UserOutlined, MailOutlined, CalendarOutlined, SafetyOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ProfileForm } from '../components/ProfileForm';
import { useAuth } from '../hooks/useAuth';
import { useUpdateProfileMutation } from '../services/auth.api';
import { useAppDispatch } from '@/app/hooks';
import { setUser } from '../authSlice';
import { LoadingSpinner } from '@/shared/components';
import { formatDate } from '@/shared/utils';
import type { ProfileFormValues } from '../types';

const { Title, Text } = Typography;

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleUpdateProfile = async (values: ProfileFormValues) => {
    try {
      const result = await updateProfile(values).unwrap();
      dispatch(setUser(result.user));
    } catch (error) {
      throw error;
    }
  };

  if (!user) {
    return <LoadingSpinner fullscreen />;
  }

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
                      {user.emailVerified && (
                        <Tag color="success" icon={<SafetyOutlined />}>
                          {t('profile.verified', 'Verified')}
                        </Tag>
                      )}
                    </Space>
                  </div>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div>
                  <Text type="secondary">{t('profile.role', 'Role')}</Text>
                  <div style={{ marginTop: 4 }}>
                    <Tag color={user.role === 'ADMIN' ? 'red' : 'blue'}>
                      {user.role}
                    </Tag>
                  </div>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div>
                  <Text type="secondary">{t('profile.memberSince', 'Member Since')}</Text>
                  <div style={{ marginTop: 4 }}>
                    <Space>
                      <CalendarOutlined />
                      <Text>{formatDate(user.createdAt)}</Text>
                    </Space>
                  </div>
                </div>

                <Divider style={{ margin: '12px 0' }} />

                <div>
                  <Text type="secondary">{t('profile.lastUpdated', 'Last Updated')}</Text>
                  <div style={{ marginTop: 4 }}>
                    <Space>
                      <CalendarOutlined />
                      <Text>{formatDate(user.updatedAt)}</Text>
                    </Space>
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

