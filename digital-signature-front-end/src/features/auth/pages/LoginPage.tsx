/**
 * LoginPage Component
 * Page for user login
 */

import type React from 'react';
import { Card, Typography, Space, Divider, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '../components/LoginForm';
import { useAppDispatch } from '@/app/hooks';
import { useLoginMutation } from '../services/auth.api';
import { setCredentials } from '../authSlice';
import type { LoginFormData } from '../utils/validators';

const { Title, Text } = Typography;

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async (values: LoginFormData) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials(result));
      message.success(t('auth.loginSuccess', 'Login successful!'));
      navigate('/documents');
    } catch (err: any) {
      message.error(err?.data?.message || t('auth.loginFailed', 'Login failed'));
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 450,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              {t('auth.welcomeBack', 'Welcome Back')}
            </Title>
            <Text type="secondary">
              {t('auth.loginSubtitle', 'Sign in to continue to E-Signature')}
            </Text>
          </div>

          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error ? String(error) : null}
          />

          <Divider>{t('common.or', 'OR')}</Divider>

          <div style={{ textAlign: 'center' }}>
            <Text>
              {t('auth.noAccount', "Don't have an account?")}{' '}
              <Link to="/register">
                {t('auth.registerNow', 'Register now')}
              </Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};
