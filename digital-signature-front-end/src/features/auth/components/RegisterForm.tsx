import React from 'react';
import { Form, Input, Button, Checkbox, Card, Typography } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormValues, registerSchema } from '../types';
import { useRegisterMutation } from '../api';
import { useAppDispatch } from '@/app/hooks';
import { loginSuccess } from '../authSlice';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const { Title } = Typography;

export const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const result = await register({ 
        email: data.email, 
        password: data.password 
      }).unwrap();
      dispatch(loginSuccess(result));
    } catch (error: any) {
      if (error?.data?.errors) {
        Object.entries(error.data.errors).forEach(([field, messages]) => {
          if (field in errors) {
            setError(field as keyof RegisterFormValues, {
              type: 'server',
              message: Array.isArray(messages) ? messages[0] : messages as string,
            });
          }
        });
      }
    }
  };

  return (
    <Card className="register-form-card" bordered={false}>
      <Title level={2} className="text-center">
        {t('auth.register')}
      </Title>
      
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="register-form">
        <Form.Item
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email ? t(errors.email.message as string) : ''}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                prefix={<MailOutlined />}
                placeholder={t('auth.email')}
                size="large"
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password ? t(errors.password.message as string, { min: 6 }) : ''}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('auth.password')}
                size="large"
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={errors.confirmPassword ? t(errors.confirmPassword.message as string) : ''}
        >
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <Input.Password
                prefix={<LockOutlined />}
                placeholder={t('auth.confirmPassword')}
                size="large"
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          validateStatus={errors.terms ? 'error' : ''}
          help={errors.terms ? t(errors.terms.message as string) : ''}
        >
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={field.onChange}>
                Tôi đồng ý với các điều khoản và điều kiện
              </Checkbox>
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isLoading}
          >
            {t('auth.register')}
          </Button>
        </Form.Item>

        <div className="text-center">
          <span>{t('auth.alreadyHaveAccount')} </span>
          <Link to="/login">{t('auth.signIn')}</Link>
        </div>
      </Form>
    </Card>
  );
};
