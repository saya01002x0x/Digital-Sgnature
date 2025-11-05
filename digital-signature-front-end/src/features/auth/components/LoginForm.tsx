/**
 * LoginForm Component
 * Form for user login with email and password
 */

import type React from 'react';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { LoginFormValues } from '../types';

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      await onSubmit(values);
    } catch (err) {
      // Error is handled by parent component
      console.error('Login error:', err);
    }
  };

  return (
    <Form
      form={form}
      name="login"
      initialValues={{ remember: true }}
      onFinish={handleSubmit}
      size="large"
      layout="vertical"
      requiredMark={false}
    >
      {error && (
        <Form.Item>
          <Alert
            message={t('auth.loginFailed', 'Login failed')}
            description={error}
            type="error"
            showIcon
            closable
          />
        </Form.Item>
      )}

      <Form.Item
        name="email"
        label={t('auth.email', 'Email')}
        rules={[
          { required: true, message: t('auth.emailRequired', 'Email is required') },
          { type: 'email', message: t('auth.emailInvalid', 'Invalid email address') },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder={t('auth.emailPlaceholder', 'Enter your email')}
          autoComplete="email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label={t('auth.password', 'Password')}
        rules={[
          { required: true, message: t('auth.passwordRequired', 'Password is required') },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
          autoComplete="current-password"
        />
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>{t('auth.rememberMe', 'Remember me')}</Checkbox>
        </Form.Item>

        <a
          style={{ float: 'right' }}
          href="/forgot-password"
        >
          {t('auth.forgotPassword', 'Forgot password?')}
        </a>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isLoading}
          size="large"
        >
          {t('auth.loginButton', 'Login')}
        </Button>
      </Form.Item>
    </Form>
  );
};
