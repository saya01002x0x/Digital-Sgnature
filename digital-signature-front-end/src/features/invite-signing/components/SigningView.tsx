/**
 * SigningView Component
 * Display PDF document with fillable fields for signer
 */

import React, { useState } from 'react';
import { Card, Space, Button, Typography, Tag, Input, DatePicker, Alert } from 'antd';
import { CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { SigningSession, FieldValue } from '../types';
import type { Field } from '@/features/documents/types';
import { FieldType } from '@/features/documents/types';
import { PDFViewer } from '@/features/documents/components/PDFViewer';
import { SignatureSelector } from '@/features/signature/components/SignatureSelector';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

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

  const { document, signer, fields, allSigners } = session;

  // Check if all required fields are filled
  const allFieldsFilled = fields.every((field) => {
    return fieldValues[field.id] && fieldValues[field.id].trim() !== '';
  });

  const renderFieldInput = (field: Field) => {
    const value = fieldValues[field.id] || '';
    const isSelected = selectedFieldId === field.id;

    switch (field.type) {
      case FieldType.SIGNATURE:
      case FieldType.INITIAL:
        return (
          <Card
            size="small"
            style={{
              border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
              marginBottom: 16,
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>{field.label || t('signingView.signatureField')}</Text>
              <SignatureSelector
                onSelect={(signature) => onFieldChange(field.id, signature.imageData)}
                selectedSignatureId={undefined}
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

      case FieldType.TEXT:
        return (
          <Card
            size="small"
            style={{
              border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
              marginBottom: 16,
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>{field.label || t('signingView.textField')}</Text>
              <Input
                placeholder={t('signingView.enterText')}
                value={value}
                onChange={(e) => onFieldChange(field.id, e.target.value)}
                onFocus={() => setSelectedFieldId(field.id)}
                onBlur={() => setSelectedFieldId(undefined)}
              />
            </Space>
          </Card>
        );

      case FieldType.DATE:
        return (
          <Card
            size="small"
            style={{
              border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
              marginBottom: 16,
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>{field.label || t('signingView.dateField')}</Text>
              <DatePicker
                style={{ width: '100%' }}
                value={value ? dayjs(value) : null}
                onChange={(date) => onFieldChange(field.id, date ? date.toISOString() : '')}
                onFocus={() => setSelectedFieldId(field.id)}
                onBlur={() => setSelectedFieldId(undefined)}
                format="DD/MM/YYYY"
              />
            </Space>
          </Card>
        );

      default:
        return null;
    }
  };

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

      {/* Middle Panel - PDF Viewer */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Card>
          <PDFViewer pdfUrl={document.fileUrl} />
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
                {!allFieldsFilled && (
                  <Alert
                    message={t('signingView.requiredFields')}
                    type="error"
                    showIcon
                  />
                )}
              </>
            )}
          </Space>
        </Card>
      </div>
    </div>
  );
};

