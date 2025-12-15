import React, { useEffect } from 'react';
import { Typography, Space, Form, Input, Button, App, Card } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../components/AuthLayout';
import { useVerifyOtpMutation } from '../api';
import { SafetyOutlined } from '@ant-design/icons';
import type { RegisterFormData } from '../utils/validators';

const { Text, Title } = Typography;

export const VerifyRegistrationPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { message } = App.useApp();

    const formData = location.state as RegisterFormData | null;
    const [verifyOtpAndRegister, { isLoading: isVerifying }] = useVerifyOtpMutation();

    useEffect(() => {
        if (!formData) {
            message.error('Invalid session. Please register again.');
            navigate('/register');
        }
    }, [formData, navigate, message]);

    const handleVerifyOtp = async (values: { otp: string }) => {
        if (!formData) return;

        try {
            await verifyOtpAndRegister({
                username: formData.email,
                email: formData.email,
                password: formData.password,
                fullName: formData.name,
                otp: values.otp,
            }).unwrap();

            message.success(t('auth.registerSuccess', 'Registration successful! Please login.'));
            navigate('/login');
        } catch (err: any) {
            message.error(err?.data?.message || 'Invalid OTP or Registration Failed');
        }
    };

    if (!formData) return null;

    return (
        <AuthLayout
            title="Verify Email"
            description={`Enter the OTP sent to ${formData.email}`}
        >
            <Card variant="borderless" styles={{ body: { padding: 0 } }}>
                <Form onFinish={handleVerifyOtp} layout="vertical">
                    <Form.Item
                        name="otp"
                        rules={[{ required: true, message: 'Please input OTP!' }]}
                    >
                        <Input
                            prefix={<SafetyOutlined />}
                            placeholder="Enter 6-digit OTP"
                            size="large"
                            maxLength={6}
                            style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '18px' }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" loading={isVerifying}>
                            Complete Registration
                        </Button>
                    </Form.Item>
                    <div style={{ textAlign: 'center' }}>
                        <Button type="link" onClick={() => navigate('/register')}>
                            Back to Register
                        </Button>
                    </div>
                </Form>
            </Card>
        </AuthLayout>
    );
};
