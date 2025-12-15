/**
 * LoginPage Component
 * Page for user login
 * Using pure Ant Design components
 */

import type React from 'react';
import { Typography, Space, Divider, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '../components/LoginForm';
import { AuthLayout } from '../components/AuthLayout';
import { useAppDispatch } from '@/app/hooks';
import { useLoginMutation, authApi } from '../api';
import { loginStart, loginSuccess, loginFailure } from '../authSlice';
import type { LoginFormData } from '../utils/validators';

const { Text } = Typography;

export const LoginPage: React.FC = () => {
  const { t } = useTranslation(['auth', 'translation']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async (values: LoginFormData) => {
    try {
      dispatch(loginStart());
      // 1. Gọi API Login để lấy Token
      const result = await login(values).unwrap();

      // ------------------------------------------------------------------
      // FIX QUAN TRỌNG: Lưu Token vào Redux/Storage NGAY LẬP TỨC
      // Để các request sau (như /me) có thể lấy được token từ storage
      // ------------------------------------------------------------------
      dispatch(loginSuccess({
        token: result.token,
        refreshToken: result.refreshToken,
        // Chưa có user info cũng không sao, lưu token trước đã
      }));

      // 2. Bây giờ mới gọi API lấy thông tin User (Lúc này Header đã có Token)
      const profileResult = await dispatch(
        authApi.endpoints.getProfile.initiate(undefined, { forceRefetch: true })
      );

      // 3. Cập nhật lại Redux với thông tin User đầy đủ
      if ('data' in profileResult && profileResult.data) {
        dispatch(loginSuccess({
          ...result,
          user: profileResult.data,
        }));
      }

      message.success(t('loginSuccess'));
      navigate('/documents');
    } catch (err: any) {
      const errorMessage = err?.data?.message || t('loginFailed');
      dispatch(loginFailure(errorMessage));
      message.error(errorMessage);
    }
  };

  return (
    <AuthLayout
      title={t('welcomeBack')}
      description={t('loginSubtitle')}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <LoginForm
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error ? String(error) : null}
        />

        <Divider>{t('common.or', { ns: 'translation' })}</Divider>

        <div style={{ textAlign: 'center' }}>
          <Text>
            {t('noAccount')}{' '}
            <Link to="/register">
              {t('registerNow')}
            </Link>
          </Text>
        </div>
      </Space>
    </AuthLayout>
  );
};
