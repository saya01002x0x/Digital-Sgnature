import React, { useState } from 'react';
import { Form, Input, Button, Typography, Space, Steps, App, Card } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { useSendOtpMutation, useResetPasswordMutation } from '../api';

const { Title, Text } = Typography;

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const handleSendOtp = async (values: { email: string }) => {
    try {
      const response = await sendOtp({ email: values.email, type: 'FORGOT_PASSWORD' }).unwrap();
      setEmail(values.email);
      message.success('OTP sent successfully!');
      setStep(1);
    } catch (error: any) {
      if (error?.status === 404) {
        message.error('Email not found');
      } else {
        message.error(error?.data?.message || 'Failed to send OTP');
      }
    }
  };

  const handleResetPassword = async (values: { otp: string; newPassword: string; confirmPassword: string }) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    try {
      await resetPassword({ email, otp: values.otp, newPassword: values.newPassword }).unwrap();
      message.success('Password reset successfully! Please login.');
      navigate('/login');
    } catch (error: any) {
      message.error(error?.data?.message || 'Failed to reset password');
    }
  };

  const renderEmailStep = () => (
    <Form onFinish={handleSendOtp} layout="vertical">
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email!' }
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="Email Address"
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={isSendingOtp}>
          Send OTP
        </Button>
      </Form.Item>
    </Form>
  );

  const renderResetStep = () => (
    <Form onFinish={handleResetPassword} layout="vertical">
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">OTP sent to {email}</Text>
      </div>

      <Form.Item
        name="otp"
        rules={[{ required: true, message: 'Please input OTP!' }]}
      >
        <Input
          prefix={<SafetyOutlined />}
          placeholder="Enter OTP"
          size="large"
          maxLength={6}
        />
      </Form.Item>

      <Form.Item
        name="newPassword"
        rules={[
          { required: true, message: 'Please input new password!' },
          { min: 6, message: 'Password must be at least 6 characters!' }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="New Password"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="confirmPassword"
        rules={[
          { required: true, message: 'Please confirm your password!' }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Confirm New Password"
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={isResetting}>
          Reset Password
        </Button>
      </Form.Item>
      <div style={{ textAlign: 'center' }}>
        <Button type="link" onClick={() => setStep(0)}>
          Back to Email
        </Button>
      </div>
    </Form>
  );

  const steps = [
    { title: 'Email', content: renderEmailStep() },
    { title: 'Reset Password', content: renderResetStep() },
  ];

  return (
    <AuthLayout
      title="Forgot Password"
      description="Recover your account access"
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
            Remember your password? <Link to="/login">Login now</Link>
          </Text>
        </div>
      </Card>
    </AuthLayout>
  );
};
