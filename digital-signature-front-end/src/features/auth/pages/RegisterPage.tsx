/**
 * RegisterPage Component
 * Page for user registration
 * Using pure Ant Design components
 */

import type React from 'react';
import { Typography, Space, Divider, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RegisterForm } from '../components/RegisterForm';
import { AuthLayout } from '../components/AuthLayout';
import { useRegisterMutation } from '../services/auth.api';
import type { RegisterFormData } from '../utils/validators';

const { Text } = Typography;

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [register, { isLoading, error }] = useRegisterMutation();

  const handleRegister = async (values: RegisterFormData) => {
    try {
      await register({
        email: values.email,
        password: values.password,
        name: values.name,
      }).unwrap();
      
      message.success(t('auth.registerSuccess', 'Registration successful! Please login.'));
      navigate('/login');
    } catch (err: any) {
      message.error(err?.data?.message || t('auth.registerFailed', 'Registration failed'));
    }
  };

  return (
    <AuthLayout
      title={t('auth.createAccount', 'Create Account')}
      description={t('auth.registerSubtitle', 'Join E-Signature platform today')}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <RegisterForm
          onSubmit={handleRegister}
          isLoading={isLoading}
          error={error ? String(error) : null}
        />

        <Divider>{t('common.or', 'OR')}</Divider>

        <div style={{ textAlign: 'center' }}>
          <Text>
            {t('auth.haveAccount', 'Already have an account?')}{' '}
            <Link to="/login">
              {t('auth.loginNow', 'Login now')}
            </Link>
          </Text>
        </div>
      </Space>
    </AuthLayout>
  );
};
