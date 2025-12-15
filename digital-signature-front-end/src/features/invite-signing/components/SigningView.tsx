/**
 * SigningView Component
 * Display PDF document with fillable fields for signer
 * Responsive design for mobile and desktop
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Space, Typography, Tag, Alert, Grid } from 'antd';
import { CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { SigningSession } from '../types';
import type { Field } from '@/features/documents/types';
import { FieldType } from '@/features/documents/types';
import { PDFViewer } from '@/features/documents/components/PDFViewer';
import { FieldOverlay } from '@/features/documents/components/FieldOverlay';
import { SignatureSelector } from '@/features/signature/components/SignatureSelector';
import { useListSignaturesQuery } from '@/features/signature/services/signature.api';

const { Text } = Typography;
const { useBreakpoint } = Grid;

type SigningViewProps = {
  session: SigningSession;
  onFieldChange: (fieldId: string, value: string) => void;
  fieldValues: Record<string, string>;
};

export const SigningView: React.FC<SigningViewProps> = ({
  session,
  onFieldChange,
  fieldValues,
}) => {
  const { t } = useTranslation('invite-signing');
  const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: signatures = [] } = useListSignaturesQuery();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const { document, signer, fields, allSigners } = session;

  // Update container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const pdfContainer = containerRef.current.querySelector('#pdf-container');
        if (pdfContainer) {
          setContainerDimensions({
            width: pdfContainer.clientWidth,
            height: pdfContainer.clientHeight,
          });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Multiple delays to catch PDF rendering at different stages
    const timers = [
      setTimeout(updateDimensions, 300),
      setTimeout(updateDimensions, 600),
      setTimeout(updateDimensions, 1000),
    ];

    return () => {
      window.removeEventListener('resize', updateDimensions);
      timers.forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Update dimensions when field values change (signature added)
  useEffect(() => {
    if (containerRef.current) {
      const pdfContainer = containerRef.current.querySelector('#pdf-container');
      if (pdfContainer) {
        setContainerDimensions({
          width: pdfContainer.clientWidth,
          height: pdfContainer.clientHeight,
        });
      }
    }
  }, [fieldValues]);

  // Helper to find signatureId from imageData
  const findSignatureIdByImageData = (imageData: string | undefined): string | undefined => {
    if (!imageData) return undefined;
    const signature = signatures.find(s => s.imageData === imageData);
    return signature?.id;
  };

  // Check if all required fields are filled
  const allFieldsFilled = fields.every((field) => {
    return fieldValues[field.id] && fieldValues[field.id].trim() !== '';
  });

  const renderFieldInput = (field: Field) => {
    const value = fieldValues[field.id] || '';
    const isSelected = selectedFieldId === field.id;

    switch (field.type) {
      case FieldType.Signature:
      case FieldType.Initials:
        const signatureId = findSignatureIdByImageData(value);
        return (
          <Card
            size="small"
            style={{
              border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
              marginBottom: 16,
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>{t('signingView.signatureField')}</Text>
              <SignatureSelector
                value={signatureId}
                onChange={(_, signature) => {
                  if (signature?.imageData) {
                    onFieldChange(field.id, signature.imageData);
                  }
                }}
                placeholder={t('signature.selectSignature', 'Select a signature')}
              />
              {value && (
                <div style={{ marginTop: 8 }}>
                  <img
                    src={value}
                    alt="Selected signature"
                    style={{ maxWidth: '100%', maxHeight: 100, border: '1px solid #d9d9d9' }}
                  />
                </div>
              )}
            </Space>
          </Card>
        );

      default:
        return null;
    }
  };

  // Mobile layout - stacked vertically in correct order
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 1. Document Info */}
        <Card title={t('signingView.documentInfo')} size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text type="secondary">{t('signingView.title')}</Text>
              <br />
              <Text strong>{document.title}</Text>
            </div>
            <div>
              <Text type="secondary">{t('signingView.status')}</Text>
              <br />
              <Tag color="processing">{document.status}</Tag>
            </div>
          </Space>
        </Card>

        {/* 2. Signers List */}
        <Card title={t('signingView.signers')} size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            {allSigners.map((s) => (
              <div
                key={s.id}
                style={{
                  padding: 8,
                  background: s.id === signer.id ? '#e6f7ff' : '#fafafa',
                  borderRadius: 4,
                  border: s.id === signer.id ? '1px solid #1890ff' : '1px solid #d9d9d9',
                }}
              >
                <Space>
                  <UserOutlined />
                  <div>
                    <Text strong>{s.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {s.email}
                    </Text>
                    <br />
                    {s.status === 'SIGNED' && (
                      <Tag color="success" icon={<CheckCircleOutlined />}>
                        {t('signingView.signed')}
                      </Tag>
                    )}
                    {s.status === 'PENDING' && (
                      <Tag color="default">{t('signingView.pending')}</Tag>
                    )}
                    {s.status === 'DECLINED' && (
                      <Tag color="error">{t('signingView.declined')}</Tag>
                    )}
                  </div>
                </Space>
              </div>
            ))}
          </Space>
        </Card>

        {/* 3. Fields to Fill */}
        <Card title={t('signingView.fieldsToFill')} size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            {fields.length === 0 ? (
              <Alert
                message={t('signingView.noFields')}
                type="info"
                showIcon
              />
            ) : (
              <>
                <Alert
                  message={t('signingView.fillAllFields')}
                  type="warning"
                  showIcon
                  style={{ marginBottom: 8 }}
                />
                {fields.map((field) => (
                  <div key={field.id}>{renderFieldInput(field)}</div>
                ))}
                {/* {!allFieldsFilled && (
                  <Alert
                    message={t('signingView.requiredFields')}
                    type="error"
                    showIcon
                  />
                )} */}
              </>
            )}
          </Space>
        </Card>

        {/* 4. PDF Viewer - Last on mobile */}
        <div ref={containerRef}>
          <Card size="small" title={t('signingView.document', 'Tài liệu')}>
            <div style={{ position: 'relative' }}>
              <PDFViewer
                fileUrl={document.fileUrl}
                onPageChange={(page) => setCurrentPage(page)}
              />

              {containerDimensions.width > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                  }}
                >
                  <FieldOverlay
                    fields={fields}
                    pageNumber={currentPage}
                    containerWidth={containerDimensions.width}
                    containerHeight={containerDimensions.height}
                    onFieldClick={(field) => setSelectedFieldId(field.id)}
                    selectedFieldId={selectedFieldId}
                    fieldValues={fieldValues}
                    showDeleteButton={false}
                  />
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Desktop layout - 3 columns
  return (
    <div style={{ display: 'flex', gap: 24, height: '100%' }}>
      {/* Left Panel - Document Info & Signers */}
      <div style={{ width: 300, flexShrink: 0 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* Document Info */}
          <Card title={t('signingView.documentInfo')}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">{t('signingView.title')}</Text>
                <br />
                <Text strong>{document.title}</Text>
              </div>
              <div>
                <Text type="secondary">{t('signingView.status')}</Text>
                <br />
                <Tag color="processing">{document.status}</Tag>
              </div>
            </Space>
          </Card>

          {/* Signers List */}
          <Card title={t('signingView.signers')}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {allSigners.map((s) => (
                <div
                  key={s.id}
                  style={{
                    padding: 8,
                    background: s.id === signer.id ? '#e6f7ff' : '#fafafa',
                    borderRadius: 4,
                    border: s.id === signer.id ? '1px solid #1890ff' : '1px solid #d9d9d9',
                  }}
                >
                  <Space>
                    <UserOutlined />
                    <div>
                      <Text strong>{s.name}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {s.email}
                      </Text>
                      <br />
                      {s.status === 'SIGNED' && (
                        <Tag color="success" icon={<CheckCircleOutlined />}>
                          {t('signingView.signed')}
                        </Tag>
                      )}
                      {s.status === 'PENDING' && (
                        <Tag color="default">{t('signingView.pending')}</Tag>
                      )}
                      {s.status === 'DECLINED' && (
                        <Tag color="error">{t('signingView.declined')}</Tag>
                      )}
                    </div>
                  </Space>
                </div>
              ))}
            </Space>
          </Card>
        </Space>
      </div>

      {/* Middle Panel - PDF Viewer with Field Overlay */}
      <div ref={containerRef} style={{ flex: 1, overflow: 'auto' }}>
        <Card>
          <div style={{ position: 'relative' }}>
            <PDFViewer
              fileUrl={document.fileUrl}
              onPageChange={(page) => setCurrentPage(page)}
            />

            {/* Field Overlay - Show where to sign */}
            {containerDimensions.width > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
              >
                <FieldOverlay
                  fields={fields}
                  pageNumber={currentPage}
                  containerWidth={containerDimensions.width}
                  containerHeight={containerDimensions.height}
                  onFieldClick={(field) => setSelectedFieldId(field.id)}
                  selectedFieldId={selectedFieldId}
                  fieldValues={fieldValues}
                  showDeleteButton={false}
                />
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Right Panel - Fields to Fill */}
      <div style={{ width: 350, flexShrink: 0, overflow: 'auto' }}>
        <Card title={t('signingView.fieldsToFill')}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {fields.length === 0 ? (
              <Alert
                message={t('signingView.noFields')}
                type="info"
                showIcon
              />
            ) : (
              <>
                <Alert
                  message={t('signingView.fillAllFields')}
                  type="warning"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                {fields.map((field) => (
                  <div key={field.id}>{renderFieldInput(field)}</div>
                ))}
                {/* {!allFieldsFilled && (
                  <Alert
                    message={t('signingView.requiredFields')}
                    type="error"
                    showIcon
                  />
                )} */}
              </>
            )}
          </Space>
        </Card>
      </div>
    </div>
  );
};

