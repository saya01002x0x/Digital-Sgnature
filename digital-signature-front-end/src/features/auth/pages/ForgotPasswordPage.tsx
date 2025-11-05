/**
 * ForgotPasswordPage Component
 * Page for requesting password reset
 */

import type React from 'react';
import { Card, Typography, Space, Form, Input, Button, Alert, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForgotPasswordMutation } from '../services/auth.api';

const { Title, Text } = Typography;

export const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation();

  const handleSubmit = async (values: { email: string }) => {
    try {
      await forgotPassword(values).unwrap();
      message.success(t('auth.resetEmailSent', 'Password reset instructions sent to your email'));
    } catch (err: any) {
      message.error(err?.data?.message || t('auth.resetEmailFailed', 'Failed to send reset email'));
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
          <div>
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <ArrowLeftOutlined />
              {t('common.back', 'Back to login')}
            </Link>

            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ marginBottom: 8 }}>
                {t('auth.forgotPassword', 'Forgot Password?')}
              </Title>
              <Text type="secondary">
                {t('auth.forgotPasswordSubtitle', 'Enter your email to reset your password')}
              </Text>
            </div>
          </div>

          {isSuccess ? (
            <Alert
              message={t('auth.checkEmail', 'Check your email')}
              description={t('auth.resetInstructions', 'We have sent password reset instructions to your email address.')}
              type="success"
              showIcon
            />
          ) : (
            <Form
              form={form}
              name="forgot-password"
              onFinish={handleSubmit}
              layout="vertical"
              requiredMark={false}
            >
              <Form.Item
                name="email"
                label={t('auth.email', 'Email')}
                rules={[
                  { required: true, message: t('auth.emailRequired', 'Email is required') },
                  { type: 'email', message: t('auth.emailInvalid', 'Invalid email address') },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder={t('auth.emailPlaceholder', 'Enter your email')}
                  size="large"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={isLoading}
                  size="large"
                >
                  {t('auth.sendResetLink', 'Send Reset Link')}
                </Button>
              </Form.Item>
            </Form>
          )}
        </Space>
      </Card>
    </div>
  );
};

