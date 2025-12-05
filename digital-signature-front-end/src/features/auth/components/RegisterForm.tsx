/**
 * RegisterForm Component
 * Form for user registration
 * Using react-hook-form + Zod for validation
 */

import type React from 'react';
import { Input, Button, Checkbox, Alert, Space } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '../utils/validators';

type RegisterFormProps = {
  onSubmit: (values: RegisterFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
}) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {error && (
          <Alert
            message={t('auth.registerFailed', 'Registration failed')}
            description={error}
            type="error"
            showIcon
            closable
          />
        )}

        {/* Name Field */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            {t('auth.fullName', 'Full Name')}
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<UserOutlined />}
                placeholder={t('auth.fullNamePlaceholder', 'Enter your full name')}
                autoComplete="name"
                size="large"
                status={errors.name ? 'error' : undefined}
              />
            )}
          />
          {errors.name && (
            <div style={{ color: '#ff4d4f', marginTop: 4, fontSize: 14 }}>
              {errors.name.message}
            </div>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            {t('auth.email', 'Email')}
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<MailOutlined />}
                placeholder={t('auth.emailPlaceholder', 'Enter your email')}
                autoComplete="email"
                size="large"
                status={errors.email ? 'error' : undefined}
              />
            )}
          />
          {errors.email && (
            <div style={{ color: '#ff4d4f', marginTop: 4, fontSize: 14 }}>
              {errors.email.message}
            </div>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            {t('auth.password', 'Password')}
          </label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined />}
                placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
                autoComplete="new-password"
                size="large"
                status={errors.password ? 'error' : undefined}
              />
            )}
          />
          {errors.password && (
            <div style={{ color: '#ff4d4f', marginTop: 4, fontSize: 14 }}>
              {errors.password.message}
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
            {t('auth.confirmPassword', 'Confirm Password')}
          </label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined />}
                placeholder={t('auth.confirmPasswordPlaceholder', 'Confirm your password')}
                autoComplete="new-password"
                size="large"
                status={errors.confirmPassword ? 'error' : undefined}
              />
            )}
          />
          {errors.confirmPassword && (
            <div style={{ color: '#ff4d4f', marginTop: 4, fontSize: 14 }}>
              {errors.confirmPassword.message}
            </div>
          )}
        </div>

        {/* Terms Checkbox */}
        <div>
          <Controller
            name="terms"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <Checkbox
                {...field}
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
              >
                {t('auth.agreeToTerms', 'I agree to the')}{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  {t('auth.termsAndConditions', 'Terms and Conditions')}
                </a>
              </Checkbox>
            )}
          />
          {errors.terms && (
            <div style={{ color: '#ff4d4f', marginTop: 4, fontSize: 14 }}>
              {errors.terms.message}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isLoading}
          size="large"
        >
          {t('auth.registerButton', 'Register')}
        </Button>
      </Space>
    </form>
  );
};
