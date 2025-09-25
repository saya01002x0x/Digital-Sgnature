import React from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, Row, Col } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormValues, loginSchema } from '../types';
import { useLoginMutation } from '../api';
import { useAppDispatch } from '@/app/hooks';
import { loginStart, loginSuccess, loginFailure } from '../authSlice';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const { Title } = Typography;

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
    // Thêm các class Tailwind vào Card để thay đổi nền, bo góc, và đổ bóng
    // Lưu ý: Ant Design Card đã có nền trắng và đổ bóng mặc định,
    // các class Tailwind này sẽ cố gắng ghi đè hoặc bổ sung.
    // bg-gray-900: Đổi màu nền của Card thành xám đậm (Ant Design mặc định là trắng/tối)
    // shadow-2xl: Tăng độ đậm của đổ bóng
    // rounded-lg: Làm bo góc của Card mềm mại hơn (Ant Design mặc định là 4px)
    // p-8: Thêm padding bên trong Card
    <Card className="login-form-card bg-gray-300 shadow-2xl rounded-lg p-8" bordered={false}>
      {/* Thêm class Tailwind vào Title để thay đổi màu chữ và margin-bottom */}
      {/* text-white: Đổi màu chữ thành trắng */}
      {/* mb-6: Thêm margin-bottom 1.5rem (24px) */}
      <Title level={2} className="text-center text-white mb-6">
        {t('auth.login')}
      </Title>
      
      {/* Không thêm nhiều class Tailwind vào Form trực tiếp để tránh ảnh hưởng đến layout của Ant Design */}
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="login-form">
        <Form.Item 
          validateStatus={errors.email ? 'error' : ''} 
          help={errors.email ? t(errors.email.message as string, { min: 6 }) : ''}
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
                // Thêm class Tailwind vào Input để tùy chỉnh nhẹ (ví dụ: focus border)
                // focus:border-blue-500: Khi input được focus, đổi màu border thành xanh
                className="focus:border-blue-500"
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
                // focus:border-blue-500: Khi input được focus, đổi màu border thành xanh
                className="focus:border-blue-500"
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          {/* Thêm một class Tailwind nhỏ vào Row để đảm bảo khoảng cách bên ngoài */}
          {/* mb-4: margin-bottom 1rem (16px) */}
          <Row justify="space-between" align="middle" className="mb-4">
            <Col>
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <Checkbox checked={field.value} onChange={field.onChange}>
                    {/* text-gray-300: Đổi màu chữ của Checkbox label thành xám nhạt */}
                    <span className="text-gray-300">{t('auth.rememberMe')}</span>
                  </Checkbox>
                )}
              />
            </Col>
            <Col>
              {/* text-blue-400: Đổi màu chữ của Link thành xanh nhạt */}
              <Link to="/forgot-password" className="text-blue-400 hover:underline">
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
            // Thêm class Tailwind để tùy chỉnh Button của Ant Design
            // bg-blue-600: Đổi màu nền button (có thể ghi đè primary color của AntD)
            // hover:bg-blue-700: Đổi màu khi hover
            // text-white: Đảm bảo chữ trắng
            // font-semibold: Chữ đậm hơn
            className="bg-blue-600 hover:bg-blue-700 text-dark font-semibold"
          >
            {t('auth.login')}
          </Button>
        </Form.Item>

        {/* Thêm class Tailwind vào div này để tùy chỉnh giao diện */}
        {/* mt-6: margin-top 1.5rem (24px) */}
        {/* text-center: căn giữa chữ */}
        {/* text-gray-400: Đổi màu chữ thành xám */}
        <div className="mt-6 text-center text-gray-400">
          <span>{t('auth.noAccount')} </span>
          {/* text-blue-300: Đổi màu chữ của Link thành xanh nhạt */}
          <Link to="/register" className="text-blue-300 hover:underline">
            {t('auth.signUp')}
          </Link>
        </div>
      </Form>
    </Card>
  );
};