/**
 * RegisterPage Component
 * Page for user registration with OTP verification
 * Using pure Ant Design components
 */

import React from 'react';
import { Typography, Space, Divider, App } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RegisterForm } from '../components/RegisterForm';
import { AuthLayout } from '../components/AuthLayout';
import { useSendOtpMutation } from '../api';
import type { RegisterFormData } from '../utils/validators';

const { Text, Title } = Typography;

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation(['auth', 'translation']);
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();

  const handleRegisterSubmit = async (values: RegisterFormData) => {
    try {
      const response = await sendOtp({ email: values.email, type: 'REGISTER' }).unwrap();

      // message.success('OTP sent successfully!');
      // TODO: Remove in production
      // if (response.otp) {
      //   console.log('OTP:', response.otp);
      //   message.info(`Dev Mode: OTP is ${response.otp}`, 10);
      // }
      navigate('/verify-otp', { state: values });
    } catch (err: any) {
      if (err?.status === 409) {
        message.error('Email or Username already exists');
      } else {
        message.error(err?.data?.message || t('registerFailed'));
      }
    }
  };


  return (
    <AuthLayout
      title={t('createAccount')}
      description={t('registerSubtitle')}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <RegisterForm
          onSubmit={handleRegisterSubmit}
          isLoading={isSendingOtp}
          error={null}
        />

        <Divider>{t('common.or', { ns: 'translation' })}</Divider>

        <div style={{ textAlign: 'center' }}>
          <Text>
            {t('haveAccount')}{' '}
            <Link to="/login">
              {t('loginNow')}
            </Link>
          </Text>
        </div>
      </Space>
    </AuthLayout>
  );
};
