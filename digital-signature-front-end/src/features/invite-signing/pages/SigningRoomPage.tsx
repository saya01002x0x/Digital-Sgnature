/**
 * SigningRoomPage Component
 * Public page for signers to sign documents
 * Responsive design for mobile and desktop
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Space, Button, Alert, Spin, Result, message, Grid } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { SigningView } from '../components/SigningView';
import { DeclineDialog } from '../components/DeclineDialog';
import { CompleteDialog } from '../components/CompleteDialog';
import { useSigning } from '../hooks/useSigning';
import type { DeclineFormValues } from '../types';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export const SigningRoomPage: React.FC = () => {
  const { t } = useTranslation('invite-signing');
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const {
    session,
    isLoadingSession,
    sessionError,
    fieldValues,
    handleFieldChange,
    allFieldsFilled,
    handleCompleteSigning,
    handleDeclineSigning,
    isCompleting,
    isDeclining,
  } = useSigning(token || '');

  // Handle complete signing
  const onComplete = async () => {
    try {
      await handleCompleteSigning();
      setShowCompleteDialog(false);
      // Show success message and redirect to documents page
      message.success(t('signingRoom.signSuccess', 'Ký tài liệu thành công!'));
      navigate('/documents');
    } catch (error) {
      // Error is already handled in hook with message
    }
  };

  // Handle decline signing
  const onDecline = async (values: DeclineFormValues) => {
    try {
      await handleDeclineSigning(values);
      setShowDeclineDialog(false);
      setIsCompleted(true);
    } catch (error) {
      // Error is already handled in hook with message
    }
  };

  // Loading state
  if (isLoadingSession) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" tip={t('signingRoom.loading')} />
      </div>
    );
  }

  // Error state - Invalid or expired token
  if (sessionError || !session) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: isMobile ? 16 : 24,
        }}
      >
        <Result
          status="404"
          title={t('signingRoom.invalidToken')}
          subTitle={t('signingRoom.invalidTokenDescription')}
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              {t('signingRoom.backToHome')}
            </Button>
          }
        />
      </div>
    );
  }

  // Already completed state
  if (isCompleted || session.signer.status === 'SIGNED' || session.signer.status === 'DECLINED') {
    const isDeclined = isCompleted
      ? showDeclineDialog
      : session.signer.status === 'DECLINED';

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: isMobile ? 16 : 24,
        }}
      >
        <Result
          status={isDeclined ? 'error' : 'success'}
          icon={
            isDeclined ? (
              <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
            ) : (
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
            )
          }
          title={
            isDeclined
              ? t('signingRoom.declined')
              : t('signingRoom.completed')
          }
          subTitle={
            isDeclined
              ? t('signingRoom.declinedDescription')
              : t('signingRoom.completedDescription')
          }
          extra={[
            <Button key="home" onClick={() => navigate('/')}>
              {t('signingRoom.backToHome')}
            </Button>,
          ]}
        />
      </div>
    );
  }

  // Main signing view
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
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
            maxWidth: 1600,
            margin: '0 auto',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: isMobile ? 12 : 0,
          }}
        >
          <Space>
            <FileTextOutlined style={{ fontSize: isMobile ? 20 : 24, color: '#1890ff' }} />
            <div>
              <Title level={isMobile ? 5 : 4} style={{ margin: 0 }}>
                {t('signingRoom.title')}
              </Title>
              <Text type="secondary" style={{ fontSize: isMobile ? 12 : 14 }}>
                {session.document.title}
              </Text>
            </div>
          </Space>

          <Space size={isMobile ? 'small' : 'middle'} style={{ justifyContent: isMobile ? 'flex-end' : 'flex-start' }}>
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => setShowDeclineDialog(true)}
              size={isMobile ? 'middle' : 'middle'}
            >
              {!isMobile && t('signingRoom.decline')}
            </Button>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => setShowCompleteDialog(true)}
              disabled={!allFieldsFilled}
              size={isMobile ? 'middle' : 'middle'}
            >
              {t('signingRoom.complete')}
            </Button>
          </Space>
        </div>
      </div>

      {/* Alert */}
      <div style={{ padding: isMobile ? '12px 16px' : '16px 24px', background: '#fafafa' }}>
        <div style={{ maxWidth: 1600, margin: '0 auto' }}>
          <Alert
            message={t('signingRoom.welcomeMessage', { name: session.signer.name })}
            description={!isMobile ? t('signingRoom.instructions') : undefined}
            type="info"
            showIcon
            closable
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: isMobile ? 12 : 24 }}>
        <div style={{ maxWidth: 1600, margin: '0 auto' }}>
          <SigningView
            session={session}
            onFieldChange={handleFieldChange}
            fieldValues={fieldValues}
          />
        </div>
      </div>

      {/* Dialogs */}
      <DeclineDialog
        visible={showDeclineDialog}
        loading={isDeclining}
        onSubmit={onDecline}
        onCancel={() => setShowDeclineDialog(false)}
      />

      <CompleteDialog
        visible={showCompleteDialog}
        loading={isCompleting}
        documentTitle={session.document.title}
        signerName={session.signer.name}
        fieldsCount={session.fields.length}
        onConfirm={onComplete}
        onCancel={() => setShowCompleteDialog(false)}
      />
    </div>
  );
};

