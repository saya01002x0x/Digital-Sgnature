/**
 * PDFViewer Component
 * PDF viewer using react-pdf (prevents IDM auto-download)
 */

import React, { useState } from 'react';
import { Card, Button, Space, Typography, Spin, Alert } from 'antd';
import { 
  ZoomInOutlined, 
  ZoomOutOutlined, 
  LeftOutlined, 
  RightOutlined,
  FullscreenOutlined 
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Document, Page, pdfjs } from 'react-pdf';

// Don't import CSS - causes issues with some configs
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';

// Setup PDF.js worker from CDN (https to avoid CORS)
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const { Text } = Typography;

type PDFViewerProps = {
  fileUrl: string;
  pageCount?: number;
  onLoad?: () => void;
  onPageChange?: (pageNumber: number) => void;
  style?: React.CSSProperties;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  fileUrl,
  onLoad,
  onPageChange,
  style,
}) => {
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
    onLoad?.();
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF document');
    setLoading(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 2.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const handlePreviousPage = () => {
    setPageNumber(prev => {
      const newPage = Math.max(prev - 1, 1);
      onPageChange?.(newPage);
      return newPage;
    });
  };

  const handleNextPage = () => {
    setPageNumber(prev => {
      const newPage = Math.min(prev + 1, numPages);
      onPageChange?.(newPage);
      return newPage;
    });
  };

  const handleFullscreen = () => {
    const element = document.getElementById('pdf-container');
    if (element?.requestFullscreen) {
      element.requestFullscreen();
    }
  };

  return (
    <div style={{ ...style }}>
      {/* Controls */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Space>
            <Button icon={<ZoomOutOutlined />} onClick={handleZoomOut} disabled={scale <= 0.5}>
              {t('documents.zoomOut', 'Zoom Out')}
            </Button>
            <Text>{Math.round(scale * 100)}%</Text>
            <Button icon={<ZoomInOutlined />} onClick={handleZoomIn} disabled={scale >= 2.0}>
              {t('documents.zoomIn', 'Zoom In')}
            </Button>
          </Space>
          <Space>
            <Button 
              icon={<LeftOutlined />} 
              onClick={handlePreviousPage} 
              disabled={pageNumber <= 1}
            >
              Prev
            </Button>
            <Text type="secondary">
              Page {pageNumber} / {numPages || '?'}
            </Text>
            <Button 
              icon={<RightOutlined />} 
              onClick={handleNextPage} 
              disabled={pageNumber >= numPages}
            >
              Next
            </Button>
          </Space>
          <Button icon={<FullscreenOutlined />} onClick={handleFullscreen}>
            {t('documents.fullscreen', 'Fullscreen')}
          </Button>
        </Space>
      </Card>

      {/* PDF Viewer */}
      <div 
        id="pdf-container"
        style={{ 
          position: 'relative', 
          border: '1px solid #d9d9d9', 
          borderRadius: 8, 
          overflow: 'auto',
          minHeight: 600,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          backgroundColor: '#f5f5f5',
          padding: '20px',
        }}
      >
        {loading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            textAlign: 'center',
          }}>
            <Spin size="large" spinning={true} tip="Loading PDF...">
              <div style={{ padding: 50 }} />
            </Spin>
          </div>
        )}

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ margin: '20px' }}
          />
        )}
        
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div />}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>
    </div>
  );
};

