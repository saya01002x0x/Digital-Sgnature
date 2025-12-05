/**
 * DocumentUpload Component
 * Component for uploading PDF documents
 */

import React from 'react';
import { Upload, message, Typography, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { validatePDFUpload, formatFileSize } from '../utils/pdfHelpers';
import type { UploadProps, UploadFile } from 'antd';

const { Dragger } = Upload;
const { Text } = Typography;

type DocumentUploadProps = {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onFileSelect,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [isLoadingSample, setIsLoadingSample] = React.useState(false);

  const handleLoadSample = async () => {
    try {
      setIsLoadingSample(true);
      const response = await fetch('/doc.pdf');
      if (!response.ok) throw new Error('Failed to load sample document');

      const blob = await response.blob();
      const file = new File([blob], 'sample-document.pdf', { type: 'application/pdf' });

      onFileSelect(file);
    } catch (error) {
      console.error('Error loading sample:', error);
      message.error(t('documents.loadSampleError', 'Failed to load sample document'));
    } finally {
      setIsLoadingSample(false);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.pdf,application/pdf',
    showUploadList: false,
    disabled: disabled || isLoadingSample,
    beforeUpload: (file) => {
      const validation = validatePDFUpload(file);

      if (!validation.valid) {
        message.error(validation.error || t('documents.uploadError', 'Upload failed'));
        return false;
      }

      onFileSelect(file);
      return false; // Prevent auto upload
    },
    onDrop: (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        const validation = validatePDFUpload(file);

        if (validation.valid) {
          onFileSelect(file);
        } else {
          message.error(validation.error || t('documents.uploadError', 'Upload failed'));
        }
      }
    },
  };

  return (
    <div style={{ width: '100%' }}>
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ fontSize: 48, color: '#1890ff' }} />
        </p>
        <p className="ant-upload-text">
          {t('documents.uploadText', 'Click or drag PDF file to this area to upload')}
        </p>
        <p className="ant-upload-hint">
          <Text type="secondary">
            {t('documents.uploadHint', 'Support for a single PDF file. Max size: 10MB')}
          </Text>
        </p>
      </Dragger>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Text type="secondary" style={{ marginRight: 8 }}>{t('documents.or', 'Or')}</Text>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleLoadSample();
          }}
          loading={isLoadingSample}
          disabled={disabled}
        >
          {t('documents.loadSample', 'Load Sample Document')}
        </Button>
      </div>
    </div>
  );
};

