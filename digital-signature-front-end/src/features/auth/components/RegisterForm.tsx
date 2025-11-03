import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider } from 'antd';
import { GoogleOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormValues, registerSchema } from '../types';
import { useRegisterMutation } from '../api';
import { useAppDispatch } from '@/app/hooks';
import { loginSuccess } from '../authSlice';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SignatureModal } from './SignatureModal';

const { Title, Text } = Typography;

export const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      signature: '',
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const result = await register(data).unwrap();
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

  const handleSignatureSave = (signatureData: string) => {
    setValue('signature', signatureData);
    setSignaturePreview(signatureData);
  };

  return (
    <Card bordered style={{ maxWidth: 500, width: '150%' }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={3} style={{ marginBottom: 8 }}>
          {t('auth.createAccount')}
        </Title>
        <Text type="secondary">
          {t('auth.createAccountDescription')}
        </Text>
      </div>
      
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item 
          label={t('auth.fullName')}
          validateStatus={errors.fullName ? 'error' : ''} 
          help={errors.fullName ? t(errors.fullName.message as string) : ''}
        >
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <Input
                placeholder={t('auth.fullName')}
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item 
          label={t('auth.emailAddress')}
          validateStatus={errors.email ? 'error' : ''} 
          help={errors.email ? t(errors.email.message as string) : ''}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                placeholder={t('auth.emailAddress')}
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={t('auth.password')}
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password ? t(errors.password.message as string, { min: 6 }) : ''}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                placeholder={t('auth.password')}
                iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
                {...field}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={t('auth.signHere')}
          validateStatus={errors.signature ? 'error' : ''}
          help={errors.signature ? t(errors.signature.message as string) : ''}
        >
          <div 
            onClick={() => setSignatureModalOpen(true)}
            style={{ 
              border: '1px solid #d9d9d9', 
              borderRadius: '4px', 
              padding: '16px',
              minHeight: 150,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fafafa',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#40a9ff';
              e.currentTarget.style.backgroundColor = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d9d9d9';
              e.currentTarget.style.backgroundColor = '#fafafa';
            }}
          >
            {signaturePreview ? (
              <img 
                src={signaturePreview} 
                alt="Signature" 
                style={{ maxWidth: '100%', maxHeight: '120px' }} 
              />
            ) : (
              <Text type="secondary">{t('auth.signHere')}</Text>
            )}
          </div>
        </Form.Item>

        <Divider plain style={{ margin: '16px 0', color: '#999', fontSize: '15px' }}>
          {t('auth.orSignUpWith')}
        </Divider>

        <Form.Item style={{ marginBottom: 16 }}>
          <Button 
            block 
            icon={<GoogleOutlined />}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {t('auth.signUpWithGoogle')}
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Link to="/login">
            {t('auth.alreadyHaveAccount')}{' '}
          </Link>
        </div>

        <Form.Item style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
            // style={{ backgroundColor: '#73d13d', borderColor: '#73d13d' }}
          >
            {t('auth.complete')}
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center', fontSize: '12px' }}>
          <Text type="secondary">
            {t('auth.termsAgreement')}{' '}
            <Link to="/terms">{t('auth.termsOfService')}</Link>
            {' '}{t('auth.and')}{' '}
            <Link to="/privacy">{t('auth.privacyPolicy')}</Link>.
          </Text>
        </div>
      </Form>

      <SignatureModal
        open={signatureModalOpen}
        onClose={() => setSignatureModalOpen(false)}
        onSave={handleSignatureSave}
        initialSignature={signaturePreview || undefined}
      />
    </Card>
  );
};
