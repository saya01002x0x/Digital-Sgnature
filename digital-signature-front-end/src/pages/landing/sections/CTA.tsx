import React from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_ROUTES } from '@/app/config/constants';

const { Title, Paragraph } = Typography;

export const CTA: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('landing');

    return (
        <section style={{
            padding: '100px 24px',
            background: 'linear-gradient(135deg, #1890ff 0%, #0050b3 100%)',
            textAlign: 'center',
            color: '#fff'
        }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <Title level={2} style={{ color: '#fff', fontSize: 40, marginBottom: 24 }}>
                    {t('cta.title')}
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: 20, marginBottom: 40 }}>
                    {t('cta.subtitle')}
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
                    {t('cta.button')}
                </Button>
            </div>
        </section>
    );
};
