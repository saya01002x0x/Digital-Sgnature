import React, { useState, useEffect } from 'react';
import { Input, Button, Checkbox, Card, Typography, message, DatePicker, Select, Upload } from 'antd';
import { MailOutlined, LockOutlined, SafetyOutlined, UserOutlined, PhoneOutlined, HomeOutlined, CalendarOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormValues, registerSchema } from '../types';
import { useSendOtpMutation, useVerifyOtpMutation } from '../api';
import { useAppDispatch } from '@/app/hooks';
import { loginSuccess } from '../authSlice';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/app/config/constants';
import '../styles/auth.css';

const { Title } = Typography;

export const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [otpCountdown, setOtpCountdown] = useState<number>(0);

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  
  const {
    control: registerControl,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    setError: setRegisterError,
    getValues: getRegisterValues,
    setValue: setRegisterValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phone: '',
      address: '',
      dateOfBirth: undefined,
      gender: undefined,
      otp: '',
      avatar: undefined,
      terms: false,
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [otpCountdown]);

  const handleSendOtp = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log('=== handleSendOtp called ===');
    const formData = getRegisterValues();
    console.log('Form data:', formData);
    console.log('Email:', formData.email);
    console.log('OTP countdown:', otpCountdown);
    
    if (!formData.email) {
      console.log('Email is empty, showing error');
      message.error('Vui lòng nhập email trước');
      return;
    }
    
    if (otpCountdown > 0) {
      console.log('Countdown active, showing warning');
      message.warning(`Vui lòng đợi ${otpCountdown} giây trước khi gửi lại OTP`);
      return;
    }
    
    try {
      console.log('=== Sending OTP request ===');
      console.log('Email to send:', formData.email);
      const result = await sendOtp({ email: formData.email }).unwrap();
      console.log('=== OTP generated successfully ===');
      console.log('OTP result:', result);
      console.log('OTP value:', result.otp);
      setGeneratedOtp(result.otp);
      setOtpCountdown(15);
      message.success('Mã OTP đã được tạo. Vui lòng nhập mã OTP bên dưới.');
    } catch (error: any) {
      console.error('=== Error sending OTP ===');
      console.error('Error object:', error);
      console.error('Error data:', error?.data);
      console.error('Error message:', error?.message);
      const errorMessage = error?.data?.message || error?.message || 'Không thể tạo OTP';
      message.error(errorMessage);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    console.log('onRegisterSubmit called with data:', data);
    
    if (!data.otp) {
      message.error('Vui lòng nhập mã OTP');
      return;
    }

    try {
      const result = await verifyOtp({
        username: data.username,
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone || undefined,
        address: data.address || undefined,
        dateOfBirth: data.dateOfBirth ? (typeof data.dateOfBirth === 'string' ? data.dateOfBirth : dayjs(data.dateOfBirth).format('YYYY-MM-DD')) : undefined,
        gender: data.gender || undefined,
        otp: data.otp,
        avatar: data.avatar,
      }).unwrap();
      
      dispatch(loginSuccess(result));
      message.success('Đăng ký thành công!');
      navigate(APP_ROUTES.HOME);
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      const errorMessage = error?.data?.message || error?.message || 'Đăng ký thất bại';
      message.error(errorMessage);
      if (error?.data?.errors) {
        Object.entries(error.data.errors).forEach(([field, messages]) => {
          if (field in registerErrors) {
            setRegisterError(field as keyof RegisterFormValues, {
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
        {t('auth.register')}
      </Title>
      
      <form onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleRegisterSubmit(onRegisterSubmit)(e).catch((error) => {
          console.error('Form validation error:', error);
        });
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <Controller
            name="username"
            control={registerControl}
            render={({ field }) => (
              <Input
                prefix={<UserOutlined style={{ color: '#3b82f6' }} />}
                placeholder="Tên đăng nhập"
                size="large"
                status={registerErrors.username ? 'error' : ''}
                {...field}
              />
            )}
          />
          {registerErrors.username && (
            <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
              {registerErrors.username.message}
            </div>
          )}
        </div>

        <div>
          <Controller
            name="email"
            control={registerControl}
            render={({ field }) => (
              <Input
                prefix={<MailOutlined style={{ color: '#3b82f6' }} />}
                placeholder={t('auth.email')}
                size="large"
                status={registerErrors.email ? 'error' : ''}
                {...field}
              />
            )}
          />
          {registerErrors.email && (
            <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
              {t(registerErrors.email.message as string)}
            </div>
          )}
        </div>

        <div>
          <Controller
            name="fullName"
            control={registerControl}
            render={({ field }) => (
              <Input
                prefix={<UserOutlined style={{ color: '#3b82f6' }} />}
                placeholder="Họ và tên"
                size="large"
                status={registerErrors.fullName ? 'error' : ''}
                {...field}
              />
            )}
          />
          {registerErrors.fullName && (
            <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
              {registerErrors.fullName.message}
            </div>
          )}
        </div>

        <div>
          <Controller
            name="password"
            control={registerControl}
            render={({ field }) => (
              <Input.Password
                prefix={<LockOutlined style={{ color: '#3b82f6' }} />}
                placeholder={t('auth.password')}
                size="large"
                status={registerErrors.password ? 'error' : ''}
                {...field}
              />
            )}
          />
          {registerErrors.password && (
            <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
              {t(registerErrors.password.message as string, { min: 6 })}
            </div>
          )}
        </div>

        <div>
          <Controller
            name="confirmPassword"
            control={registerControl}
            render={({ field }) => (
              <Input.Password
                prefix={<LockOutlined style={{ color: '#3b82f6' }} />}
                placeholder={t('auth.confirmPassword')}
                size="large"
                status={registerErrors.confirmPassword ? 'error' : ''}
                {...field}
              />
            )}
          />
          {registerErrors.confirmPassword && (
            <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
              {t(registerErrors.confirmPassword.message as string)}
            </div>
          )}
        </div>

        <div>
          <Controller
            name="phone"
            control={registerControl}
            render={({ field }) => (
              <Input
                prefix={<PhoneOutlined style={{ color: '#3b82f6' }} />}
                placeholder="Số điện thoại"
                size="large"
                status={registerErrors.phone ? 'error' : ''}
                {...field}
              />
            )}
          />
          {registerErrors.phone && (
            <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
              {registerErrors.phone.message}
            </div>
          )}
        </div>

        <div>
          <Controller
            name="address"
            control={registerControl}
            render={({ field }) => (
              <Input
                prefix={<HomeOutlined style={{ color: '#3b82f6' }} />}
                placeholder="Địa chỉ"
                size="large"
                status={registerErrors.address ? 'error' : ''}
                {...field}
              />
            )}
          />
          {registerErrors.address && (
            <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
              {registerErrors.address.message}
            </div>
          )}
        </div>

        <div>
          <Controller
            name="dateOfBirth"
            control={registerControl}
            render={({ field }) => (
              <DatePicker
                placeholder="Ngày sinh"
                size="large"
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                status={registerErrors.dateOfBirth ? 'error' : ''}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date ? date.toDate() : null)}
                suffixIcon={<CalendarOutlined style={{ color: '#3b82f6' }} />}
              />
            )}
          />
          {registerErrors.dateOfBirth && (
            <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
              {registerErrors.dateOfBirth.message}
            </div>
          )}
        </div>

        <div>
          <Controller
            name="gender"
            control={registerControl}
            render={({ field }) => (
              <Select
                placeholder="Giới tính"
                size="large"
                status={registerErrors.gender ? 'error' : ''}
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: 'MALE', label: 'Nam' },
                  { value: 'FEMALE', label: 'Nữ' },
                  { value: 'OTHER', label: 'Khác' },
                ]}
              />
            )}
          />
          {registerErrors.gender && (
            <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
              {registerErrors.gender.message}
            </div>
          )}
        </div>

        <div>
          <Controller
            name="avatar"
            control={registerControl}
            render={() => (
              <Upload
                beforeUpload={(file) => {
                  setRegisterValue('avatar', file);
                  return false;
                }}
                onRemove={() => {
                  setRegisterValue('avatar', undefined);
                }}
                maxCount={1}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} size="large" style={{ width: '100%' }}>
                  Tải lên ảnh đại diện (tùy chọn)
                </Button>
              </Upload>
            )}
          />
          {registerErrors.avatar && (
            <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
              {registerErrors.avatar.message}
            </div>
          )}
        </div>

        <div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Controller
                name="otp"
                control={registerControl}
                render={({ field }) => (
                  <Input
                    prefix={<SafetyOutlined style={{ color: '#3b82f6' }} />}
                    placeholder="Nhập mã OTP (6 số)"
                    size="large"
                    maxLength={6}
                    status={registerErrors.otp ? 'error' : ''}
                    {...field}
                  />
                )}
              />
              {registerErrors.otp && (
                <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
                  {registerErrors.otp.message}
                </div>
              )}
            </div>
            <Button
              type="default"
              size="large"
              loading={isSendingOtp}
              disabled={otpCountdown > 0 || isSendingOtp}
              onClick={(e) => {
                console.log('=== Button clicked ===');
                console.log('Button disabled:', otpCountdown > 0 || isSendingOtp);
                console.log('Countdown:', otpCountdown);
                console.log('Loading:', isSendingOtp);
                handleSendOtp(e);
              }}
            >
              {otpCountdown > 0 ? `Gửi lại (${otpCountdown}s)` : 'Gửi mã OTP'}
            </Button>
          </div>
          {generatedOtp && (
            <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                Mã OTP đã được tạo:
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6', letterSpacing: '4px', fontFamily: 'monospace' }}>
                {generatedOtp}
              </div>
            </div>
          )}
        </div>

        <div>
          <Controller
            name="terms"
            control={registerControl}
            render={({ field }) => (
              <Checkbox checked={field.value} onChange={field.onChange}>
                Tôi đồng ý với các điều khoản và điều kiện
              </Checkbox>
            )}
          />
          {registerErrors.terms && (
            <div style={{ color: '#ff4d4f', fontSize: '14px', marginTop: '4px' }}>
              {t(registerErrors.terms.message as string)}
            </div>
          )}
        </div>

          <Button
            type="primary"
            size="large"
            block
          htmlType="submit"
          loading={isVerifyingOtp}
          >
          Đăng ký
          </Button>

        <div className="auth-footer-text">
          <span>{t('auth.alreadyHaveAccount')} </span>
          <Link to="/login" className="auth-link">
            {t('auth.signIn')}
          </Link>
        </div>
        </div>
      </form>
    </Card>
  );
};
