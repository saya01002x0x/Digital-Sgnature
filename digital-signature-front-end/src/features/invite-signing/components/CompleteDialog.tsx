/**
 * CompleteDialog Component
 * Confirmation modal for completing signature
 */

import React from 'react';
import { Modal, Space, Typography, Alert } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

type CompleteDialogProps = {
  visible: boolean;
  loading: boolean;
  documentTitle: string;
  signerName: string;
  fieldsCount: number;
  onConfirm: () => void;
  onCancel: () => void;
};

export const CompleteDialog: React.FC<CompleteDialogProps> = ({
  visible,
  loading,
  documentTitle,
  signerName,
  fieldsCount,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation('invite-signing');

  return (
    <Modal
      title={
        <Space>
          <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24 }} />
          <span>{t('completeDialog.title')}</span>
        </Space>
      }
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText={t('completeDialog.confirm')}
      cancelText={t('completeDialog.cancel')}
      okButtonProps={{ type: 'primary', loading }}
      confirmLoading={loading}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Alert
          message={t('completeDialog.warning')}
          description={t('completeDialog.warningDescription')}
          type="info"
          showIcon
        />

        <div>
          <Text type="secondary">{t('completeDialog.documentLabel')}</Text>
          <br />
          <Title level={5} style={{ margin: 0 }}>
            {documentTitle}
          </Title>
        </div>

        <div>
          <Text type="secondary">{t('completeDialog.signerLabel')}</Text>
          <br />
          <Text strong>{signerName}</Text>
        </div>

        <div>
          <Text type="secondary">{t('completeDialog.fieldsLabel')}</Text>
          <br />
          <Text strong>
            {t('completeDialog.fieldsCount', { count: fieldsCount })}
          </Text>
        </div>

        <Alert
          message={t('completeDialog.finalNote')}
          type="success"
          showIcon
        />
      </Space>
    </Modal>
  );
};

