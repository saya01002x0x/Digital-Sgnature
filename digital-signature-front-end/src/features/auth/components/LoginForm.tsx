/**
 * LoginForm Component
 * Form for user login with email and password
 * Using react-hook-form + Zod for validation
 */

import type React from 'react';
import { Input, Button, Checkbox, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '../utils/validators';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '@/app/config/constants';

type LoginFormProps = {
  onSubmit: (values: LoginFormData) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
}) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {error && (
          <Alert
            message={t('auth.loginFailed', 'Login failed')}
            description={error}
            type="error"
            showIcon
            closable
          />
        )}

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
                prefix={<UserOutlined />}
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
                autoComplete="current-password"
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

        {/* Remember Me & Forgot Password */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Controller
            name="remember"
            control={control}
            render={({ field: { value, ...field } }) => (
              <Checkbox {...field} checked={value}>
                {t('auth.rememberMe', 'Remember me')}
              </Checkbox>
            )}
          />
          <Link to={APP_ROUTES.FORGOT_PASSWORD}>
            {t('auth.forgotPassword', 'Forgot password?')}
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="primary"
          htmlType="submit"
          block
          loading={isLoading}
          size="large"
        >
          {t('auth.loginButton', 'Login')}
        </Button>
      </Space>
    </form>
  );
};
