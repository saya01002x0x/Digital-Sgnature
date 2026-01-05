/**
 * PublicVerifyPage
 * Public page for viewing documents via QR code scan
 * Shows the original PDF for visual verification
 * Accessible without authentication
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { env } from '@/app/config/env';
import {
    Card,
    Typography,
    Space,
    Spin,
    Divider,
    Tag,
    Result,
    Button,
    Row,
    Col,
    List,
    Grid,
} from 'antd';
import {
    SafetyCertificateOutlined,
    FileTextOutlined,
    UserOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    DownloadOutlined,
} from '@ant-design/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

interface DocumentInfo {
    documentId: string;
    documentTitle: string;
    status: string;
    pageCount: number;
    fileUrl: string;
    createdAt: string;
    completedAt: string | null;
    signers: Array<{ name: string; signedAt: string }>;
    totalSigners: number;
    signedCount: number;
    verifiedAt: string;
}

export const PublicVerifyPage: React.FC = () => {
    const { documentId } = useParams<{ documentId: string }>();
    const { t, i18n } = useTranslation('documents');
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [loading, setLoading] = useState(true);
    const [docInfo, setDocInfo] = useState<DocumentInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchDocument = async () => {
            if (!documentId) {
                setError('Invalid document ID');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${env.VITE_API_URL}/api/public/verify/${documentId}`);
                const data = await response.json();

                if (data.status === 200 && data.data) {
                    setDocInfo(data.data);
                } else {
                    setError(data.message || 'Document not found');
                }
            } catch (err) {
                console.error('Error fetching document:', err);
                setError('Unable to load document');
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [documentId]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <Card style={styles.card}>
                    <div style={styles.loadingContainer}>
                        <Spin size="large" />
                        <Text style={{ marginTop: 16 }}>
                            {t('verify.loading', 'Loading document...')}
                        </Text>
                    </div>
                </Card>
            </div>
        );
    }

    if (error || !docInfo) {
        return (
            <div style={styles.container}>
                <Card style={styles.card}>
                    <Result
                        status="error"
                        title={t('verify.errorTitle', 'Document Not Found')}
                        subTitle={error || t('verify.errorSubtitle', 'This document could not be found or accessed')}
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

    const isCompleted = docInfo.status === 'DONE';

    return (
        <div style={styles.container}>
            <div style={{ maxWidth: 1200, width: '100%', padding: isMobile ? 8 : 24 }}>
                {/* Header */}
                <Card style={{ ...styles.headerCard, marginBottom: 16 }}>
                    <div style={styles.header}>
                        <SafetyCertificateOutlined style={styles.logo} />
                        <div>
                            <Title level={4} style={{ margin: 0 }}>
                                {t('verify.pageTitle', 'Document Verification')}
                            </Title>
                            <Text type="secondary">
                                {t('verify.pageSubtitle', 'View the original signed document')}
                            </Text>
                        </div>
                    </div>
                </Card>

                <Row gutter={[16, 16]}>
                    {/* Left: Document Info */}
                    <Col xs={24} lg={8}>
                        <Card
                            title={
                                <Space>
                                    <FileTextOutlined />
                                    {t('verify.documentInfo', 'Document Info')}
                                </Space>
                            }
                        >
                            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                                {/* Title */}
                                <div>
                                    <Text type="secondary">{t('verify.title', 'Title')}</Text>
                                    <br />
                                    <Text strong style={{ fontSize: 16 }}>{docInfo.documentTitle}</Text>
                                </div>

                                {/* Status */}
                                <div>
                                    <Text type="secondary">{t('verify.status', 'Status')}</Text>
                                    <br />
                                    <Tag color={isCompleted ? 'green' : 'blue'} icon={isCompleted ? <CheckCircleOutlined /> : null}>
                                        {isCompleted ? t('verify.completed', 'Completed') : docInfo.status}
                                    </Tag>
                                </div>

                                {/* Signed Date */}
                                {docInfo.completedAt && (
                                    <div>
                                        <Text type="secondary">{t('verify.signedDate', 'Signed Date')}</Text>
                                        <br />
                                        <Space>
                                            <CalendarOutlined />
                                            <Text>{formatDate(docInfo.completedAt)}</Text>
                                        </Space>
                                    </div>
                                )}

                                <Divider style={{ margin: '12px 0' }} />

                                {/* Signers */}
                                <div>
                                    <Space>
                                        <UserOutlined />
                                        <Text type="secondary">
                                            {t('verify.signedBy', 'Signed by')} ({docInfo.signedCount}/{docInfo.totalSigners})
                                        </Text>
                                    </Space>
                                    <List
                                        size="small"
                                        dataSource={docInfo.signers}
                                        renderItem={(signer) => (
                                            <List.Item style={{ padding: '8px 0', border: 'none' }}>
                                                <Space direction="vertical" size={0}>
                                                    <Text strong>{signer.name}</Text>
                                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                                        {formatDate(signer.signedAt)}
                                                    </Text>
                                                </Space>
                                            </List.Item>
                                        )}
                                        locale={{ emptyText: t('verify.noSigners', 'No signers yet') }}
                                    />
                                </div>

                                <Divider style={{ margin: '12px 0' }} />

                                {/* Download Button */}
                                <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    block
                                    onClick={() => {
                                        window.open(docInfo.fileUrl, '_blank');
                                    }}
                                >
                                    {t('verify.downloadOriginal', 'Download Original')}
                                </Button>

                                {/* Verification Note */}
                                <Paragraph type="secondary" style={{ fontSize: 12, marginBottom: 0 }}>
                                    {t('verify.note', 'Compare this document with your copy to verify authenticity.')}
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>

                    {/* Right: PDF Viewer */}
                    <Col xs={24} lg={16}>
                        <Card
                            title={
                                <Space>
                                    <FileTextOutlined />
                                    {t('verify.documentPreview', 'Document Preview')}
                                    {numPages > 0 && (
                                        <Text type="secondary">
                                            ({currentPage} / {numPages})
                                        </Text>
                                    )}
                                </Space>
                            }
                            extra={
                                numPages > 1 && (
                                    <Space>
                                        <Button
                                            size="small"
                                            disabled={currentPage <= 1}
                                            onClick={() => setCurrentPage(p => p - 1)}
                                        >
                                            ←
                                        </Button>
                                        <Button
                                            size="small"
                                            disabled={currentPage >= numPages}
                                            onClick={() => setCurrentPage(p => p + 1)}
                                        >
                                            →
                                        </Button>
                                    </Space>
                                )
                            }
                        >
                            <div style={styles.pdfContainer}>
                                <Document
                                    file={docInfo.fileUrl}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    loading={
                                        <div style={{ textAlign: 'center', padding: 40 }}>
                                            <Spin />
                                            <br />
                                            <Text type="secondary">Loading PDF...</Text>
                                        </div>
                                    }
                                    error={
                                        <div style={{ textAlign: 'center', padding: 40 }}>
                                            <Text type="danger">Failed to load PDF</Text>
                                        </div>
                                    }
                                >
                                    <Page
                                        pageNumber={currentPage}
                                        width={isMobile ? 300 : 600}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                </Document>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* Footer */}
                <div style={styles.footer}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {t('verify.verifiedAt', 'Accessed at')}: {formatDate(docInfo.verifiedAt)}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {t('verify.poweredBy', 'Powered by Digital Signature Platform')}
                    </Text>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #F0F5FF 0%, #FFFFFF 100%)',
        display: 'flex',
        justifyContent: 'center',
        padding: 16,
    },
    headerCard: {
        borderRadius: 16,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
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
        gap: 16,
    },
    logo: {
        fontSize: 40,
        color: '#1890ff',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        padding: 40,
    },
    pdfContainer: {
        display: 'flex',
        justifyContent: 'center',
        background: '#f5f5f5',
        borderRadius: 8,
        padding: 16,
        minHeight: 400,
        overflow: 'auto',
    },
    footer: {
        textAlign: 'center' as const,
        marginTop: 24,
        paddingBottom: 24,
    },
};

export default PublicVerifyPage;
