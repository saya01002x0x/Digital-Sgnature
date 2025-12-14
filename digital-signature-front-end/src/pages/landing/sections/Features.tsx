import React from 'react';
import { Row, Col, Typography, Card } from 'antd';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    SafetyCertificateOutlined,
    CloudSyncOutlined,
    TeamOutlined,
    FileProtectOutlined,
    ThunderboltOutlined,
    GlobalOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export const Features: React.FC = () => {
    const { t } = useTranslation('landing');

    const features = [
        {
            icon: <SafetyCertificateOutlined />,
            title: t('features.security.title'),
            description: t('features.security.description')
        },
        {
            icon: <CloudSyncOutlined />,
            title: t('features.cloudSync.title'),
            description: t('features.cloudSync.description')
        },
        {
            icon: <TeamOutlined />,
            title: t('features.teamwork.title'),
            description: t('features.teamwork.description')
        },
        {
            icon: <FileProtectOutlined />,
            title: t('features.legal.title'),
            description: t('features.legal.description')
        },
        {
            icon: <ThunderboltOutlined />,
            title: t('features.speed.title'),
            description: t('features.speed.description')
        },
        {
            icon: <GlobalOutlined />,
            title: t('features.multilang.title'),
            description: t('features.multilang.description')
        }
    ];

    return (
        <section id="features" style={{ padding: '100px 24px', background: '#fff' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 64 }}>
                    <Title level={2} style={{ fontSize: 36, marginBottom: 16 }}>{t('features.title')}</Title>
                    <Paragraph style={{ fontSize: 18, color: '#666', maxWidth: 600, margin: '0 auto' }}>
                        {t('features.subtitle')}
                    </Paragraph>
                </div>

                <Row gutter={[32, 32]}>
                    {features.map((feature, index) => (
                        <Col xs={24} sm={12} md={8} key={index}>
                            <motion.div
                                whileHover={{ y: -10 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Card
                                    bordered={false}
                                    style={{
                                        height: '100%',
                                        borderRadius: 16,
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    bodyStyle={{ padding: 32 }}
                                >
                                    <div style={{
                                        width: 64,
                                        height: 64,
                                        borderRadius: 16,
                                        background: 'rgba(24, 144, 255, 0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 24,
                                        color: '#1890ff',
                                        fontSize: 28
                                    }}>
                                        {feature.icon}
                                    </div>
                                    <Title level={4} style={{ marginBottom: 16 }}>{feature.title}</Title>
                                    <Paragraph style={{ color: '#666', marginBottom: 0 }}>
                                        {feature.description}
                                    </Paragraph>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </div>
        </section>
    );
};
