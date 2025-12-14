import React from 'react';
import { Row, Col, Typography, Steps } from 'antd';
import { UserAddOutlined, FileTextOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export const HowItWorks: React.FC = () => {
    const { t } = useTranslation('landing');

    return (
        <section id="how-it-works" style={{ padding: '100px 24px', background: '#F9FAFB' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 64 }}>
                    <Title level={2} style={{ fontSize: 36, marginBottom: 16 }}>{t('howItWorks.title')}</Title>
                    <Paragraph style={{ fontSize: 18, color: '#666', maxWidth: 600, margin: '0 auto' }}>
                        {t('howItWorks.subtitle')}
                    </Paragraph>
                </div>

                <Row justify="center">
                    <Col span={24}>
                        <Steps
                            current={-1}
                            labelPlacement="vertical"
                            items={[
                                {
                                    title: t('howItWorks.step1.title'),
                                    description: t('howItWorks.step1.description'),
                                    icon: <UserAddOutlined style={{ fontSize: 32 }} />,
                                },
                                {
                                    title: t('howItWorks.step2.title'),
                                    description: t('howItWorks.step2.description'),
                                    icon: <FileTextOutlined style={{ fontSize: 32 }} />,
                                },
                                {
                                    title: t('howItWorks.step3.title'),
                                    description: t('howItWorks.step3.description'),
                                    icon: <SafetyCertificateOutlined style={{ fontSize: 32 }} />,
                                },
                            ]}
                        />
                    </Col>
                </Row>
            </div>
        </section>
    );
};
