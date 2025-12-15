/**
 * PublicVerifyPage
 * Public page for verifying documents via QR code scan
 * Accessible without authentication
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Card,
    Typography,
    Space,
    Spin,
    Alert,
    Divider,
    Tag,
    List,
    Result,
    Button,
} from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    SafetyCertificateOutlined,
    FileTextOutlined,
    UserOutlined,
    LockOutlined,
    WarningOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface VerificationResult {
    documentId: string;
    documentTitle: string;
    valid: boolean;
    documentModified: boolean;
    statusMessage: string;
    validSignatures: number;
    totalSignatures: number;
    signerNames: string[];
    verifiedAt: string;
    hashAlgorithm: string;
    signatureAlgorithm: string;
}

export const PublicVerifyPage: React.FC = () => {
    const { documentId } = useParams<{ documentId: string }>();
    const { t } = useTranslation('documents');
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<VerificationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyDocument = async () => {
            if (!documentId) {
                setError('Invalid document ID');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/public/verify/${documentId}`);
                const data = await response.json();

                if (data.data) {
                    setResult(data.data);
                } else {
                    setError('Verification failed');
                }
            } catch (err) {
                setError('Unable to verify document');
            } finally {
                setLoading(false);
            }
        };

        verifyDocument();
    }, [documentId]);

    if (loading) {
        return (
            <div style={styles.container}>
                <Card style={styles.card}>
                    <div style={styles.loadingContainer}>
                        <Spin size="large" />
                        <Text style={{ marginTop: 16 }}>{t('verify.verifying', 'Verifying document...')}</Text>
                    </div>
                </Card>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div style={styles.container}>
                <Card style={styles.card}>
                    <Result
                        status="error"
                        title={t('verify.errorTitle', 'Verification Failed')}
                        subTitle={error || t('verify.errorSubtitle', 'Unable to verify this document')}
                        extra={
                            <Link to="/">
                                <Button type="primary">{t('verify.goHome', 'Go to Homepage')}</Button>
                            </Link>
                        }
                    />
                </Card>
            </div>
        );
    }

    const isValid = result.valid && !result.documentModified;

    return (
        <div style={styles.container}>
            <Card style={styles.card}>
                {/* Header with Logo */}
                <div style={styles.header}>
                    <SafetyCertificateOutlined style={styles.logo} />
                    <Title level={4} style={{ margin: 0 }}>
                        {t('verify.title', 'Document Verification')}
                    </Title>
                </div>

                <Divider />

                {/* Main Result */}
                <div style={styles.resultContainer}>
                    {isValid ? (
                        <>
                            <CheckCircleOutlined style={styles.successIcon} />
                            <Title level={3} style={styles.successText}>
                                {t('verify.valid', 'Document is Valid')}
                            </Title>
                            <Paragraph type="secondary">
                                {t('verify.validDescription', 'This document has been verified and has not been modified since signing.')}
                            </Paragraph>
                        </>
                    ) : result.documentModified ? (
                        <>
                            <WarningOutlined style={styles.warningIcon} />
                            <Title level={3} style={styles.warningText}>
                                {t('verify.modified', 'Document Modified!')}
                            </Title>
                            <Paragraph type="danger">
                                {t('verify.modifiedDescription', 'Warning: This document has been modified after signing. The signatures may no longer be valid.')}
                            </Paragraph>
                        </>
                    ) : (
                        <>
                            <CloseCircleOutlined style={styles.errorIcon} />
                            <Title level={3} style={styles.errorText}>
                                {t('verify.invalid', 'Verification Failed')}
                            </Title>
                            <Paragraph type="secondary">
                                {result.statusMessage}
                            </Paragraph>
                        </>
                    )}
                </div>

                <Divider />

                {/* Document Info */}
                <div style={styles.infoSection}>
                    <Space align="start" size={12}>
                        <FileTextOutlined style={styles.infoIcon} />
                        <div>
                            <Text type="secondary">{t('verify.documentTitle', 'Document')}</Text>
                            <br />
                            <Text strong>{result.documentTitle || 'Untitled'}</Text>
                        </div>
                    </Space>
                </div>

                {/* Signatures Info */}
                {result.totalSignatures > 0 && (
                    <div style={styles.infoSection}>
                        <Space align="start" size={12}>
                            <UserOutlined style={styles.infoIcon} />
                            <div style={{ width: '100%' }}>
                                <Text type="secondary">{t('verify.signatures', 'Signatures')}</Text>
                                <br />
                                <Tag color={isValid ? 'green' : 'red'}>
                                    {result.validSignatures} / {result.totalSignatures} {t('verify.verified', 'verified')}
                                </Tag>
                                {result.signerNames && result.signerNames.length > 0 && (
                                    <List
                                        size="small"
                                        dataSource={result.signerNames}
                                        renderItem={(name) => (
                                            <List.Item style={{ padding: '4px 0', border: 'none' }}>
                                                <Text>• {name}</Text>
                                            </List.Item>
                                        )}
                                        style={{ marginTop: 8 }}
                                    />
                                )}
                            </div>
                        </Space>
                    </div>
                )}

                {/* Security Info */}
                <div style={styles.infoSection}>
                    <Space align="start" size={12}>
                        <LockOutlined style={styles.infoIcon} />
                        <div>
                            <Text type="secondary">{t('verify.security', 'Security')}</Text>
                            <br />
                            <Text code>{result.signatureAlgorithm}</Text>
                            <Text type="secondary"> + </Text>
                            <Text code>{result.hashAlgorithm}</Text>
                        </div>
                    </Space>
                </div>

                <Divider />

                {/* Footer */}
                <div style={styles.footer}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {t('verify.verifiedAt', 'Verified at')}: {new Date(result.verifiedAt).toLocaleString()}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {t('verify.poweredBy', 'Powered by Digital Signature Platform')}
                    </Text>
                </div>
            </Card>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F5FF 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        position: 'relative',
        overflow: 'hidden',
    },
    card: {
        maxWidth: 480,
        width: '100%',
        borderRadius: 24,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.1)',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    logo: {
        fontSize: 32,
        color: '#1890ff',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        padding: 40,
    },
    resultContainer: {
        textAlign: 'center' as const,
        padding: '20px 0',
    },
    successIcon: {
        fontSize: 64,
        color: '#52c41a',
    },
    successText: {
        color: '#52c41a',
        marginTop: 16,
    },
    warningIcon: {
        fontSize: 64,
        color: '#faad14',
    },
    warningText: {
        color: '#faad14',
        marginTop: 16,
    },
    errorIcon: {
        fontSize: 64,
        color: '#ff4d4f',
    },
    errorText: {
        color: '#ff4d4f',
        marginTop: 16,
    },
    infoSection: {
        padding: '12px 0',
    },
    infoIcon: {
        fontSize: 20,
        color: '#8c8c8c',
    },
    footer: {
        textAlign: 'center' as const,
        paddingTop: 8,
    },
};

export default PublicVerifyPage;
