import React from 'react';
import { Form, Input, Button, Card, Typography, Divider } from 'antd';
import { GoogleOutlined, KeyOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormValues, loginSchema } from '../types';
import { useLoginMutation } from '../api';
import { useAppDispatch } from '@/app/hooks';
import { loginStart, loginSuccess, loginFailure } from '../authSlice';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      dispatch(loginStart());
      const result = await login(data).unwrap();
      dispatch(loginSuccess(result));
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      
      // Set field errors if any
      if (error?.data?.errors) {
        Object.entries(error.data.errors).forEach(([field, messages]) => {
          if (field in errors) {
            setError(field as keyof LoginFormValues, {
              type: 'server',
              message: Array.isArray(messages) ? messages[0] : messages as string,
            });
          }
        });
      }
    }
  };

  return (
    <Card bordered style={{ maxWidth: 500, width: '150%' }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={3} style={{ marginBottom: 8 }}>
          {t('auth.login')}
        </Title>
        <Text type="secondary">
          {t('auth.welcomeBack')}
        </Text>
      </div>
      
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item 
          label="Email"
          validateStatus={errors.email ? 'error' : ''} 
          help={errors.email ? t(errors.email.message as string, { min: 6 }) : ''}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                placeholder={t('auth.email')}
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password ? t(errors.password.message as string, { min: 6 }) : ''}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                placeholder={t('auth.password')}
                {...field}
              />
            )}
          />
        </Form.Item>

        <div style={{ textAlign: 'right', marginBottom: 16 }}>
          <Link to="/forgot-password">
            {t('auth.forgotPassword')}
          </Link>
        </div>

        <Form.Item style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
          >
            {t('auth.login')}
          </Button>
        </Form.Item>

        <Divider plain style={{ margin: '16px 0', color: '#999', fontSize: '15px' }}>
          {t('auth.orLoginWith')}
        </Divider>

        <Form.Item style={{ marginBottom: 8 }}>
          <Button 
            block 
            icon={<GoogleOutlined />}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            Google
          </Button>
        </Form.Item>

        <Form.Item style={{ marginBottom: 16 }}>
          <Button 
            block 
            icon={<KeyOutlined />}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            Passkey
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">
            {t('auth.noAccount')}{' '}
          </Text>
          <Link to="/register">
            {t('auth.signUp')}
          </Link>
        </div>
      </Form>
    </Card>
  );
};