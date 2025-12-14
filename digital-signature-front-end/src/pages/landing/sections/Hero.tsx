import React from 'react';
import { Button, Row, Col, Typography } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_ROUTES } from '@/app/config/constants';
import { ArrowRightOutlined, CheckCircleFilled } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export const Hero: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation('landing');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
            },
        },
    };

    const imageVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.8,
            },
        },
    };

    return (
        <section style={{
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F5FF 100%)',
            paddingTop: 120,
            paddingBottom: 60,
            display: 'flex',
            alignItems: 'center'
        }}>
            {/* Background Shapes */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '50vw',
                height: '50vw',
                background: 'radial-gradient(circle, rgba(24,144,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                borderRadius: '50%',
                zIndex: 0,
            }} />

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', width: '100%', zIndex: 1 }}>
                <Row gutter={[48, 48]} align="middle">
                    <Col xs={24} md={12}>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div variants={itemVariants}>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    background: 'rgba(24, 144, 255, 0.1)',
                                    padding: '8px 16px',
                                    borderRadius: 20,
                                    marginBottom: 24,
                                    color: '#1890ff',
                                    fontWeight: 600,
                                    fontSize: 14
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>{t('hero.badge')}</span>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Title level={1} style={{
                                    fontSize: 'clamp(40px, 5vw, 64px)',
                                    marginBottom: 24,
                                    lineHeight: 1.1,
                                    fontWeight: 800,
                                    background: 'linear-gradient(135deg, #1F1F1F 0%, #434343 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                    {t('hero.title')} <br />
                                    <span style={{ color: '#1890ff', WebkitTextFillColor: '#1890ff' }}>{t('hero.titleHighlight')}</span>
                                </Title>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <Paragraph style={{ fontSize: 18, color: '#666', marginBottom: 32, maxWidth: 500, lineHeight: 1.6 }}>
                                    {t('hero.subtitle')}
                                </Paragraph>
                            </motion.div>

                            <motion.div variants={itemVariants} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{
                                        height: 56,
                                        padding: '0 32px',
                                        fontSize: 18,
                                        borderRadius: 12,
                                        boxShadow: '0 8px 20px rgba(24, 144, 255, 0.3)'
                                    }}
                                    onClick={() => navigate(APP_ROUTES.REGISTER)}
                                    icon={<ArrowRightOutlined />}
                                    iconPosition="end"
                                >
                                    {t('hero.getStarted')}
                                </Button>
                                <Button
                                    size="large"
                                    style={{
                                        height: 56,
                                        padding: '0 32px',
                                        fontSize: 18,
                                        borderRadius: 12,
                                        border: '1px solid #d9d9d9'
                                    }}
                                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    {t('hero.learnMore')}
                                </Button>
                            </motion.div>

                            <motion.div variants={itemVariants} style={{ marginTop: 48, display: 'flex', gap: 24, color: '#888' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <CheckCircleFilled style={{ color: '#52c41a' }} /> <span>{t('hero.checkSecurity')}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <CheckCircleFilled style={{ color: '#52c41a' }} /> <span>{t('hero.checkLegal')}</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </Col>

                    <Col xs={24} md={12}>
                        <motion.div
                            variants={imageVariants}
                            initial="hidden"
                            animate="visible"
                            style={{ position: 'relative' }}
                        >
                            {/* <div style={{
                                position: 'relative',
                                zIndex: 2,
                                borderRadius: 24,
                                overflow: 'hidden',
                                boxShadow: '0 20px 60px -10px rgba(0,0,0,0.15)',
                                border: '1px solid rgba(255,255,255,0.5)',
                                background: 'rgba(255,255,255,0.8)',
                                backdropFilter: 'blur(20px)',
                            }}>
                                <img
                                    src="https://gw.alipayobjects.com/mdn/rms_08e378/afts/img/A*W4JdQqWcQ_gAAAAAAAAAAABkARQnAQ"
                                    alt="Dashboard Preview"
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                            </div> */}

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                style={{
                                    position: 'absolute',
                                    top: -40,
                                    right: -40,
                                    zIndex: 1,
                                    width: 120,
                                    height: 120,
                                    background: 'linear-gradient(135deg, #FFD666 0%, #FFA940 100%)',
                                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                                    opacity: 0.6,
                                    filter: 'blur(40px)'
                                }}
                            />
                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                style={{
                                    position: 'absolute',
                                    bottom: -40,
                                    left: -40,
                                    zIndex: 1,
                                    width: 150,
                                    height: 150,
                                    background: 'linear-gradient(135deg, #69C0FF 0%, #1890FF 100%)',
                                    borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                                    opacity: 0.6,
                                    filter: 'blur(40px)'
                                }}
                            />
                        </motion.div>
                    </Col>
                </Row>
            </div>
        </section>
    );
};
