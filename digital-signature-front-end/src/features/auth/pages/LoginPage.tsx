/**
 * LoginPage Component
 * Page for user login
 * Using pure Ant Design components
 */

import type React from 'react';
import { Typography, Space, Divider, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '../components/LoginForm';
import { AuthLayout } from '../components/AuthLayout';
import { useAppDispatch } from '@/app/hooks';
import { useLoginMutation } from '../services/auth.api';
import { setCredentials } from '../authSlice';
import type { LoginFormData } from '../utils/validators';

const { Text } = Typography;

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
    <AuthLayout
      title={t('auth.welcomeBack', 'Welcome Back')}
      description={t('auth.loginSubtitle', 'Sign in to continue to E-Signature')}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
    </AuthLayout>
  );
};
