/**
 * DocumentPreview Component
 * Displays PDF pages with signatures overlay and pagination
 */

import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Spin, Empty, Typography, Button, Space } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Field } from '../types';

// Set worker - use same URL as PDFViewer.tsx
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const { Text } = Typography;

type DocumentPreviewProps = {
    fileUrl: string;
    fields: Field[];
    title?: string;
};

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
    fileUrl,
    fields,
    title,
}) => {
    const { t } = useTranslation('documents');
    const [numPages, setNumPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageWidth, setPageWidth] = useState<number>(300);
    const [pageHeight, setPageHeight] = useState<number>(400);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Get signed fields for current page
    const signedFieldsOnPage = fields.filter(
        f => f.value && f.value.length > 0 && f.pageNumber === currentPage
    );

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setLoading(false);
    };

    const onDocumentLoadError = () => {
        setError(true);
        setLoading(false);
    };

    const onPageLoadSuccess = (page: any) => {
        const { width, height } = page;
        setPageWidth(width);
        setPageHeight(height);
    };

    // Calculate container width
    useEffect(() => {
        if (containerRef.current) {
            const width = containerRef.current.offsetWidth - 16;
            setPageWidth(Math.min(width, 400));
        }
    }, []);

    const goToPrevPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(numPages, prev + 1));
    };

    if (error) {
        return (
            <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t('detail.preview.error', 'Failed to load preview')}
            />
        );
    }

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                    <Spin tip={t('detail.preview.loading', 'Loading preview...')} />
                </div>
            )}

            <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={null}
            >
                <div style={{ position: 'relative', display: loading ? 'none' : 'block' }}>
                    <Page
                        pageNumber={currentPage}
                        width={pageWidth}
                        onLoadSuccess={onPageLoadSuccess}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />

                    {/* Signature Overlays for current page */}
                    {signedFieldsOnPage.map((field) => {
                        const left = (field.positionX / 100) * pageWidth;
                        const top = (field.positionY / 100) * pageHeight;
                        const width = (field.width / 100) * pageWidth;
                        const height = (field.height / 100) * pageHeight;

                        return (
                            <div
                                key={field.id}
                                style={{
                                    position: 'absolute',
                                    left: `${left}px`,
                                    top: `${top}px`,
                                    width: `${width}px`,
                                    height: `${height}px`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    src={field.value}
                                    alt="Signature"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </Document>

            {/* Pagination Controls */}
            {numPages > 1 && !loading && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 12,
                    gap: 8,
                }}>
                    <Button
                        size="small"
                        icon={<LeftOutlined />}
                        onClick={goToPrevPage}
                        disabled={currentPage <= 1}
                    />
                    <Text style={{ fontSize: 13 }}>
                        {currentPage} / {numPages}
                    </Text>
                    <Button
                        size="small"
                        icon={<RightOutlined />}
                        onClick={goToNextPage}
                        disabled={currentPage >= numPages}
                    />
                </div>
            )}

            {/* Signatures count */}
            {signedFieldsOnPage.length > 0 && !loading && (
                <Text
                    type="success"
                    style={{
                        display: 'block',
                        textAlign: 'center',
                        marginTop: 8,
                        fontSize: 12,
                    }}
                >
                    {t('detail.preview.signaturesOnPage', '{{count}} signature(s) on this page', { count: signedFieldsOnPage.length })}
                </Text>
            )}
        </div>
    );
};
