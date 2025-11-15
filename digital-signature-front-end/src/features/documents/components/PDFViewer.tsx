/**
 * PDFViewer Component
 * Simple PDF viewer using iframe
 */

import React, { useState } from 'react';
import { Card, Button, Space, Typography, Spin } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

type PDFViewerProps = {
  fileUrl: string;
  pageCount?: number;
  onLoad?: () => void;
  style?: React.CSSProperties;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  fileUrl,
  pageCount = 1,
  onLoad,
  style,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(100);

  const handleLoad = () => {
    setLoading(false);
    onLoad?.();
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleFullscreen = () => {
    const element = document.getElementById('pdf-iframe');
    if (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      }
    }
  };

  return (
    <div style={{ ...style }}>
      {/* Controls */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Button icon={<ZoomOutOutlined />} onClick={handleZoomOut} disabled={zoom <= 50}>
              {t('documents.zoomOut', 'Zoom Out')}
            </Button>
            <Text>{zoom}%</Text>
            <Button icon={<ZoomInOutlined />} onClick={handleZoomIn} disabled={zoom >= 200}>
              {t('documents.zoomIn', 'Zoom In')}
            </Button>
          </Space>
          <Space>
            <Text type="secondary">
              {t('documents.pageCount', 'Pages')}: {pageCount}
            </Text>
            <Button icon={<FullscreenOutlined />} onClick={handleFullscreen}>
              {t('documents.fullscreen', 'Fullscreen')}
            </Button>
          </Space>
        </Space>
      </Card>

      {/* PDF Viewer */}
      <div style={{ position: 'relative', border: '1px solid #d9d9d9', borderRadius: 8, overflow: 'hidden' }}>
        {loading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}>
            <Spin size="large" />
          </div>
        )}
        
        <iframe
          id="pdf-iframe"
          src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          style={{
            width: '100%',
            height: 600,
            border: 'none',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top left',
          }}
          title="PDF Viewer"
          onLoad={handleLoad}
        />
      </div>
    </div>
  );
};

