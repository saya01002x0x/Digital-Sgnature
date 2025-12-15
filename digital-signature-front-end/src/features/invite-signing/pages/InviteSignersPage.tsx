/**
 * InviteSignersPage Component
 * Page for inviting signers to a document
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Space,
  Button,
  Alert,
  Spin,
  Result,
  Steps,
  Card,
  Grid,
} from 'antd';
import {
  ArrowLeftOutlined,
  SendOutlined,
  FileTextOutlined,
  UserAddOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { InviteForm } from '../components/InviteForm';
import { FieldAssignment } from '../components/FieldAssignment';
import { useInvite } from '../hooks/useInvite';
import { useGetDocumentQuery } from '@/features/documents/services/documents.api';
import type { InviteFormValues } from '../types';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export const InviteSignersPage: React.FC = () => {
  const { t } = useTranslation('invite-signing');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState<InviteFormValues | null>(null);

  // Fetch document and fields
  const {
    data: documentData,
    isLoading: isLoadingDocument,
    error: documentError,
  } = useGetDocumentQuery(id || '', { skip: !id || id === 'new' });

  const document = documentData?.document;
  const fields = documentData?.fields || [];

  const {
    assignedFields,
    handleAssignField,
    handleUnassignField,
    isReadyToSend,
    handleSendInvitations,
    isSending,
  } = useInvite(id || '', fields);

  // Handle form submission (Step 1)
  const handleFormSubmit = (values: InviteFormValues) => {
    setFormValues(values);
    setCurrentStep(1);
  };

  // Handle send invitations (Step 2)
  const handleSend = async () => {
    if (!formValues) return;

    try {
      await handleSendInvitations(formValues);
    } catch (error) {
      // Error is already handled in hook
    }
  };

  // Loading state
  if (isLoadingDocument) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" tip={t('invitePage.loading')} />
      </div>
    );
  }

  // Error state - Document not found
  if (documentError || !document) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: 24,
        }}
      >
        <Result
          status="404"
          title={t('invitePage.documentNotFound')}
          subTitle={t('invitePage.documentNotFoundDescription')}
          extra={
            <Button type="primary" onClick={() => navigate('/documents')}>
              {t('invitePage.backToDocuments')}
            </Button>
          }
        />
      </div>
    );
  }

  // Check if document has fields
  if (fields.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: 24,
        }}
      >
        <Result
          status="warning"
          title={t('invitePage.noFields')}
          subTitle={t('invitePage.noFieldsDescription')}
          extra={
            <Button
              type="primary"
              onClick={() => navigate(`/documents/editor/${id}`)}
            >
              {t('invitePage.addFields')}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          padding: isMobile ? '12px 16px' : '16px 24px',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: isMobile ? 12 : 0,
          }}
        >
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(`/documents/editor/${id}`)}
            >
              {t('invitePage.back')}
            </Button>
            <FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {t('invitePage.title')}
              </Title>
              <Text type="secondary">{document.title}</Text>
            </div>
          </Space>
        </div>
      </div>

      {/* Steps */}
      <div style={{ padding: isMobile ? '16px' : '24px 24px 16px', background: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Steps current={currentStep}>
            <Steps.Step
              title={t('invitePage.step1Title')}
              description={t('invitePage.step1Description')}
              icon={<UserAddOutlined />}
            />
            <Steps.Step
              title={t('invitePage.step2Title')}
              description={t('invitePage.step2Description')}
              icon={<FormOutlined />}
            />
          </Steps>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: isMobile ? 16 : 24, background: '#fafafa' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Step 1: Add Signers */}
          {currentStep === 0 && (
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Alert
                message={t('invitePage.step1Alert')}
                type="info"
                showIcon
                closable
              />
              <InviteForm onSubmit={handleFormSubmit} />
            </Space>
          )}

          {/* Step 2: Assign Fields */}
          {currentStep === 1 && formValues && (
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Alert
                message={t('invitePage.step2Alert')}
                description={t('invitePage.step2AlertDescription')}
                type="warning"
                showIcon
                closable
              />

              {/* Signers Summary */}
              <Card title={t('invitePage.signersSummary')}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {formValues.signers.map((signer) => (
                    <div key={`${signer.email}-${signer.order}`}>
                      <Text strong>
                        {signer.order}. {signer.name}
                      </Text>{' '}
                      <Text type="secondary">({signer.email})</Text>
                    </div>
                  ))}
                  <Text type="secondary">
                    {t('invitePage.signingOrder')}: {formValues.signingOrder}
                  </Text>
                </Space>
              </Card>

              {/* Field Assignment */}
              <FieldAssignment
                fields={fields}
                signers={formValues.signers}
                assignedFields={assignedFields}
                onAssign={handleAssignField}
                onUnassign={handleUnassignField}
              />

              {/* Actions */}
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button size="large" onClick={() => setCurrentStep(0)}>
                  {t('invitePage.previous')}
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<SendOutlined />}
                  onClick={handleSend}
                  disabled={!isReadyToSend}
                  loading={isSending}
                >
                  {t('invitePage.sendInvitations')}
                </Button>
              </Space>
            </Space>
          )}
        </div>
      </div>
    </div>
  );
};

