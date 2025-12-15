import React, { useState } from 'react';
import { Form, Input, Button, Typography, Steps, App, Card } from 'antd';
import { MailOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../components/AuthLayout';
import { useSendOtpMutation, useResetPasswordMutation } from '../api';

const { Text } = Typography;

export const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const handleSendOtp = async (values: { email: string }) => {
    try {
      await sendOtp({ email: values.email, type: 'FORGOT_PASSWORD' }).unwrap();
      setEmail(values.email);
      message.success(t('forgotPassword.otpSentSuccess'));
      setStep(1);
    } catch (error: any) {
      if (error?.status === 404) {
        message.error(t('forgotPassword.emailNotFound'));
      } else {
        message.error(error?.data?.message || t('forgotPassword.sendOtpFailed'));
      }
    }
  };

  const handleResetPassword = async (values: { otp: string; newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error(t('forgotPassword.passwordMismatch'));
      return;
    }

    try {
      await resetPassword({ email, otp: values.otp, newPassword: values.newPassword }).unwrap();
      message.success(t('forgotPassword.resetSuccess'));
      navigate('/login');
    } catch (error: any) {
      message.error(error?.data?.message || t('forgotPassword.resetFailed'));
    }
  };

  const renderEmailStep = () => (
    <Form onFinish={handleSendOtp} layout="vertical">
      <Form.Item
        name="email"
        rules={[
          { required: true, message: t('forgotPassword.emailRequired') },
          { type: 'email', message: t('forgotPassword.emailInvalid') }
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder={t('forgotPassword.emailPlaceholder')}
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={isSendingOtp}>
          {t('forgotPassword.sendOtp')}
        </Button>
      </Form.Item>
    </Form>
  );

  const renderResetStep = () => (
    <Form onFinish={handleResetPassword} layout="vertical">
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">{t('forgotPassword.otpSentTo')} {email}</Text>
      </div>

      <Form.Item
        name="otp"
        rules={[{ required: true, message: t('forgotPassword.otpRequired') }]}
      >
        <Input
          prefix={<SafetyOutlined />}
          placeholder={t('forgotPassword.otpPlaceholder')}
          size="large"
          maxLength={6}
        />
      </Form.Item>

      <Form.Item
        name="newPassword"
        rules={[
          { required: true, message: t('forgotPassword.newPasswordRequired') },
          { min: 6, message: t('forgotPassword.newPasswordMin') }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder={t('forgotPassword.newPasswordPlaceholder')}
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        rules={[
          { required: true, message: t('forgotPassword.confirmNewPasswordRequired') }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder={t('forgotPassword.confirmNewPasswordPlaceholder')}
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={isResetting}>
          {t('forgotPassword.resetPassword')}
        </Button>
      </Form.Item>
      <div style={{ textAlign: 'center' }}>
        <Button type="link" onClick={() => setStep(0)}>
          {t('forgotPassword.backToEmail')}
        </Button>
      </div>
    </Form>
  );

  const steps = [
    { title: t('forgotPassword.stepEmail'), content: renderEmailStep() },
    { title: t('forgotPassword.stepReset'), content: renderResetStep() },
  ];

  return (
    <AuthLayout
      title={t('forgotPassword.title')}
      description={t('forgotPassword.description')}
    >
      <Card variant="borderless" styles={{ body: { padding: 0 } }}>
        <Steps
          current={step}
          items={steps.map(s => ({ title: s.title }))}
          size="small"
          style={{ marginBottom: 24 }}
        />
        {steps[step].content}

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Text>
            {t('forgotPassword.rememberPassword')} <Link to="/login">{t('forgotPassword.loginNow')}</Link>
          </Text>
        </div>
      </Card>
    </AuthLayout>
  );
};
