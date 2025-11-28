import React from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, Row, Col } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormValues, loginSchema } from '../types';
import { useLoginMutation, authApi } from '../api';
import { useAppDispatch } from '@/app/hooks';
import { loginStart, loginSuccess, loginFailure } from '../authSlice';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/app/config/constants';
import '../styles/auth.css';

const { Title } = Typography;

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
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
      
      const profileResult = await dispatch(
        authApi.endpoints.getProfile.initiate(undefined, { forceRefetch: true })
      );
      
      if ('data' in profileResult && profileResult.data) {
        dispatch(loginSuccess({
          ...result,
          user: profileResult.data,
        }));
        navigate(APP_ROUTES.HOME);
      } else {
        dispatch(loginSuccess(result));
        navigate(APP_ROUTES.HOME);
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Login failed';
      dispatch(loginFailure(errorMessage));
      
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
    <Card className="auth-form-card" bordered={false} style={{ position: 'relative' }}>
      <div className="group-badge">Nhóm 5</div>
      <div className="decorative-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <Title level={2} className="text-center">
        {t('auth.login')}
      </Title>
      
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item 
          validateStatus={errors.email ? 'error' : ''} 
          help={errors.email ? t(errors.email.message as string, { min: 6 }) : ''}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                prefix={<MailOutlined style={{ color: '#667eea' }} />}
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
                prefix={<LockOutlined style={{ color: '#667eea' }} />}
                placeholder={t('auth.password')}
                size="large"
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Row justify="space-between" align="middle">
            <Col>
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <Checkbox checked={field.value} onChange={field.onChange}>
                    {t('auth.rememberMe')}
                  </Checkbox>
                )}
              />
            </Col>
            <Col>
              <Link to="/forgot-password" className="auth-link">
                {t('auth.forgotPassword')}
              </Link>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isLoading}
          >
            {t('auth.login')}
          </Button>
        </Form.Item>

        <div className="auth-footer-text">
          <span>{t('auth.noAccount')} </span>
          <Link to="/register" className="auth-link">
            {t('auth.signUp')}
          </Link>
        </div>
      </Form>
    </Card>
  );
};