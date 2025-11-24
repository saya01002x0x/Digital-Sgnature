import React from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/app/config/constants';

const { Title, Paragraph } = Typography;

export const CTA: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section style={{
            padding: '100px 24px',
            background: 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)',
            textAlign: 'center',
            color: '#fff'
        }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <Title level={2} style={{ color: '#fff', fontSize: 40, marginBottom: 24 }}>
                    Sẵn sàng để bắt đầu?
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 20, marginBottom: 40 }}>
                    Tham gia cùng hàng ngàn doanh nghiệp đang sử dụng E-Signature để tối ưu hóa quy trình làm việc.
                </Paragraph>
                <Button
                    size="large"
                    style={{
                        height: 56,
                        padding: '0 48px',
                        fontSize: 18,
                        borderRadius: 28,
                        border: 'none',
                        color: '#1890ff',
                        fontWeight: 600
                    }}
                    onClick={() => navigate(APP_ROUTES.REGISTER)}
                >
                    Đăng ký ngay - Miễn phí
                </Button>
            </div>
        </section>
    );
};
