/**
 * RegisterForm Component
 * Form for user registration
 * Using react-hook-form + Zod for validation
 */

import React, { useState } from 'react';
import { Input, Button, Checkbox, Alert, Space, Modal } from 'antd';
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
  const { t } = useTranslation('auth');
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
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

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setTermsModalVisible(true);
  };

  const handleAcceptTerms = () => {
    setValue('terms', true);
    setTermsModalVisible(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {error && (
            <Alert
              message={t('registerFailed', 'Registration failed')}
              description={error}
              type="error"
              showIcon
              closable
            />
          )}

          {/* Name Field */}
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              {t('fullName', 'Full Name')}
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined />}
                  placeholder={t('fullNamePlaceholder', 'Enter your full name')}
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
              {t('email', 'Email')}
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<MailOutlined />}
                  placeholder={t('emailPlaceholder', 'Enter your email')}
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
              {t('password', 'Password')}
            </label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined />}
                  placeholder={t('passwordPlaceholder', 'Enter your password')}
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
              {t('confirmPassword', 'Confirm Password')}
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined />}
                  placeholder={t('confirmPasswordPlaceholder', 'Confirm your password')}
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
                  {t('agreeToTerms', 'I agree to the')}{' '}
                  <a href="#" onClick={handleTermsClick}>
                    {t('termsAndConditions', 'Terms and Conditions')}
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
            {t('registerButton', 'Register')}
          </Button>
        </Space>
      </form>

      {/* Terms and Conditions Modal */}
      <Modal
        title={t('termsModal.title', 'Terms and Conditions of Service')}
        open={termsModalVisible}
        onCancel={() => setTermsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setTermsModalVisible(false)}>
            {t('cancel', 'Cancel')}
          </Button>,
          <Button key="accept" type="primary" onClick={handleAcceptTerms}>
            {t('termsModal.acceptButton', 'I have read and agree')}
          </Button>
        ]}
        width={700}
      >
        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '16px',
            background: '#fafafa',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.8',
            fontSize: '14px'
          }}
        >
          {t('termsModal.content', 'Terms and Conditions content...')}
        </div>
      </Modal>
    </>
  );
};
