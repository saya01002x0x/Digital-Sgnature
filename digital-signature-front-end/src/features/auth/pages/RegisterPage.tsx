/**
 * RegisterPage Component
 * Page for user registration
 */

import type React from 'react';
import { Card, Typography, Space, Divider, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RegisterForm } from '../components/RegisterForm';
import { useRegisterMutation } from '../services/auth.api';
import type { RegisterFormValues } from '../types';

const { Title, Text } = Typography;

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [register, { isLoading, error }] = useRegisterMutation();

  const handleRegister = async (values: RegisterFormValues) => {
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
          maxWidth: 500,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              {t('auth.createAccount', 'Create Account')}
            </Title>
            <Text type="secondary">
              {t('auth.registerSubtitle', 'Join E-Signature platform today')}
            </Text>
          </div>

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
      </Card>
    </div>
  );
};
