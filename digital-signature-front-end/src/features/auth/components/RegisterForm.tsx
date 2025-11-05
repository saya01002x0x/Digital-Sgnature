/**
 * RegisterForm Component
 * Form for user registration
 */

import type React from 'react';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { RegisterFormValues } from '../types';

type RegisterFormProps = {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      await onSubmit(values);
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  return (
    <Form
      form={form}
      name="register"
      onFinish={handleSubmit}
      size="large"
      layout="vertical"
      requiredMark={false}
      scrollToFirstError
    >
      {error && (
        <Form.Item>
          <Alert
            message={t('auth.registerFailed', 'Registration failed')}
            description={error}
            type="error"
            showIcon
            closable
          />
        </Form.Item>
      )}

      <Form.Item
        name="name"
        label={t('auth.fullName', 'Full Name')}
        rules={[
          { required: true, message: t('auth.fullNameRequired', 'Full name is required') },
          { min: 2, message: t('auth.fullNameMin', 'Name must be at least 2 characters') },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder={t('auth.fullNamePlaceholder', 'Enter your full name')}
          autoComplete="name"
        />
      </Form.Item>

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
          autoComplete="email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label={t('auth.password', 'Password')}
        rules={[
          { required: true, message: t('auth.passwordRequired', 'Password is required') },
          { min: 8, message: t('auth.passwordMin', 'Password must be at least 8 characters') },
          {
            pattern: /[A-Z]/,
            message: t('auth.passwordUppercase', 'Password must contain uppercase letter'),
          },
          {
            pattern: /[0-9]/,
            message: t('auth.passwordNumber', 'Password must contain number'),
          },
        ]}
        hasFeedback
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label={t('auth.confirmPassword', 'Confirm Password')}
        dependencies={['password']}
        hasFeedback
        rules={[
          { required: true, message: t('auth.confirmPasswordRequired', 'Please confirm your password') },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t('auth.passwordMismatch', 'Passwords do not match')));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder={t('auth.confirmPasswordPlaceholder', 'Confirm your password')}
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item
        name="terms"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value
                ? Promise.resolve()
                : Promise.reject(new Error(t('auth.termsRequired', 'You must accept the terms and conditions'))),
          },
        ]}
      >
        <Checkbox>
          {t('auth.agreeToTerms', 'I agree to the')}{' '}
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            {t('auth.termsAndConditions', 'Terms and Conditions')}
          </a>
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isLoading}
          size="large"
        >
          {t('auth.registerButton', 'Register')}
        </Button>
      </Form.Item>
    </Form>
  );
};
